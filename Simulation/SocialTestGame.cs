using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using Common.Data;
using Common.Utils.Mongo;
using MongoDB.Bson;

namespace Simulation
{
    public class SocialTestGame
    {
        private static SocialTestGame instance;
        public static SocialTestGame Instance => instance ?? (instance = new SocialTestGame());
        private Random random = new Random();

        private Dictionary<string, Action<MongoGameStateData.GameUnit, MongoGameStateData.GameFaction>  actions
            = new Dictionary<string, Action<MongoGameStateData.GameUnit, MongoGameStateData.GameFaction>>();

        public MongoGameStateData.GameStateData StateData { get; set; }
        public SocialTestGame()
        {

            loadGameState();

            Timer t = new Timer(TimeSpan.FromMinutes(1).TotalMilliseconds);
            t.AutoReset = true;
            t.Elapsed += gameTick;
            t.Start();
        }

        public void VoteAction(string unitId, string userFactionId, string actionId)
        {
            foreach (var gameFaction in StateData.Factions)
            {
                if (gameFaction.Id == userFactionId)
                {
                    foreach (var gameUnit in gameFaction.Units)
                    {
                        if (gameUnit.Id==unitId)
                        {
                            appendVote(unitId,actionId);
                        }
                    }
                }
            }
        }

        private Dictionary<string, Dictionary<string, int>> votes = new Dictionary<string, Dictionary<string, int>>();

        private void appendVote(string unitId, string actionId)
        { 
            if (!votes.ContainsKey(unitId))
            {
                votes[unitId] = new Dictionary<string, int>();
            }

            if (votes[unitId].ContainsKey(actionId))
            {
                votes[unitId][actionId]++;
            }
            else
            {
                votes[unitId][actionId] = 1;
            }
        }


        private void loadGameState()
        {
            var states = MongoGameStateData.Collection.GetAll();
            MongoGameStateData.GameStateData stateData;
            if (!states.Any())
            {
                stateData = initializeGameState();
            }
            else
            {
                stateData = states[0];
            }

            StateData = stateData;
        }

        private MongoGameStateData.GameStateData initializeGameState()
        {
            MongoGameStateData.GameStateData stateData = new MongoGameStateData.GameStateData();
            stateData.LastTick = DateTime.UtcNow.AddMinutes(1);
            stateData.Width = 10;
            stateData.Height = 10;
            stateData.Factions = new List<MongoGameStateData.GameFaction>();
            for (int f = 0; f < 3; f++)
            {
                var gameFaction = new MongoGameStateData.GameFaction();
                gameFaction.Units = new List<MongoGameStateData.GameUnit>();
                gameFaction.Id = ObjectId.GenerateNewId().ToString();

                switch (f)
                {
                    case 0:
                        gameFaction.Color = "red";
                        break;
                    case 1:
                        gameFaction.Color = "green";
                        break;
                    case 2:
                        gameFaction.Color = "blue";
                        break;
                }


                var numOfUnits = random.Next(10, 30);
                for (int i = 0; i < numOfUnits; i++)
                {
                    var unitType = random.Next(0, 100);

                    int x;
                    int y;
                    while (true)
                    {
                        x = random.Next(0, 30);
                        y = random.Next(0, 30);
                        if (!gameFaction.Units.Any(a => a.X == x && a.Y == y))
                        {
                            break;
                        }
                    }

                    MongoGameStateData.GameUnit gameUnit;

                    if (unitType < 60)
                    {
                        gameUnit = new MongoGameStateData.GameUnit()
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Health = 2,
                            UnitType = GameUnitType.Infantry,
                            X = x,
                            Y = y
                        };
                    }
                    else if (unitType < 90)
                    {
                        gameUnit = new MongoGameStateData.GameUnit()
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Health = 6,
                            UnitType = GameUnitType.Tank,
                            X = x,
                            Y = y
                        };
                    }
                    else
                    {
                        gameUnit = new MongoGameStateData.GameUnit()
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Health = 16,
                            UnitType = GameUnitType.Base,
                            X = x,
                            Y = y
                        };
                    }

                    gameFaction.Units.Add(gameUnit);
                }

                stateData.Factions.Add(gameFaction);
            }
            stateData.Insert();
            return stateData;
        }

        private void gameTick(object sender, ElapsedEventArgs e)
        {
            foreach (var vote in votes)
            {
                var unit = GetUnitById(vote.Key);
                if (unit == null)
                {
                    //idk
                }
                else
                {
                    var actionId = vote.Value.OrderByDescending(a => a.Value).First().Key;

                }
            }
        }

        public MongoGameStateData.GameUnit GetUnitById(string id)
        {
            foreach (var gameFaction in StateData.Factions)
            {
                foreach (var gameUnit in gameFaction.Units)
                {
                    if (gameUnit.Id == id)
                    {
                        return gameUnit;
                    }
                }
            }
            return null;
        }

    }
     
}
