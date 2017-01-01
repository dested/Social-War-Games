using System;
using System.Threading;
using System.Threading.Tasks;
using Common.Data;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;
using Newtonsoft.Json;

namespace MasterVoteServer
{
    public class MasterVoteServerLogic
    {
        private static MasterVoteServerLogic instance;
        public static MasterVoteServerLogic GetServerLogic()
        {
            if (instance == null)
            {
                instance = new MasterVoteServerLogic();
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

            new Timer(gameTick, null, new TimeSpan(0, 1, 0), new TimeSpan(0, 1, 0));
            GameListener.OnGameVote((message) =>
            {
                GameManager.AddVote(message.Vote);
            });
        }

        private void gameTick(object state)
        {
            MongoServerLog.AddServerLog("Master.tick", "1", "1");
            Task.WaitAll(GameListener.SendStopVote(new StopVoteMessage()));
            GameManager.Tick();
            GameManager.Reset();
            Task.WaitAll(GameListener.SendNewRound(new NewRoundMessage()));
            MongoServerLog.AddServerLog("Master.end", "1", "1");
        }

    }
}