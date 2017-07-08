using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using BoardUtils;
using Common.Data;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.BoardUtils;
using Common.Utils;
using Common.Utils.JsonUtils;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace MasterVoteServer
{
    public class MasterVoteServerLogic
    {
        private static MasterVoteServerLogic instance;
        public static MasterVoteServerLogic GetServerLogic()
        {
            if (instance == null)
            {
                instance = new MasterVoteServerLogic();
            }
            return instance;
        }

        public GameManager GameManager;
        public OnPoolClient.OnPoolClient Client;
        public string VoteServerId = Guid.NewGuid().ToString();
        private Timer timer;

        private MasterVoteServerLogic()
        {
            Client = new OnPoolClient.OnPoolClient();
            Client.SetSerializerSettings(new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All,
                Converters = new List<JsonConverter>()
                {
                    new ObjectIdJsonConverter(),
                    new StringEnumConverter()
                },
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
            Client.ConnectToServer(ConfigurationManager.AppSettings["onPoolServer"]);
            Client.JoinPool("VotePool").OnMessage((from, message, respond) =>
            {
                switch (message.Method)
                {
                    case "AddVote":
                        {
                            var result = message.GetJson<GameVoteMessage>();
                            GameManager.AddVote(result.Vote);
                            respond(null);
                            break;
                        }
                    default:
                        respond(null);
                        break;
                }
            });
            GameManager = new GameManager();
            gameTick(null);
        }

        public void gameTick(object state)
        {
            timer?.Dispose();
            Client.SendAllPoolMessage("VotePool", "StopVote");
            GameManager.Tick();
            timer = new Timer(gameTick, null, GameManager.GameState.TickIntervalSeconds * 1000, -1);

            Client.SendAllPoolMessage("VotePool", "NewRound", new NewRoundMessage()
            {
                State = GameManager.GameState
            });
        }



    }
}