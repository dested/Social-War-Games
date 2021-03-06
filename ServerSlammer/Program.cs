﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.BoardUtils;
using Common.Utils.JsonUtils;
using Common.Utils.Nancy;
using Newtonsoft.Json;
using RestSharp;
using VoteServer.Modules.Models;

namespace ServerSlammer
{
    class Program
    {
        private static double count = 0;
        private static Timer timer;
        private static string url = "http://localhost:3568";
//                private static string url = "https://vote.socialwargames.com";

        static void Main(string[] args)
        {

//            Thread.Sleep(5000);

            for (int i = 0; i < 3; i++)
            {
                Task.Factory.StartNew(runGame);
            }

            Stopwatch sw = new Stopwatch();
            sw.Start();
            timer = new Timer((s) =>
              {
                  Console.WriteLine(count + "  -  " + count / (sw.ElapsedMilliseconds / 1000.0) + " Per second");
                  sw.Restart();
                  count = 0;
              }, null, 1000, 1000);
            Console.ReadLine();

        }

        private static async Task runGame()
        {
            var state = GetState();
            var board = new GameBoard(state);
            MongoGameState.GameEntity ent;
            int px;
            int pz;

            Random rand = new Random();
            var details = EntityDetails.Detail;
            while (true)
            {


                bool result;

                while (true)
                {
                    if (rand.Next(0, 100) < 30)
                    {

                        count++;
                        var p = rand.Next(0, board.GameState.Entities.Count);
                        ent = board.GameState.Entities[p];
                        var detail = details[ent.EntityType];

                        var entities = board.GameState.Entities.Where(
                            a => a != ent &&
                                 a.FactionId != ent.FactionId &&
                                 HexUtils.Distance(board.GetHexagon(a.X, a.Z), board.GetHexagon(ent.X, ent.Z)) <
                                 detail.AttackRadius
                        ).ToArray();

                        if (entities.Length == 0) continue;

                        var attackEnt = entities[rand.Next(0, entities.Length)];

                        result = await Vote(new PostVoteRequest()
                        {
                            EntityId = ent.Id,
                            Action = VoteActionType.Attack,
                            UserId = "faa",
                            Generation = board.GameState.Generation,
                            X = attackEnt.X,
                            Z = attackEnt.Z
                        });
                        if (result)
                        {
                            state = GetState();
                            board = new GameBoard(state);
                        }
                    }
                    else
                    {
                        count++;
                        var p = rand.Next(0, board.GameState.Entities.Count);
                        ent = board.GameState.Entities[p];
                        var detail = details[ent.EntityType];
                        px = ent.X + rand.Next(-detail.MoveRadius, detail.MoveRadius + 1);
                        pz = ent.Z + rand.Next(-detail.MoveRadius, detail.MoveRadius + 1);
                        if (px == 0 && pz == 0) continue;
                        if (board.GetHexagon(px, pz) == null) continue;
                        if (board.GetHexagon(ent.X, ent.Z) == null) continue;

                        var distance = HexUtils.Distance(board.GetHexagon(px, pz), board.GetHexagon(ent.X, ent.Z));
                        if (distance > detail.MoveRadius)
                        {
                            break;
                        }
                        result = await Vote(new PostVoteRequest()
                        {
                            EntityId = ent.Id,
                            Action = VoteActionType.Move,
                            UserId = "faa",
                            Generation = board.GameState.Generation,
                            X = px,
                            Z = pz
                        });
                        if (result)
                        {
                            state = GetState();
                            board = new GameBoard(state);
                        }
                    }
                }



            }
        }

        private static MongoGameState.GameState GetState()
        {
            var client = new RestClient(url);

            var request = new RestRequest("api/game/state", Method.GET);

            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");

            var response = client.Execute(request);
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All,
                Converters = new List<JsonConverter>()
                {
                    new ObjectIdJsonConverter()
                }
            };
            //            Console.WriteLine("Get state");
            var ds = JsonConvert.DeserializeObject<STResponse<string>>(response.Content, settings);
            Console.WriteLine("Got state");

            var state = Json.Deserialize<GetStateResponse>(Convert.FromBase64String(ds.Data), false);
            return state.State;
        }

        private static async Task<bool> Vote(PostVoteRequest vote)
        {
            //            Console.WriteLine("voting");
            var client = new RestClient(url);

            var request = new RestRequest("api/game/vote", Method.POST);

            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            request.AddJsonBody(vote);
            var response = await client.ExecuteTaskAsync(request);
            var settings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All,
                Converters = new List<JsonConverter>()
                {
                    new ObjectIdJsonConverter()
                }
            };
            var state = JsonConvert.DeserializeObject<STResponse<PostVoteResponse>>(response.Content, settings);
            //            Console.WriteLine("voted");

            return state.Data.GenerationMismatch;
        }
    }
    public class PostVoteResponse
    {
        public bool IssueVoting { get; set; }
        public bool GenerationMismatch { get; set; }
    }

    public class STResponse<T>
    {
        public STResponse(T data)
        {
            Data = data;
        }

        public T Data { get; set; }

    }

}
