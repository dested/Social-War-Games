using Common.Utils.Nancy;
using VoteServer.Logic;
using VoteServer.Modules.Models;

namespace VoteServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/check"] = (_) =>
            {
                var j=VoteServerLogic.instance;
                return this.Success(1);
            };

            Get["/state", true] = async (_, __) =>
            {
                var model = ValidateRequest<GetStateRequest>();
                var response = await GameLogic.GetState(VoteServerLogic.instance, model);
                return this.Success(response);
            };
            Get["/metrics", true] = async (_, __) =>
            {
                var response = await GameLogic.GetMetrics(VoteServerLogic.instance);
                return this.Success(response);
            };

            Get["/result", true] = async (_, __) =>
            {
                var model = ValidateRequest<GetGenerationRequest>();
                var response = await GameLogic.GetGenerationResult(VoteServerLogic.instance, model);
                return this.Success(response);
            };

            Post["/vote", true] = async (_, __) =>
            {
                var model = ValidateRequest<PostVoteRequest>();
                var response = await GameLogic.VoteAction(VoteServerLogic.instance, model);
                return this.Success(response);
            };
         
        }


    }
}