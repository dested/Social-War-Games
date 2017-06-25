using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.Game;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.Utils.JsonUtils;
using Common.Utils.Mongo;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace VoteServer
{
    public class VoteServerLogic
    {
        public static VoteServerLogic instance = new VoteServerLogic();
        public GameManager GameManager { get; set; }
        public string VoteServerId = Guid.NewGuid().ToString();
        public OnPoolClient.OnPoolClient Client { get; set; }
        private VoteServerLogic()
        {
            GameManager = new GameManager();

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
                    case "StopVote":
                        {
                            GameManager.Locked = true;
                            respond(null);
                            break;
                        }
                    case "NewRound":
                        {
                            var messageRound = message.GetJson<NewRoundMessage>();
                            GameManager.GameState = messageRound.State;
                            GameManager.Reset();
                            Console.WriteLine("Got new round: " + messageRound.State.Generation);
                            GameManager.Locked = false;
                            respond(null);
                            break;
                        }
                }
            });


        }

    }
}