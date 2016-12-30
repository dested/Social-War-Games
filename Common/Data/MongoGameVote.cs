using System;
using System.Collections.Generic;
using System.Linq;
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
        }

        [BsonKnownTypes(typeof(MoveVoteAction), typeof(AttackVoteAction), typeof(SpawnVoteAction))]
        public abstract class VoteAction
        {
            public string UserId { get; set; }
            public string EntityId { get; set; }
            public abstract bool Equates(VoteAction argAction);
            public abstract VoteActionType ActionType { get; }
            public abstract void Complete(MongoGameState.GameState gameState);
        }
        public class MoveVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            public override VoteActionType ActionType { get; } = VoteActionType.Move;
            public override bool Equates(VoteAction a)
            {
                var action = a as MoveVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z;
            }

            public override void Complete(MongoGameState.GameState gameState)
            {
                var entity = gameState.Entities.First(a => a.Id == EntityId);
                entity.X = this.X;
                entity.Z = this.Z;
            }
        }
        public class AttackVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            public override VoteActionType ActionType { get; } = VoteActionType.Attack;
            public override bool Equates(VoteAction a)
            {
                var action = a as AttackVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z;
            }
            public override void Complete(MongoGameState.GameState gameState)
            {

            }

        }

        public class SpawnVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            public string Unit { get; set; }
            public override VoteActionType ActionType { get; } = VoteActionType.Spawn;
            public override bool Equates(VoteAction a)
            {
                var action = a as SpawnVoteAction;
                if (action == null) return false;
                return X == action.X && Z == action.Z && Unit == action.Unit;
            }
            public override void Complete(MongoGameState.GameState gameState)
            {

            }

        }

        public enum VoteActionType
        {
            Move, Attack, Spawn
        }
    }
}
