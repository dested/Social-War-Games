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

        public static IMongoCollection<GameStateData> Collection => MongoTools.GetCollection<GameStateData>();

        [BsonIgnoreExtraElements]
        public class GameStateData : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime LastGeneration{ get; set; }
            public HexBoard Board { get; set; }
            public List<GameFaction> Factions { get; set; }
            public int Generation { get; set; }
        }
        
        [BsonIgnoreExtraElements]
        public class HexBoard
        {
            public int Width { get; set; }
            public int Height { get; set; }
            public string BoardStr { get; set; }
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

            public void Hurt(int amount,GameStateData gameState)
            {
                Health -= amount;
                if (Health <= 0)
                {
                    var faction = gameState.GetFactionByUnitId(Id);
                    faction.Units.Remove(this);
                }
            }
        }
        public static MongoGameStateData.GameUnit GetUnitById(this GameStateData stateData, string id)
        {
            foreach (var gameFaction in stateData.Factions)
            {
                foreach (var gameUnit in gameFaction.Units)
                {
                    if (gameUnit.Id == id)
                    {
                        return gameUnit;
                    }
                }
            }
            return null;
        }
        public static GameFaction GetFactionByUnitId(this GameStateData stateData, string unitId)
        {
            foreach (var gameFaction in stateData.Factions)
            {
                foreach (var gameUnit in gameFaction.Units)
                {
                    if (gameUnit.Id == unitId)
                    {
                        return gameFaction;
                    }
                }
            }
            return null;
        }
        public static MongoGameStateData.GameUnit GetUnitByLocation(this GameStateData stateData, int x, int y)
        {
            foreach (var gameFaction in stateData.Factions)
            {
                foreach (var gameUnit in gameFaction.Units)
                {
                    if (gameUnit.X == x && gameUnit.Y == y)
                    {
                        return gameUnit;
                    }
                }
            }
            return null;
        }

    }
}
