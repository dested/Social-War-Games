using Common.Data;

namespace Common.GameLogic.Models
{
    public class NewRoundMessage
    {
    }

    public class BootUserMessage
    {
        public string UserId { get; set; }
    }
    public class GameVoteMessage
    {
         public MongoGameVote.GameVote Vote { get; set; }
    }

}