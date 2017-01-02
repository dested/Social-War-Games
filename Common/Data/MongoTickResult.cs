using System;
using System.Collections.Generic;
using System.Linq;
using Common.Game;
using Common.GameLogic.Models;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Common.Data
{
    public static class MongoTickResult
    {
        public static string CollectionName = "tickResult";

        public static IMongoCollection<TickResult> Collection => MongoTools.GetCollection<TickResult>();

        [BsonIgnoreExtraElements]
        public class TickResult : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime Generated { get; set; }
            public int Generation { get; set; }
            public List<TrackedVote> Votes { get; set; }
        }
          
    }
}
