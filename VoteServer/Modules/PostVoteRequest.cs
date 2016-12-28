namespace VoteServer.Modules
{
    public class PostVoteRequest
    {
        public string UnitId { get; set; }
        public string Action { get; set; }
        public int Generation { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
}