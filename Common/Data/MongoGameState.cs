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
    public static class MongoGameState
    {
        public static string CollectionName = "gameState";

        public static IMongoCollection<GameState> Collection => MongoTools.GetCollection<GameState>();

        [BsonIgnoreExtraElements]
        public class GameState : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime LastGeneration { get; set; }
            public int TickIntervalSeconds { get; set; }
            public Terrain Terrain { get; set; }
            public List<GameEntity> Entities { get; set; }
            public int Generation { get; set; }
            public string FactionData { get; set; }
            public bool Initial { get; set; }
        }

        [BsonIgnoreExtraElements]
        public class Terrain
        {
            public int Width { get; set; }
            public int Height { get; set; }
            public string BoardStr { get; set; }
        }

        [BsonIgnoreExtraElements]
        public class GameEntity
        {
            public string Id { get; set; }
            public int FactionId { get; set; }

            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public GameEntityType EntityType { get; set; }
            public int Health { get; set; }
            public Direction Direction { get; set; }
            public int X { get; set; }
            public int Z { get; set; }

            public void Hurt(int amount, GameState gameState)
            {
                Health -= amount;
                if (Health <= 0)
                {
                    gameState.Entities.Remove(this);
                }
            }

            public static GameEntity CreateMainBase(int x, int z, int factionId)
            {
                return new GameEntity()
                {
                    X = x,
                    Z = z,
                    EntityType = GameEntityType.MainBase,
                    FactionId = factionId,
                    Health = 30,
                    Id = ObjectId.GenerateNewId().ToString()
                };
            }
            public static GameEntity CreatePlane(int x, int z, int factionId)
            {
                return new GameEntity()
                {
                    X = x,
                    Z = z,
                    EntityType = GameEntityType.Plane,
                    FactionId = factionId,
                    Health = 1,
                    Id = ObjectId.GenerateNewId().ToString()
                };
            }
            public static GameEntity CreateTank(int x, int z, int factionId)
            {
                return new GameEntity()
                {
                    X = x,
                    Z = z,
                    EntityType = GameEntityType.Tank,
                    FactionId = factionId,
                    Health = 1,
                    Id = ObjectId.GenerateNewId().ToString()
                };
            }
        }
        public static MongoGameState.GameEntity GetEntityById(this GameState state, string id)
        {
            foreach (var gameUnit in state.Entities)
            {
                if (gameUnit.Id == id)
                {
                    return gameUnit;
                }
            }
            return null;
        }
        public static GameEntity GetEntityByLocation(this GameState state, int x, int z)
        {
            foreach (var entity in state.Entities)
            {
                if (entity.X == x && entity.Z == z)
                {
                    return entity;
                }
            }
            return null;
        }
    }
    public enum Direction
    {
        Top = 0,
        TopRight = 1,
        BottomRight = 2,
        Bottom = 3,
        BottomLeft = 4,
        TopLeft = 5,
    }
}
