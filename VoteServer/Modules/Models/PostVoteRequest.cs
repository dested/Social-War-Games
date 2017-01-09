using Common.Data;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace VoteServer.Modules.Models
{
    public class PostVoteRequest
    {
        public string UserId { get; set; }
        public string EntityId { get; set; }
        public string Action { get; set; }
        public int Generation { get; set; }
        public int X { get; set; }
        public int Z { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public GameEntityType EntityType { get; set; }
    }
}