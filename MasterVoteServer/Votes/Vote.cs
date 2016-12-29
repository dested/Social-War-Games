using Common.Data;

namespace MasterVoteServer.Votes
{
    public abstract class Vote
    {
        public string UnitId { get; set; }
        public abstract bool Equivalent(Vote vote);
        public int Count { get; set; }
        public int Generation { get; set; }
        public abstract void Complete(MongoGameState.GameState state);
    }
}