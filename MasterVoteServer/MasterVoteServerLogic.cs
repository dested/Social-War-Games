using System;
using System.Threading;
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

            new Timer(gameTick, null, new TimeSpan(0, 5, 0), new TimeSpan(0, 5, 0));

            GameListener.OnGameVote(async (message) =>
            {
                await OnGameVote(message);
            });

        }

        private void gameTick(object state)
        {
            

        }

        private async Task OnGameVote(GameVoteMessage message)
        {

        }
    }
}