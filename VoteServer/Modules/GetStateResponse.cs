using Common.Data;

namespace VoteServer.Modules
{
    public class GetStateResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
}