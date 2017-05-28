using System;
using System.Collections.Generic;
using System.Configuration;
using MongoDB.Driver;

namespace Common.Utils.Mongo
{
    public static class MongoTools
    {
        private static IMongoDatabase _database;
        private static Dictionary<Type, object> _collections = new Dictionary<Type, object>();
        public static IMongoDatabase GetDatabase()
        {

            if (_database == null)
            {
                var client = new MongoClient(ConnectionString);
                _database = client.GetDatabase(Database);

            }
            return _database;
        }

        public static IMongoCollection<T> GetCollection<T>() where T : IMongoModel
        {
            var type = typeof(T);
            if (_collections.ContainsKey(type))
            {
                return (IMongoCollection<T>)_collections[type];
            }

            var collection = GetDatabase().GetCollection<T>(GetCollectionName<T>());
            _collections[type] = collection;
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