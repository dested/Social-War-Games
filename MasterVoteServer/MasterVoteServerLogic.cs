using System;
using System.Threading.Tasks;
using Common.GameLogic;
using Common.GameLogic.Models;

namespace MasterVoteServer
{
    public class MasterVoteServerLogic
    {
        public GameListener GameListener;
        public string VoteServerId = Guid.NewGuid().ToString();
        public MasterVoteServerLogic()
        {
            GameListener = new GameListener();

            GameListener.OnGameVote(async (message) =>
            {
                await OnGameVote(message);
            });

        }

        private async Task OnGameVote(GameVoteMessage message)
        {

        }
    }
}