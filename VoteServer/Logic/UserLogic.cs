﻿using Common.Data;
using Common.Utils.Mongo;
using Common.Utils.Nancy;
using VoteServer.Modules;

namespace VoteServer.Logic
{
    public class UserLogic
    {
        public static UserLoginResponse Login(UserLoginRequest model)
        {
            var user = MongoUser.Collection.GetOne(a => a.Email == model.Email && a.Password == model.Password);

            if (user == null)
            {
                throw new RequestValidationException("User not found.");
            }

            return new UserLoginResponse()
            {
                UserId = user.Id.ToString()
            };
        }
        public static UserRegisterResponse Register(UserRegisterRequest model)
        {
            var user = MongoUser.Collection.GetOne(a => a.Email == model.Email);

            if (user != null)
            {
                throw new RequestValidationException("Email Address In Use");
            }

            user = new MongoUser.User();
            user.Email = model.Email;
            user.Password = model.Password;
            user.Insert();

            return new UserRegisterResponse()
            {
                UserId = user.Id.ToString()
            };
        }
    }
}