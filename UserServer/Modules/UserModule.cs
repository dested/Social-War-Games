using Common.Utils.Nancy;
using UserServer.Logic;
using UserServer.Modules.Models;

namespace UserServer.Modules
{
    public class UserModule : BaseModule
    {
        public UserModule() : base("api/user")
        {
            Get["/check"] = (_) => this.Success(1);


            Post["/login", true] = async (_, __) =>
            {
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