using System;
using System.Collections.Generic;
using System.IO;
using Nancy;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Common.Utils.Nancy
{
/*
    public class JsonNetSerializer : ISerializer
    {
        private readonly JsonSerializer _serializer;

        public JsonNetSerializer()
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            _serializer = JsonSerializer.Create(settings);
        }

        public bool CanSerialize(string contentType)
        {
            return contentType == "application/json";
        }

        public void Serialize<TModel>(string contentType, TModel model, Stream outputStream)
        {
            try
            {
                using (var writer = new JsonTextWriter(new StreamWriter(outputStream)))
                {
                    _serializer.Serialize(writer, model);
                    writer.Flush();
                }
            }
            catch (Exception ex)
            {
                
            }
        }

        public IEnumerable<string> Extensions { get; private set; }
    }
*/
}