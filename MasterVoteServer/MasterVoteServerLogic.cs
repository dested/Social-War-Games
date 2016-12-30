using System;
using System.Threading;
using System.Threading.Tasks;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;

namespace MasterVoteServer
{
    public class MasterVoteServerLogic
    {
        private static MasterVoteServerLogic instance;
        public static MasterVoteServerLogic GetServerLogic()
        {
            if (instance == null)
            {
                instance=new MasterVoteServerLogic();
            }
            return instance;
        }

        public GameManager GameManager;
        public GameListener GameListener;
        public string VoteServerId = Guid.NewGuid().ToString();
        private MasterVoteServerLogic()
        {
            GameListener = new GameListener();
            GameManager = new GameManager();

            new Timer(gameTick, null, new TimeSpan(0, 5, 0), new TimeSpan(0, 5, 0));
            GameListener.OnGameVote(async (message) =>
            {
                await OnGameVote(message);
            });
        }

        private void gameTick(object state)
        {
            GameManager.Tick();
        }

        private async Task OnGameVote(GameVoteMessage message)
        {
            GameManager.AddVote(message.Vote);
        }
    }
}