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
            public DateTime Generated { get; set; }
            public int GenerationId { get; set; }
            public GameVoteDetails Details { get; set; }
        }
        public class GameVoteDetails
        {
            public string UserId { get; set; }
            public string UnitId { get; set; }
            public VoteActionType Type { get; set; }
            public VoteAction Action { get; set; }
        }

        [BsonKnownTypes(typeof(MoveVoteAction), typeof(AttackVoteAction), typeof(SpawnVoteAction))]
        public abstract class VoteAction
        {

        }
        public class MoveVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
        }
        public class AttackVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
        }

        public class SpawnVoteAction : VoteAction
        {
            public int X { get; set; }
            public int Z { get; set; }
            public string Unit { get; set; }
        }

        public enum VoteActionType
        {
            Move, Attack, Spawn
        }

    }
}
