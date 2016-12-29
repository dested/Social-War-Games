using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.Utils.Mongo;

namespace VoteServer
{
    public class VoteServerLogic
    {
        public GameListener GameListener;
        public string VoteServerId = Guid.NewGuid().ToString();
        public VoteServerLogic()
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