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
            Get["/generation", true] = async (_, __) =>
            {
                var response = await GameLogic.GetGeneration(VoteServerLogic.instance);
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

    /*

  get next turn time
  post action
      unit id
      actionid
      redis??
          key++
  get game state
      highly cached
  get unit state
      points on each action

  hot units??

*/
}