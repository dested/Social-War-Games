using Common.Utils.Nancy;
using DataServer.Logic;
using DataServer.Modules.Models;

namespace DataServer.Modules
{
    public class UserModule : BaseModule
    {
        public UserModule() : base("api/user")
        {
            Post["/login", true] = async (_, __) =>
            {
                var ip = Request.UserHostAddress;

                var model = ValidateRequest<UserLoginRequest>();
                var response =await  UserLogic.Login(model);
                return this.Success(response, new TokenMetaData(new JwtToken().Encode(new UserJwtModel() {UserId = response.UserId}.ToJwtPayload())));
            };
            Post["/register",true] = async (_,__) =>
            {
                var model = ValidateRequest<UserRegisterRequest>();
                var response =await  UserLogic.Register(model);
                return this.Success(response, new TokenMetaData(new JwtToken().Encode(new UserJwtModel() { UserId = response.UserId }.ToJwtPayload())));
            };
        }

    }
}