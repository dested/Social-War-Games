using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BoardUtils;
using Common.Data;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.BoardUtils;
using Common.Utils;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Driver;
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
        private Timer timer;

        private MasterVoteServerLogic()
        {
            GameListener = new GameListener();
            GameManager = new GameManager();
            gameTick(null);
        }

        public void gameTick(object state)
        {
            timer?.Dispose();
            Task.WaitAll(GameListener.SendStopVote(new StopVoteMessage()));
            GameManager.Tick();
            timer = new Timer(gameTick, null, GameManager.GameState.TickIntervalSeconds * 1000, -1);
            GameListener.OnGameVote(GameManager.GameState.Generation, (message) =>
            {
                GameManager.AddVote(message.Vote);
            });
            Task.WaitAll(GameListener.SendNewRound(new NewRoundMessage()
            {
                State = GameManager.GameState
            }));
        }



    }
}