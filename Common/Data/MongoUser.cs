using System;
using System.Collections.Generic;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Common.Data
{
    public static class MongoUser
    {
        public static string CollectionName = "user";

        public static IMongoCollection<User> Collection => MongoTools.GetCollection<User>();

        [BsonIgnoreExtraElements]
        public class User : IMongoModel
        {
            public ObjectId Id { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public List<UserGeneration> Generations { get; set; }
        }

        [BsonIgnoreExtraElements]
        public class UserGeneration
        {
            public int GenerationId { get; set; }
            public List<string> Votes { get; set; }
        }
    }
}
