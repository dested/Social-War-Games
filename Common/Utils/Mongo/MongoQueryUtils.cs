using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Common.Data;
using Common.Utils.Nancy;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Common.Utils.Mongo
{
    public static class MongoQueryUtils
    {
        public static void Exists(this IMongoModel model)
        {
            if (model == null)
            {
                throw new RequestValidationException("Entity not found");
            }
        }
        public static async Task<T> GetById<T>(this IMongoCollection<T> collection, string id) where T : IMongoModel
        {
            var objectId = new ObjectId(id);
            return await (await collection.FindAsync<T>(a => a.Id == objectId)).FirstOrDefaultAsync();
        }
        public static async Task<T> GetById<T>(this IMongoCollection<T> collection, ObjectId id) where T : IMongoModel
        {
            return await (await collection.FindAsync<T>(a=>a.Id==id)).FirstOrDefaultAsync();
        }

        public static async Task<T> GetOne<T>(this IMongoCollection<T> collection, Expression<Func<T, bool>> expression)
        {
            return await (await collection.FindAsync<T>(expression)).FirstOrDefaultAsync();
        }


        public static async Task<List<T>> GetAll<T>(this IMongoCollection<T> collection, Expression<Func<T, bool>> expression)
        {
            var findFluent = await collection.FindAsync<T>(expression);
            return await findFluent.ToListAsync();
        }

        public static async Task<List<T>> GetAll<T>(this IMongoCollection<T> collection)
        {
            return await (await collection.FindAsync<T>(a => true)).ToListAsync();
        }

        public static async Task<long> Count<T>(this IMongoCollection<T> collection, Expression<Func<T, bool>> expression)
        {
            return (await collection.CountAsync<T>(expression));
        }

        public static async Task<T> Insert<T>(this T item) where T : IMongoModel
        {
            var collection = MongoTools.GetCollection<T>();
            await collection.InsertOneAsync(item);
            return item;
        }

        public static async Task<T> Update<T>(this T item) where T : IMongoModel
        {
            var collection = MongoTools.GetCollection<T>();
            await collection.ReplaceOneAsync(a => a.Id == item.Id, item);
            return item;
        } 

        public static async Task Delete<T>(this string id) where T : IMongoModel
        {
            var collection = MongoTools.GetCollection<T>();
            var oid = new ObjectId(id);
            await collection.DeleteOneAsync(a => a.Id == oid);
        }

        public static async Task Delete<T>(this T item) where T : IMongoModel
        {
            var collection = MongoTools.GetCollection<T>();
            var oid = item.Id;
            await collection.DeleteOneAsync(a => a.Id == oid);
        }
    }
}