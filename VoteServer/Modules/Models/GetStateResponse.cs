using Common.Data;

namespace VoteServer.Modules.Models
{
    public class GetStateResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
    public class GetGenerationResponse
    {
        public int Generation { get; set; }
    }
}