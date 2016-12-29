using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.Utils.Mongo;

namespace DataServer
{
    public class DataGameLogic
    {
        public GameListener GameListener;

        public DataGameLogic()
        {
            GameListener = new GameListener();

            GameListener.OnGameVote(async (message) =>
            {
                await OnGameVote(message);
            });

        }

        private async Task OnGameVote(GameVoteMessage message)
        {
            var user =await MongoUser.Collection.GetById(message.UserId);
            user.Exists();
            var generation = user.Generations.FirstOrDefault(a => a.GenerationId == message.GenerationId) ??
                             new MongoUser.UserGeneration()
                             {
                                 GenerationId = message.GenerationId,
                                 Votes = new List<string>()
                             };


            if (generation.Votes.Count >= 5)
            {
                await GameListener.SendBootUser(new BootUserMessage() { UserId = user.Id.ToString() });
                return;
            }
            MongoGameVote.GameVote vote = new MongoGameVote.GameVote();
            vote.Generated = DateTime.UtcNow;
            vote.Details = message;
            await vote.Insert();
            generation.Votes.Add(vote.Id.ToString());
            await user.Update();
        }
    }
}