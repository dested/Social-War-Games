using System;
using System.Collections.Generic;
using System.Linq;
using Common.BoardUtils;
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
    public static class MongoGameVote
    {
        public static string CollectionName = "gameVotes";

        public static IMongoCollection<GameVote> Collection => MongoTools.GetCollection<GameVote>();

        [BsonIgnoreExtraElements]
        public class GameVote : IMongoModel
        {
            public ObjectId Id { get; set; }
            public DateTime Generated { get; set; }
            public int Generation { get; set; }
            public VoteAction Action { get; set; }
            public string UserId { get; set; }
        }

        [BsonKnownTypes(typeof(MoveVoteAction), typeof(AttackVoteAction), typeof(SpawnVoteAction))]
        public abstract class VoteAction
        {
            public string EntityId { get; set; }
            public abstract bool Equates(VoteAction argAction);

            public abstract VoteActionType ActionType { get; }
            public abstract bool Complete(GameManager gameManager);
        }
        public class MoveVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public override VoteActionType ActionType { get; } = VoteActionType.Move;
            public override bool Equates(VoteAction a)
            {
                var action = a as MoveVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z;
            }

            public override bool Complete(GameManager gameManager)
            {
                var entity = gameManager.GameState.Entities.First(a => a.Id == EntityId);

                if (gameManager.GameState.Entities.Any(a => a.X == X && a.Z == Z))
                {
                    return false;
                }


                var chex = gameManager.GameBoard.GetHexagon(entity.X, entity.Z);
                var fhex = gameManager.GameBoard.GetHexagon(X, Z);

                var path = gameManager.GameBoard.PathFind(chex, fhex);

                entity.X = this.X;
                entity.Z = this.Z;

                var oldP = path[0];
                foreach (var p in path)
                {
                    p.Faction = entity.FactionId;

                    entity.Direction = HexUtils.GetDirection(oldP, p);
                    oldP = p;
                    foreach (var neighbor in p.GetNeighbors())
                    {
                        var hex = gameManager.GameBoard.GetHexagon(neighbor.X, neighbor.Z);
                        if (hex != null)
                        {
                            hex.Faction = entity.FactionId;
                        }
                    }
                }
                return true;

            }
        }
        public class AttackVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public override VoteActionType ActionType { get; } = VoteActionType.Attack;
            public override bool Equates(VoteAction a)
            {
                var action = a as AttackVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z;
            }
            public override bool Complete(GameManager gameManager)
            {
                var entity = gameManager.GameState.Entities.First(a => a.Id == EntityId);

                var enemyEntity = gameManager.GameState.Entities.FirstOrDefault(a => a.X == X && a.Z == Z);

                if (enemyEntity == null)
                {
                    return false;
                }

                var attackerDetail = EntityDetails.Detail[entity.EntityType];
                var enemyDetail = EntityDetails.Detail[enemyEntity.EntityType];
                //todo take into account shield from enemy

                int amount = gameManager.Random.Next(0, attackerDetail.AttackPower) + 1;

                if (enemyEntity.Hurt(amount, gameManager.GameState))
                {
                    var hex = gameManager.GameBoard.GetHexagon(X, Z);
                    if (hex != null)
                    {
                        hex.Faction = entity.FactionId;
                    }
                }


                return true;
            }

        }

        public class SpawnVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public GameEntityType EntityType { get; set; }
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public override VoteActionType ActionType { get; } = VoteActionType.Spawn;
            public override bool Equates(VoteAction a)
            {
                var action = a as SpawnVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z && EntityType == action.EntityType;
            }
            public override bool Complete(GameManager gameManager)
            {
                return true;

            }

        }

        public enum VoteActionType
        {
            Move, Attack, Spawn
        }
    }
}
