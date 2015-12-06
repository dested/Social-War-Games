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
using Simulation.Votes;

namespace Simulation
{
    public class SocialWarGames
    {
        private static SocialWarGames instance;
        public static SocialWarGames Instance => instance ?? (instance = new SocialWarGames());
        private Random random = new Random();


        public MongoGameStateData.GameStateData StateData { get; set; }
        public SocialWarGames()
        {
            loadGameState();
            Timer t = new Timer(TimeSpan.FromMinutes(1).TotalMilliseconds);
            t.AutoReset = true;
            t.Elapsed += progressGeneration;
            t.Start();
        }

        public void VoteAction(Vote vote)
        {
            Console.WriteLine("Vote Recorded " + vote.Generation);

            bool found = false;
            foreach (var v in votes)
            {
                if (v.Equivalent(vote))
                {
                    found = true;
                    v.Count++;
                    break;
                }
            }
            if (!found)
            {
                vote.Count = 1;
                votes.Add(vote);
            }
        }

        private List<Vote> votes = new List<Vote>();


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
        private void progressGeneration(object sender, ElapsedEventArgs e)
        {
            lock (@lock)
            {
                Console.WriteLine("Vote locked");
                foreach (var unitVotes in votes.GroupBy(a => a.UnitId))
                {
                    var vote = unitVotes.OrderByDescending(a => a.Count).First();
                    vote.Complete(StateData);
                }
                votes.Clear();
                StateData.Generation += 1;
                StateData.Update();

                Console.WriteLine("Vote unlocked");
            }
        }

        private static readonly object @lock = new object();










        private MongoGameStateData.GameStateData initializeGameState()
        {
            MongoGameStateData.GameStateData stateData = new MongoGameStateData.GameStateData();
            stateData.Board = new MongoGameStateData.HexBoard();
            string boardStr = "";
            stateData.Board.Width = 84;
            stateData.Board.Height = 84;
            for (int y = 0; y < stateData.Board.Height; y++)
            {
                for (int x = 0; x < stateData.Board.Width; x++)
                {
                    if (random.Next(0, 100) < 10)
                    {
                        boardStr += "0";
                    }
                    else
                    {
                        if (random.Next(0, 100) < 15)
                            boardStr += 2;
                        else if (random.Next(0, 100) < 6)
                            boardStr += 3;
                        else
                            boardStr += 1;
                    }

                    boardStr += (y / (stateData.Board.Height / 3)) + 1;
                }
                boardStr += "|";
            }
            stateData.Board.BoardStr = boardStr;

            stateData.LastGeneration = DateTime.UtcNow.AddMinutes(1);
            stateData.Factions = new List<MongoGameStateData.GameFaction>();
            for (int f = 0; f < 3; f++)
            {
                var gameFaction = new MongoGameStateData.GameFaction();
                gameFaction.Units = new List<MongoGameStateData.GameUnit>();
                gameFaction.Id = ObjectId.GenerateNewId().ToString();

                switch (f)
                {
                    case 0:
                        gameFaction.Color = "#FF87B7";
                        break;
                    case 1:
                        gameFaction.Color = "#C4E283";
                        break;
                    case 2:
                        gameFaction.Color = "#9985E5";
                        break;
                }


                var numOfUnits = 300;
                for (int i = 0; i < numOfUnits; i++)
                {
                    var unitType = random.Next(0, 100);

                    int x;
                    int y;
                    while (true)
                    {
                        x = random.Next(0, stateData.Board.Width);
                        y = random.Next(stateData.Board.Height / 3*f, stateData.Board.Height / 3*(f+1));
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

    }

}
