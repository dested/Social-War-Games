using Common.Utils.Nancy;
using DataServer.Logic;

namespace DataServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/state"] = _ =>
            {
                var model = ValidateRequest<GetStateRequest>();
                var response = GameLogic.GetState(model);
                return this.Success(response);
            };
            Post["/vote"] = _ =>
            {
                var model = ValidateRequest<PostVoteRequest>();
                var response = GameLogic.VoteAction(model);
                return this.Success(response);
            };
        }

    }
}