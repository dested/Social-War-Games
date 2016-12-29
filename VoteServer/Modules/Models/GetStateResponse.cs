using Common.Data;

namespace VoteServer.Modules.Models
{
    public class GetStateResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
}