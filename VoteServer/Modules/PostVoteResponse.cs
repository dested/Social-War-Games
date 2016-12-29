using Common.Data;

namespace VoteServer.Modules
{
    public class PostVoteResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
}