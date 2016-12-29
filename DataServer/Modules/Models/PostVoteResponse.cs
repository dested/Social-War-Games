using Common.Data;

namespace DataServer.Modules.Models
{
    public class PostVoteResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    }
}