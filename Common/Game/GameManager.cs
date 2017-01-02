using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.Utils.Mongo;
using Newtonsoft.Json;

namespace Common.Game
{
    public class GameManager
    {
        public Dictionary<string, int> UserVotes = new Dictionary<string, int>();
        public List<TrackedVote> TrackedVotes = new List<TrackedVote>();
        public MongoGameState.GameState GameState { get; set; }
        public bool Locked { get; set; }

        private object locker = new object();

        public GameManager()
        {
            UpdateGameState(true);
        }
        public void UpdateGameState(bool getVotes)
        {
            GameState = MongoGameState.Collection.GetOneSync(a => !a.Initial);
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
                Console.WriteLine("Ticking");
                if (TrackedVotes.Count == 0) return;
                MongoServerLog.AddServerLog("Master.vote", JsonConvert.SerializeObject(TrackedVotes), null);

                foreach (var unitVotes in TrackedVotes.GroupBy(a => a.Action.EntityId))
                {
                    var vote = unitVotes.OrderByDescending(a => a.Votes).First();
                    vote.Action.Complete(GameState);
                }

                MongoTickResult.TickResult result = new MongoTickResult.TickResult();
                result.Generation = GameState.Generation;
                result.Generated = DateTime.UtcNow;
                result.Votes = TrackedVotes;
                result.InsertSync();

                GameState.Generation += 1;
                GameState.LastGeneration = DateTime.UtcNow;
                GameState.UpdateSync();

                sw.Stop();

                Console.WriteLine($"{sw.ElapsedMilliseconds}ms Votes: {TrackedVotes.Sum(a => a.Votes)} Actions: {TrackedVotes.Count} Generation: {GameState.Generation}");
                Reset();
            }
        }

        public void Reset()
        {
            TrackedVotes.Clear();
            UserVotes.Clear();
        }

    }

    public class TrackedVote
    {
        public MongoGameVote.VoteAction Action { get; set; }
        public int Votes { get; set; }
    }
}