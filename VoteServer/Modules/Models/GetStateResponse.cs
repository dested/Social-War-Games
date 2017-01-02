using System.Collections.Generic;
using Common.Data;
using Common.Game;

namespace VoteServer.Modules.Models
{
    public class GetStateResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
    public class GetMetricsResponse
    {
        public GameMetrics Metrics { get; set; }
    }

    public class GameMetrics
    {
        public int Generation { get; set; }
        public TrackedVote[] Votes { get; set; }
        public int UsersVoted { get; set; }
    }
}