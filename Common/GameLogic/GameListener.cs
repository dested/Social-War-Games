using System;
using System.Threading.Tasks;
using Common.GameLogic.Models;
using Common.Utils.Redis;

namespace Common.GameLogic
{
    public class GameListener
    {
        public GameListener()
        {
            PubSub = new PubSub();
        }

        private PubSub PubSub { get; set; }

        public void OnGameVote(Action<GameVoteMessage> callback)
        {
            PubSub.Subscribe("GameVote", callback);
        }
        public void OnStopVote(Action<StopVoteMessage> callback)
        {
            PubSub.Subscribe("StopVote", callback);
        }
        public void OnNewRound(Action<NewRoundMessage> callback)
        {
            PubSub.Subscribe("NewRound", callback);
        }

        public void OnBootUser(Action<BootUserMessage> callback)
        {
            PubSub.Subscribe("BootUser", callback);
        }

        public async Task SendGameVote(GameVoteMessage message)
        {
            await PubSub.Publish("GameVote", message);
        }
        public async Task SendStopVote(StopVoteMessage message)
        {
            await PubSub.Publish("StopVote", message);
        }
        public async Task SendNewRound(NewRoundMessage message)
        {
            await PubSub.Publish("NewRound", message);
        }

        public async Task SendBootUser(BootUserMessage message)
        {
            await PubSub.Publish("BootUser", message);
        }

    }

}