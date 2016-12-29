using Common.Data;

namespace DataServer.Modules.Models
{
    public class PostVoteResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
}