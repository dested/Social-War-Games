using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BoardUtils;
using Common.BoardUtils;
using Common.Data;
using Common.GameLogic;
using Common.Utils;
using Common.Utils.JsonUtils;
using Common.Utils.Mongo;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MasterVoteServer
{
    public class Program
    {
        public static void Main()
        {
//            startNewGame();
//            return;
            MongoServerLog.AddServerLog("Master.Start", "1", "1");
            var logic=MasterVoteServerLogic.GetServerLogic();
            while (true)
            {
                Console.WriteLine("Press enter to die");
                Console.ReadLine();
                logic.gameTick(null);
            }

        }



        public static void startNewGame()
        {

            MongoGameState.Collection.DeleteMany(FilterDefinition<MongoGameState.GameState>.Empty);
            MongoGameVote.Collection.DeleteMany(FilterDefinition<MongoGameVote.GameVote>.Empty);
            MongoTickResult.Collection.DeleteMany(FilterDefinition<MongoTickResult.TickResult>.Empty);
            MongoServerLog.Collection.DeleteMany(FilterDefinition<MongoServerLog.ServerLog>.Empty);

            MongoGameVote.Collection.Indexes.CreateOne(Builders<MongoGameVote.GameVote>.IndexKeys.Ascending(_ => _.Generation));

            var terrain = GenerateTerrain(84 * 2, 84 * 2);
            var board = new GameBoard(new MongoGameState.GameState() { Terrain = terrain });
            var entities = new List<MongoGameState.GameEntity>();

            GenerateFaction(terrain, entities, board, new Vector2(terrain.Width / 4, terrain.Height / 3), 1);
            GenerateFaction(terrain, entities, board, new Vector2(terrain.Width / 4 * 3, terrain.Height / 3), 2);
            GenerateFaction(terrain, entities, board, new Vector2(terrain.Width / 4 * 2, terrain.Height / 3 * 2), 3);


            StringBuilder sb = new StringBuilder(terrain.BoardStr.Length);
            int curZ = 0;
            foreach (var gridHexagon in board.HexList)
            {
                if (gridHexagon.Z != curZ)
                {
                    sb.Append("|");
                    curZ = gridHexagon.Z;
                }
                sb.Append(gridHexagon.Faction.ToString());
            }

            var state = new MongoGameState.GameState
            {
                Generation = 0,
                LastGeneration = DateTime.UtcNow,
                TickIntervalSeconds = 15,
                Terrain = terrain,
                FactionData = sb.ToString(),
                Entities = entities,
                Initial = false
            }.InsertSync();

            state.Id = ObjectId.Empty;
            state.Initial = true;
            state.InsertSync();
        }

        private static void GenerateFaction(MongoGameState.Terrain terrain, List<MongoGameState.GameEntity> entities, GameBoard board, Vector2 center, int faction)
        {
            var centerHex = board.GetHexagon(center.X, center.Z);
            entities.Add(MongoGameState.GameEntity.CreateMainBase(centerHex.X, centerHex.Z, faction));
            var spots = board.FindAvailableSpots(terrain.Width / 6, centerHex);
            foreach (var h in spots)
            {
                h.Faction = faction;
            }

            entities.AddRange(Enumerable.Range(0, 30 * 2).Select(_ =>
            {
                var random = spots.Random();
                return MongoGameState.GameEntity.CreateHeli(random.X, random.Z, faction);
            }));
            entities.AddRange(Enumerable.Range(0, 30 * 2).Select(_ =>
            {
                var random = spots.Random();
                return MongoGameState.GameEntity.CreateTank(random.X, random.Z, faction);
            }));

        }

        public static MongoGameState.Terrain GenerateTerrain(int width, int height)
        {
            var board = new MongoGameState.Terrain();
            StringBuilder sb = new StringBuilder(board.Height * (board.Width + 1));
            board.Width = width;
            board.Height = height;
            var random = new Random();
            Noise.Seed = random.Next();
            for (var y = 0; y < board.Height; y++)
            {
                for (var x = 0; x < board.Width; x++)
                {
                    var value = Math.Abs(Noise.Generate(x / 90f, y / 90f)) * 90f;
                    sb.Append(Math.Round(value / 15f));
                }
                sb.Append("|");
            }
            board.BoardStr = sb.ToString();
            return board;
        }
    }
}