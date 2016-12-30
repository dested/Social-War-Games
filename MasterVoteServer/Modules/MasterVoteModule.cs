using Common.Utils.Nancy;

namespace MasterVoteServer.Modules
{
    public class GameModule : BaseModule
    {
        public GameModule() : base("api/game")
        {
            Get["/state", true] = async (_, __) =>
            { 
                return this.Success(1);
            }; 
         
        }


    }

 }