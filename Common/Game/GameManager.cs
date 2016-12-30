﻿using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.Utils.Mongo;

namespace Common.Game
{
    public class GameManager
    {
        private Dictionary<string, int> UserVotes = new Dictionary<string, int>();
        private List<TrackedVote> TrackedVotes = new List<TrackedVote>();
        public MongoGameState.GameState GameState { get; set; }
        private object locker = new object();

        public GameManager()
        {
            GameState = MongoGameState.Collection.GetOneSync(a => true);
        }

        public bool AddVote(MongoGameVote.GameVote vote)
        {
            lock (locker)
            {
                var details = vote.Action;
                if (GameState.Generation != vote.Generation)
                {
                    return false;
                }

                if (UserVotes.ContainsKey(details.UserId))
                {
                    UserVotes[details.UserId]++;
                }
                else
                {
                    UserVotes[details.UserId] = 1;
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
                foreach (var unitVotes in TrackedVotes.GroupBy(a => a.Action.EntityId))
                {
                    var vote = unitVotes.OrderByDescending(a => a.Votes).First();
                    vote.Action.Complete(GameState);
                }
                TrackedVotes.Clear();
                UserVotes.Clear();
                GameState.Generation += 1;
                GameState.UpdateSync();
            }
        }

    }

    public class TrackedVote
    {
        public MongoGameVote.VoteAction Action { get; set; }
        public int Votes { get; set; }
    }
}