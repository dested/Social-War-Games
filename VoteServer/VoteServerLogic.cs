using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.Utils.Mongo;

namespace VoteServer
{
    public class VoteServerLogic
    {
        public GameManager GameManager { get; set; }
        public GameListener GameListener { get; set; }
        public string VoteServerId = Guid.NewGuid().ToString();
        public VoteServerLogic()
        {
            GameManager = new GameManager();
            GameListener = new GameListener();

            GameListener.OnGameVote((message) =>
            {
                GameManager.AddVote(message.Vote);
            });
            GameListener.OnStopVote((message) =>
            {
                GameManager.Locked = true;
            });
            GameListener.OnNewRound((message) =>
            {
                GameManager.UpdateGameState();
                GameManager.Locked = false;
            });

        }

    }
}