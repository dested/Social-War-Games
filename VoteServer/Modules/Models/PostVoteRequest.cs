namespace VoteServer.Modules.Models
{
    public class PostVoteRequest
    {
        public string UserId { get; set; }
        public string EntityId { get; set; }
        public string Action { get; set; }
        public int Generation { get; set; }
        public int X { get; set; }
        public int Z { get; set; }
    }
}