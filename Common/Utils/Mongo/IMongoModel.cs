using System;
using System.Collections.Generic;
using System.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Common.Utils.Mongo
{
    public interface IMongoModel
    {
        ObjectId Id { get; set; }
    }

    public static class MongoTools
    {
        public static IMongoDatabase GetDatabase()
        {
            var client = new MongoClient(ConnectionString);
            var database = client.GetDatabase(Database);
            return database;
        }

        public static IMongoCollection<T> GetCollection<T>() where T : IMongoModel
        {
            var collection = GetDatabase().GetCollection<T>(GetCollectionName<T>());
            return collection;
        }

        public static IMongoCollection<T> GetCollection<T>(string collectionName) where T : IMongoModel
        {
            var collection = GetDatabase().GetCollection<T>(collectionName);
            return collection;
        }

        public static string ConnectionString => ConfigurationManager.AppSettings["MongoConnectionString"];

        public static string Database => ConfigurationManager.AppSettings["MongoDatabase"];

        public static string GetCollectionName<T>() where T : IMongoModel
        {
            var m = typeof(T);
            string collectionName;
            var collectionNameProperpty = m.DeclaringType.GetField("CollectionName");
            collectionName = (string)collectionNameProperpty.GetValue(null);
            return collectionName;
        }
    }
}