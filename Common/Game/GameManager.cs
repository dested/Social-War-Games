using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.Utils.Mongo;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace Common.Game
{
    public class GameManager
    {
        public Dictionary<string, int> UserVotes = new Dictionary<string, int>();
        public ConcurrentBag<TrackedVote> TrackedVotes = new ConcurrentBag<TrackedVote>();
        public MongoGameState.GameState GameState { get; set; }
        public GameBoard GameBoard { get; set; }
        public bool Locked { get; set; }
        public Random Random { get; set; } = new Random(31337);

        private object locker = new object();

        public GameManager()
        {
            UpdateGameState(true);
        }
        public void UpdateGameState(bool getVotes)
        {
            GameState = MongoGameState.Collection.GetOneSync(a => !a.Initial);
            this.GameBoard = new GameBoard(GameState);
            if (getVotes)
            {
                var votes = MongoGameVote.Collection.GetAllSync(a => a.Generation == GameState.Generation);
                foreach (var vote in votes)
                {
                    AddVote(vote);
                }
            }
        }


        public bool AddVote(MongoGameVote.GameVote vote)
        {
            if (Locked) return false;
            lock (locker)
            {
                var details = vote.Action;
                if (GameState.Generation != vote.Generation)
                {
                    //                    Console.WriteLine("Bad generation " + GameState.Generation + " " + vote.Generation);
                    return false;
                }

                if (UserVotes.ContainsKey(vote.UserId))
                {
                    UserVotes[vote.UserId]++;
                }
                else
                {
                    UserVotes[vote.UserId] = 1;
                }

                var trackedVote = TrackedVotes.FirstOrDefault(a => details.EntityId == a.Action.EntityId && details.ActionType == a.Action.ActionType && details.Equates(a.Action));

                if (trackedVote == null)
                {
                    TrackedVotes.Add(new TrackedVote()
                    {
                        Action = vote.Action,
                        Votes = 1,
                    });
                }
                else
                {
                    trackedVote.Votes++;
                }
                return true;
            }
        }
        public void Tick()
        {
            lock (locker)
            {
                var sw = new Stopwatch();
                sw.Start();
                if (TrackedVotes.Count == 0)
                {
                    Console.WriteLine("Ticking No Data");
                    GameState.LastGeneration = DateTime.UtcNow;
                    GameState.UpdateSync();
                    return;
                }
                List<TrackedVote> votes = new List<TrackedVote>();

                List<TrackedVote> moveVotes = new List<TrackedVote>();
                List<TrackedVote> attackVotes = new List<TrackedVote>();
                List<TrackedVote> spawnVotes = new List<TrackedVote>();
                Console.WriteLine("Ticking");


                foreach (var unitVotes in TrackedVotes.GroupBy(a => a.Action.EntityId))
                {
                    var vote = unitVotes.OrderByDescending(a => a.Votes).First();
                    switch (vote.Action.ActionType)
                    {
                        case MongoGameVote.VoteActionType.Move:
                            moveVotes.Add(vote);
                            break;
                        case MongoGameVote.VoteActionType.Attack:
                            attackVotes.Add(vote);
                            break;
                        case MongoGameVote.VoteActionType.Spawn:
                            spawnVotes.Add(vote);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }

                foreach (var vote in attackVotes)
                {
                    if (vote.Action.Valid(this))
                    {
                        vote.Action.Complete(this);
                        votes.Add(vote);
                    }
                }


                var nextMoveVotes = new List<TrackedVote>();

                foreach (var vote in moveVotes)
                {
                    if (vote.Action.Valid(this))
                    {
                        vote.Action.Start(this);
                        votes.Add(vote);
                        nextMoveVotes.Add(vote);
                    }
                }
                var originalMoveVotes = nextMoveVotes;


                while (nextMoveVotes.Count > 0)
                {
                    var nextVotes = new List<TrackedVote>();

                    foreach (var moveVote in nextMoveVotes)
                    {
                        if (moveVote.Action.NextTick(this))
                        {
                            nextVotes.Add(moveVote);
                        }
                    }
                    nextMoveVotes = nextVotes;
                }


                foreach (var moveVote in originalMoveVotes)
                {
                    moveVote.Action.Complete(this);
                }


                foreach (var spawnVote in spawnVotes)
                {
                    if (spawnVote.Action.Valid(this))
                    {
                        spawnVote.Action.Complete(this);
                    }
                }



                foreach (var entity in this.GameState.Entities)
                {
                    if (entity.Health > 0)
                    {
                        var detail = EntityDetails.Detail[entity.EntityType];
                        entity.Health += detail.HealthRegenRate;
                        if (entity.Health > detail.Health)
                        {
                            entity.Health = detail.Health;
                        }
                    }
                }

                var gameStateFactionData = this.GameBoard.ToFactionData(this.GameState.Terrain);
                sw.Stop();
                var tickTime = sw.ElapsedMilliseconds;
                sw.Reset();
                sw.Start();
                MongoTickResult.TickResult result = new MongoTickResult.TickResult();
                result.Generation = GameState.Generation;
                result.Generated = DateTime.UtcNow;
                result.Votes = votes;
                result.UsersVoted = UserVotes.Count;
                result.InsertSync();

                GameState.Generation += 1;
                GameState.LastGeneration = DateTime.UtcNow;
                GameState.FactionData = gameStateFactionData;
                GameState.UpdateSync();

                sw.Stop();

                MongoGameVote.Collection.DeleteMany(Builders<MongoGameVote.GameVote>.Filter.Lte(a => a.Generation, GameState.Generation - 1));

                var formattableString = $"{sw.ElapsedMilliseconds}ms Update, {tickTime}ms Tick, Votes: {TrackedVotes.Sum(a => a.Votes)} Actions: {TrackedVotes.Count}  Users Participated: {UserVotes.Count} Generation: {GameState.Generation - 1}";
                MongoServerLog.AddServerLog("Master.vote", formattableString, null);
                Reset();
            }
        }

        public void Reset()
        {
            TrackedVotes = new ConcurrentBag<TrackedVote>();
            UserVotes.Clear();
        }

    }

    public class TrackedVote
    {
        public MongoGameVote.VoteAction Action { get; set; }
        public int Votes { get; set; }
    }
}