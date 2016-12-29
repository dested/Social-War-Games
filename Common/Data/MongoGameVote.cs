using System;
using System.Collections.Generic;
using Common.GameLogic.Models;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Common.Data
{
    public static class MongoGameVote
    {
        public static string CollectionName = "gameVotes";

        public static IMongoCollection<GameVote> Collection => MongoTools.GetCollection<GameVote>();

        [BsonIgnoreExtraElements]
        public class GameVote : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime Generated{ get; set; }
            public GameVoteMessage Details { get; set; }
        } 
    }
}
