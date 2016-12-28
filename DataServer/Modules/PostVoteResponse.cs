using Common.Data;

namespace DataServer.Modules
{
    public class PostVoteResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    }
}