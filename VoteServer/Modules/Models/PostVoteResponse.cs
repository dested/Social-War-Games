using System.Collections.Generic;
using Common.Game;

namespace VoteServer.Modules.Models
{
    public class PostVoteResponse
    {
        public bool IssueVoting { get; set; }
        public bool GenerationMismatch { get; set; }
        public TrackedVote[] Votes { get; set; }
    }
}