using System;
using System.Configuration;
using StackExchange.Redis;

namespace Common.Utils.Redis
{
    public class PubSub
    {
        private ISubscriber subscriber;

        public PubSub()
        {
            var redisStr = ConfigurationManager.AppSettings["redis"];

            ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(redisStr);
            this.subscriber = redis.GetSubscriber();
        }

        public async void Publish(string channel, string message)
        {
            await subscriber.PublishAsync(channel, message);
        }
        public async void Subscribe(string channel,Action<string> callback)
        {
            await subscriber.SubscribeAsync(channel, (_channel, value) =>
            {
                callback(value);
            });
        }
    }
}