using System;
using System.Configuration;
using System.Threading.Tasks;
using Common.Utils.JsonUtils;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Common.Utils.Redis
{
    public class PubSub
    {
        private ISubscriber subscriber;

        public PubSub(string redisStr)
        {


            Console.WriteLine("----REDIS SERVER----");
            Console.WriteLine(redisStr);
            Console.WriteLine("----REDIS SERVER----");
             
            ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(redisStr);
            this.subscriber = redis.GetSubscriber();
        }

        public async Task Publish<T>(string channel, T message)
        {
            await subscriber.PublishAsync(channel, Json.Serialize(message,true));
        }

        public void Subscribe<T>(string channel, Action<T> callback)
        {
            subscriber.Subscribe(channel, (_channel, value) =>
            {
                callback(Json.Deserialize<T>(value, true));
            });
        }
        public void Unsubscribe(string channel)
        {
            subscriber.Unsubscribe(channel);
        }
    }
}