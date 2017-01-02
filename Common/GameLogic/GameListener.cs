using System;
using System.Configuration;
using System.Threading.Tasks;
using Common.GameLogic.Models;
using Common.Utils.Redis;

namespace Common.GameLogic
{
    public class GameListener
    {

        public GameListener()
        {

            VotePubSub = new PubSub(ConfigurationManager.AppSettings["redis-vote"]);
            StatePubSub = new PubSub(ConfigurationManager.AppSettings["redis-state"]);
        }

        private PubSub VotePubSub { get; set; }
        private PubSub StatePubSub { get; set; }

        private string lastGameVote = null;

        public void OnGameVote(int generation, Action<GameVoteMessage> callback)
        {
            var channel = "GameVote" + generation;
            if (lastGameVote != null)
            {
                VotePubSub.Unsubscribe(lastGameVote);
            }
            lastGameVote = channel;
            VotePubSub.Subscribe(channel, callback);
        }
        public void OnStopVote(Action<StopVoteMessage> callback)
        {
            StatePubSub.Subscribe("StopVote", callback);
        }
        public void OnNewRound(Action<NewRoundMessage> callback)
        {
            StatePubSub.Subscribe("NewRound", callback);
        }


        public async Task SendGameVote(int generation, GameVoteMessage message)
        {
            await VotePubSub.Publish("GameVote" + generation, message);
        }
        public async Task SendStopVote(StopVoteMessage message)
        {
            await StatePubSub.Publish("StopVote", message);
        }
        public async Task SendNewRound(NewRoundMessage message)
        {
            await StatePubSub.Publish("NewRound", message);
        }

    }

}