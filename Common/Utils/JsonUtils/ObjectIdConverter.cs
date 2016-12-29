using System;
using System.Collections.Generic;
using MongoDB.Bson;
using Nancy.Json;
using Newtonsoft.Json;

namespace Common.Utils.JsonUtils
{
    public class ObjectIdConverter : JavaScriptPrimitiveConverter
    {
        public override object Deserialize(object primitiveValue, Type type, JavaScriptSerializer serializer)
        {
            var prim = (string)primitiveValue;

            return new ObjectId(prim);
        }

        public override object Serialize(object obj, JavaScriptSerializer serializer)
        {
            return ((ObjectId)obj).ToString();
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get { return new[] { typeof(ObjectId) }; }
        }
    }
    public class ObjectIdJsonConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value.ToString());
        }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
         return new ObjectId(reader.Value.ToString());
        }
        public override bool CanConvert(Type objectType)
        {
            return typeof(ObjectId).IsAssignableFrom(objectType);
        }
    }
}