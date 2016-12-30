﻿using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Text;
using Newtonsoft.Json;

namespace Common.Utils.JsonUtils
{
    public static class Json
    {
        public static T Deserialize<T>(byte[] bytes)
        {
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All,
                Converters = new List<JsonConverter>()
                    {
                        new ObjectIdJsonConverter()
                    }
            };


            var res = Inflate(bytes);

            return JsonConvert.DeserializeObject<T>(res, settings);
        }

        public static byte[] Serialize<T>(T t)
        {
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All,
                Converters = new List<JsonConverter>()
                {
                    new ObjectIdJsonConverter()
                }
            };
            var res = JsonConvert.SerializeObject(t, settings);

            return Deflate(res);
        }

        private static byte[] Deflate(string str)
        {
            var data = Encoding.UTF8.GetBytes(str);
            if (null == data || data.Length < 1) return null;
            string compressedBase64 = "";

            //write into a new memory stream wrapped by a deflate stream
            using (MemoryStream ms = new MemoryStream())
            {
                using (DeflateStream deflateStream = new DeflateStream(ms, CompressionLevel.Optimal, true))
                {
                    //write byte buffer into memorystream
                    deflateStream.Write(data, 0, data.Length);
                    deflateStream.Close();

                    //rewind memory stream and write to base 64 string
                    byte[] compressedBytes = new byte[ms.Length];
                    ms.Seek(0, SeekOrigin.Begin);
                    ms.Read(compressedBytes, 0, (int)ms.Length);
                    return compressedBytes;
                }
            }
        }

        private static string Inflate(byte[] data)
        {
            if (null == data || data.Length < 1) return null;
            //write into a new memory stream wrapped by a deflate stream
            using (MemoryStream ms = new MemoryStream(data))
            {
                using (DeflateStream deflateStream = new DeflateStream(ms, CompressionMode.Decompress, true))
                {
                    var mem = new MemoryStream();

                    deflateStream.CopyTo(mem);
                    return Encoding.UTF8.GetString(mem.ToArray());
                }
            }
        }
    }
}