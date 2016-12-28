using System;
using System.Collections.Generic;
using MongoDB.Bson;

namespace Common.Utils.Mongo
{
    public interface IMongoModel
    {
        ObjectId Id { get; set; }
    }
}