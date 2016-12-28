using Common.Data;

namespace VoteServer.Modules
{
    public class PostVoteResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    }
}