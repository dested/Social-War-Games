using Common.Utils.Nancy;
using VoteServer.Logic;

namespace VoteServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
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