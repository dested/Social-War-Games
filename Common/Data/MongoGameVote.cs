using System;
using System.Collections.Generic;
using System.Linq;
using Common.BoardUtils;
using Common.Game;
using Common.GameLogic;
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
            public abstract bool Valid(GameManager gameManager);
            public abstract void Start(GameManager gameManager);
            public abstract bool NextTick(GameManager gameManager);
            public abstract void Complete(GameManager gameManager);
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


            public override bool Valid(GameManager gameManager)
            {
                var entity = gameManager.GameState.Entities.First(a => a.Id == EntityId);

                if (gameManager.GameState.Entities.Any(a => a.X == X && a.Z == Z))
                {
                    return false;
                }
                this._Act_Entity = entity;
                return true;
            }


            public override void Start(GameManager gameManager)
            {
                var chex = gameManager.GameBoard.GetHexagon(this._Act_Entity.X, this._Act_Entity.Z);
                var fhex = gameManager.GameBoard.GetHexagon(X, Z);

                var path = gameManager.GameBoard.PathFind(chex, fhex);
                this._Act_Path = path;
                this._Act_PathIndex = 0;
            }

            public int _Act_PathIndex;
            public List<GridHexagon> _Act_Path;
            private MongoGameState.GameEntity _Act_Entity;

            public override bool NextTick(GameManager gameManager)
            {
                var p = _Act_Path[_Act_PathIndex];
                var oldP = _Act_Path[_Act_PathIndex == 0 ? 0 : _Act_PathIndex - 1];

                p.Faction = _Act_Entity.FactionId;

                _Act_Entity.Direction = HexUtils.GetDirection(oldP, p);
                _Act_Entity.X = p.X;
                _Act_Entity.Z = p.Z;

                foreach (var neighbor in p.GetNeighbors())
                {
                    var hex = gameManager.GameBoard.GetHexagon(neighbor.X, neighbor.Z);
                    if (hex != null)
                    {
                        hex.Faction = _Act_Entity.FactionId;
                    }
                }
                _Act_PathIndex++;
                if (_Act_Path.Count == _Act_PathIndex)
                {
                    return false;
                }
                return true;
            }
            public override void Complete(GameManager gameManager)
            {
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

            public override bool Valid(GameManager gameManager)
            {
                var entity = gameManager.GameState.Entities.First(a => a.Id == EntityId);
                var enemyEntity = gameManager.GameState.Entities.FirstOrDefault(a => a.X == X && a.Z == Z);

                if (enemyEntity == null)
                {
                    return false;
                }
                _Act_Entity = entity;
                _Act_EnemyEntity = enemyEntity;

                return true;
            }
            private MongoGameState.GameEntity _Act_Entity;
            private MongoGameState.GameEntity _Act_EnemyEntity;


            public override void Start(GameManager gameManager)
            {
            }

            public override bool NextTick(GameManager gameManager)
            {
                return true;
            }
            public override void Complete(GameManager gameManager)
            {
                var attackerDetail = EntityDetails.Detail[_Act_Entity.EntityType];
                var enemyDetail = EntityDetails.Detail[_Act_EnemyEntity.EntityType];
                //todo take into account shield from enemy

                int amount = gameManager.Random.Next(0, attackerDetail.AttackPower) + 1;

                if (_Act_EnemyEntity.Hurt(amount, gameManager.GameState))
                {
                    var hex = gameManager.GameBoard.GetHexagon(X, Z);
                    if (hex != null)
                    {
                        hex.Faction = _Act_Entity.FactionId;
                    }
                }
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

            public override bool Valid(GameManager gameManager)
            {
                return true;
            }

            public override void Start(GameManager gameManager)
            {
            }
            public override bool NextTick(GameManager gameManager)
            {
                return true;
            }
            public override void Complete(GameManager gameManager)
            {
            }

        }

        public enum VoteActionType
        {
            Move, Attack, Spawn
        }
    }
}
