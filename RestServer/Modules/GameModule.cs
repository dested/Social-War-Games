using System.Collections.Generic;
using Common.Data;
using RestServer.Common;
using RestServer.Common.Nancy;
using RestServer.Logic;

namespace RestServer.Modules
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


    public class GetStateRequest
    {
    }
    public class GetStateResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    } 

}