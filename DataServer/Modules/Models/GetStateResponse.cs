using System.Collections.Generic;
using Common.Data;
using Common.GameLogic;
using Common.HexUtils;

namespace DataServer.Modules.Models
{
    public class GetStateResponse
    {
        public MongoGameState.GameState State { get; set; }
    }
}