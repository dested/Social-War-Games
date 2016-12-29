using Common.Utils.Nancy;
using VoteServer.Logic;
using VoteServer.Modules.Models;

namespace VoteServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/state", true] = async (_, __) =>
            {
                var model = ValidateRequest<GetStateRequest>();
                var response = await GameLogic.GetState(model);
                return this.Success(response);
            };
            Post["/vote", true] = async (_, __) =>
            {
                var model = ValidateRequest<PostVoteRequest>();
                var response = await GameLogic.VoteAction(model);
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