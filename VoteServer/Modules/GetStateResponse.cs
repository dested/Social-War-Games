using Common.Data;

namespace VoteServer.Modules
{
    public class GetStateResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    }
}