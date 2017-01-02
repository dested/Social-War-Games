using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.HexUtils;
using Common.Utils.Mongo;
using Common.Utils.Nancy;
using VoteServer.Modules.Models;

namespace VoteServer.Logic
{
    public class GameLogic
    {
        public static async Task<GetStateResponse> GetState(VoteServerLogic logic, GetStateRequest model)
        {
            return new GetStateResponse()
            {
                State = logic.GameManager.GameState
            };
        }
        public static async Task<GetMetricsResponse> GetMetrics(VoteServerLogic logic)
        {
            return new GetMetricsResponse()
            {
                Metrics = new GameMetrics()
                {
                    Generation= logic.GameManager.GameState.Generation,
                    Votes=logic.GameManager.TrackedVotes.ToArray(),
                    UsersVoted=logic.GameManager.UserVotes.Count
                }
            };
        }
        public static async Task<PostVoteResponse> VoteAction(VoteServerLogic logic, PostVoteRequest model)
        {
            var gameStateData = (await MongoGameState.Collection.GetOne(a => !a.Initial));

            if (model.Generation != gameStateData.Generation)
            {
                throw new ValidationException("Generation invalid");
            }
            var board = new GameBoard(gameStateData.Terrain);

            var unit = gameStateData.GetUnitById(model.EntityId);
            if (unit == null) throw new ValidationException("Unit not found");

            switch (unit.EntityType)
            {
                case GameEntityType.Infantry:
                    break;
                case GameEntityType.Tank:
                    break;
                case GameEntityType.Base:
                    break;
                case GameEntityType.MainBase:
                    break;
                case GameEntityType.Plane:
                    switch (model.Action)
                    {
                        case "Move":
                            var hex1 = board.GetHexagon(unit.X, unit.Z);
                            var hex2 = board.GetHexagon(model.X, model.Z);
                            var distance = HexUtils.Distance(hex1, hex2);

                            if (distance > 5)
                            {
                                throw new ValidationException("Distance must be less than 5");
                            }
                            MongoGameVote.GameVote gameVote = new MongoGameVote.GameVote()
                            {
                                Generated = DateTime.UtcNow,
                                Generation = model.Generation,
                                UserId = model.UserId,
                                Action = new MongoGameVote.MoveVoteAction()
                                {
                                    EntityId = model.EntityId,
                                    X = model.X,
                                    Z = model.Z
                                }
                            };
                            await gameVote.Insert();

                            await logic.GameListener.SendGameVote(new GameVoteMessage()
                            {
                                Vote = gameVote
                            });
                            break;
                        default:
                            throw new RequestValidationException("Action not found");
                    }
                    break;
                default: throw new RequestValidationException("Action not found");

            }



            return new PostVoteResponse();
        }
    }



}