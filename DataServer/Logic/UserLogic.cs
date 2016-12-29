using System;
using System.Threading.Tasks;
using Common.Data;
using Common.Utils.Mongo;
using Common.Utils.Nancy;
using DataServer.Modules;
using DataServer.Modules.Models;

namespace DataServer.Logic
{
    public class UserLogic
    {
        public static async Task<UserLoginResponse> Login(UserLoginRequest model)
        {
            var user = await MongoUser.Collection.GetOne(a => a.Email == model.Email && a.Password == model.Password);

            if (user == null)
            {
                throw new RequestValidationException("User not found.");
            }

            return new UserLoginResponse()
            {
                UserId = user.Id.ToString()
            };
        }
        public static async Task<UserRegisterResponse> Register(UserRegisterRequest model)
        {
            var user = await MongoUser.Collection.GetOne(a => a.Email == model.Email);

            if (user != null)
            {
                throw new RequestValidationException("Email Address In Use");
            }

            user = new MongoUser.User();
            user.Email = model.Email;
            user.Password = model.Password;
            await user.Insert();

            return new UserRegisterResponse()
            {
                UserId = user.Id.ToString()
            };
        }
    }
}