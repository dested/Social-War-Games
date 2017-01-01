using System;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;

namespace Common.Data
{
    public static class MongoServerLog
    {
        public static string CollectionName = "serverLogs";

        public static IMongoCollection<ServerLog> Collection
        {
            get { return MongoTools.GetCollection<ServerLog>(); }
        }

        public static IMongoCollection<T> CollectionAs<T>() where T : ServerLog
        {
            return MongoTools.GetCollection<T>();
        }

        [BsonIgnoreExtraElements]
        public class ServerLog : IMongoModel
        {
            public ObjectId Id { get; set; }
            public string Type { get; set; }
            public string Message { get; set; }
            public string OriginUser { get; set; }
            public string EndPoint { get; set; }
            public string StackTrace { get; set; }
            public DateTime Created { get; set; }

        }

        public static void AddServerLog(string type, string message, string stackTrace, string endPoint = null, string originUser = null)
        {
            ServerLog log = new ServerLog();
            log.Type = type;
            log.Message = message;
            log.StackTrace = stackTrace;
            log.OriginUser = originUser;
            log.EndPoint = endPoint;
            log.Created = DateTime.UtcNow;
            log.InsertSync();
            pushToCloudWatch(log);

        }
        public static void AddServerLog(string type, Exception ex, string message, string stackTrace, string endPoint = null, string originUser = null)
        {
            var log = new ServerLog();
            log.Type = type;
            log.Message = message + "  " + ex.ToString();
            log.StackTrace = stackTrace;
            log.OriginUser = originUser;
            log.EndPoint = endPoint;
            log.Created = DateTime.UtcNow;
            log.InsertSync();
            pushToCloudWatch(log);
        }

        public static void AddServerLog(string type, Exception exception, string endPoint = null, string originUser = null)
        {
            ServerLog log = new ServerLog();
            log.Type = type;
            log.Message = exception.ToString();
            log.StackTrace = exception.StackTrace;
            log.OriginUser = originUser;
            log.EndPoint = endPoint;
            log.Created = DateTime.UtcNow;
            log.InsertSync();
            pushToCloudWatch(log);
        }

        private static void pushToCloudWatch(ServerLog log)
        {
            Console.WriteLine(JsonConvert.SerializeObject(log));
        }
    }
}