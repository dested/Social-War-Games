using Common.Utils.Nancy;
using DataServer.Logic;
using DataServer.Modules.Models;

namespace DataServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/state", true] = async (_, __) =>
            {
                var model = ValidateRequest<GetStateRequest>();
                var response =await GameLogic.GetState(model);
                return this.Success(response);
            };
      /*      Post["/vote", true] = async (_, __) =>
            {
                var model = ValidateRequest<PostVoteRequest>();
                var response = await GameLogic.VoteAction(model);
                return this.Success(response);
            };*/
        }

    }
}