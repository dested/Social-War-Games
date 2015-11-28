using System.Threading.Tasks;
using Common.Data;
using Common.Utils.Mongo;
using RestServer.Common;
using RestServer.Modules;
using Simulation;

namespace RestServer.Logic
{
    public class GameLogic
    { 
        public static GetStateResponse GetState(GetStateRequest model)
        {
            var stateData = SocialTestGame.Instance.StateData;
            return new GetStateResponse()
            {
                StateData= stateData
            };
        }
    }
}