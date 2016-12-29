using Common.HexUtils;

namespace DataServer.Modules.Models
{
    public class GetStateResponse
    {
        public HexBoardModel State { get; set; }
    }
}