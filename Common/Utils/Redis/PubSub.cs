using System;
using System.Configuration;
using System.Threading.Tasks;
using Newtonsoft.Json;
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

        public async Task Publish<T>(string channel, T message)
        {
            await subscriber.PublishAsync(channel, JsonConvert.SerializeObject(message));
        }

        public void Subscribe<T>(string channel, Action<T> callback)
        {
            subscriber.Subscribe(channel, (_channel, value) =>
            {
                callback(JsonConvert.DeserializeObject<T>(value));
            });
        }
    }
}