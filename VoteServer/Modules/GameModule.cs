using Common.Data;
using Common.Utils.Nancy;
using VoteServer.Logic;

namespace VoteServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/state"] = _ =>
            {
                Program.PubSub.Publish("foo", "cook");
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
    public class PostVoteRequest
    {
        public string UnitId { get; set; }
        public string Action { get; set; }
        public int Generation { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
    }
    
    public class PostVoteResponse
    {
        public MongoGameStateData.GameStateData StateData { get; set; }
    }

}