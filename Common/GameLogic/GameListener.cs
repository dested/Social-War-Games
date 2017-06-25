/*using System;
using System.Configuration;
using System.Threading.Tasks;
using Common.GameLogic.Models; 
using Newtonsoft.Json; 

namespace Common.GameLogic
{
    public class GameListener
    {
        private OnPoolClient.OnPoolClient client;
        public GameListener()
        {

            client = new OnPoolClient.OnPoolClient();
            client.ConnectToServer(ConfigurationManager.AppSettings["redis-vote"]);
        }

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

}*/