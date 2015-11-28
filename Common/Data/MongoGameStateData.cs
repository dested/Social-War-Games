using System;
using System.Collections.Generic;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Common.Data
{
    public static class MongoGameStateData
    {
        public static string CollectionName = "gameState";

        public static MongoCollection<GameStateData> Collection
        {
            get { return MongoTools.GetCollection<GameStateData>(); }
        }
        public static MongoCollection<T> CollectionAs<T>() where T : GameStateData
        {
            return MongoTools.GetCollection<T>();
        }

        [BsonIgnoreExtraElements]
        public class GameStateData : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime LastTick { get; set; }
            public int Width { get; set; }
            public int Height { get; set; }
            public List<GameFaction> Factions { get; set; }
        }
        [BsonIgnoreExtraElements]
        public class GameFaction
        {
            public string Id { get; set; }
            public string Color { get; set; }
            public List<GameUnit> Units { get; set; }
        }
        [BsonIgnoreExtraElements]
        public class GameUnit
        {
            public string Id { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public GameUnitType UnitType { get; set; }
            public int Health { get; set; }
            public int X { get; set; }
            public int Y { get; set; }
        }
    }

    public enum GameUnitType
    {
        Infantry = 0,
        Tank = 1,
        Base = 2
    }
}
