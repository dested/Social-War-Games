using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.BoardUtils;
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
                    Generation = logic.GameManager.GameState.Generation,
                    Votes = logic.GameManager.TrackedVotes.ToArray(),
                    UsersVoted = logic.GameManager.UserVotes.Count,
                    NextGeneration = logic.GameManager.GameState.LastGeneration.AddSeconds(logic.GameManager.GameState.TickIntervalSeconds)
                }
            };
        }
        public static async Task<GetMetricsResponse> GetGenerationResult(VoteServerLogic logic, GetGenerationRequest model)
        {
            if (model.Generation + 1 == logic.GameManager.GameState.Generation)
            {
                var tickResult = await MongoTickResult.Collection.GetOne(a => a.Generation == model.Generation);
                return new GetMetricsResponse()
                {
                    Metrics = new GameMetrics()
                    {
                        Generation = tickResult.Generation,
                        Votes = tickResult.Votes.ToArray(),
                        UsersVoted = tickResult.UsersVoted
                    }
                };
            }
            return null;
        }
        public static async Task<PostVoteResponse> VoteAction(VoteServerLogic logic, PostVoteRequest model)
        {
            var gameState = logic.GameManager.GameState;
            var board = logic.GameManager.GameBoard;
            if (model.Generation != gameState.Generation)
            {
                return new PostVoteResponse() { GenerationMismatch = true };
            }

            var entity = gameState.GetEntityById(model.EntityId);
            if (entity == null)
                return new PostVoteResponse() { IssueVoting = true };
            MongoGameVote.VoteAction action;

            var hex1 = board.GetHexagon(entity.X, entity.Z);
            var hex2 = board.GetHexagon(model.X, model.Z);
            if (hex1 == null || hex2 == null)
            {
                return new PostVoteResponse() { IssueVoting = true };
            }
            var distance = HexUtils.Distance(hex1, hex2);


            var detail = EntityDetails.Detail[entity.EntityType];


            switch (model.Action)
            {
                case VoteActionType.Move:

                    if (distance <= 0 || distance > detail.MoveRadius)
                    {
                        return new PostVoteResponse() { IssueVoting = true }; ;
                    }
                    action = new MongoGameVote.MoveVoteAction() { EntityId = model.EntityId, X = model.X, Z = model.Z };
                    break;
                case VoteActionType.Attack:

                    if (distance <= 0 || distance > detail.AttackRadius)
                    {
                        return new PostVoteResponse() { IssueVoting = true }; ;
                    }
                    var attackEntity = gameState.GetEntityByLocation(model.X, model.Z);
                    if (attackEntity == null || attackEntity.FactionId == entity.FactionId)
                    {
                        return new PostVoteResponse() { IssueVoting = true }; ;
                    }
                    action = new MongoGameVote.AttackVoteAction() { EntityId = model.EntityId, X = model.X, Z = model.Z };
                    break;
                case VoteActionType.Spawn:
                    if (distance <= 0 || distance > detail.SpawnRadius)
                    {
                        return new PostVoteResponse() { IssueVoting = true }; ;
                    }
                    action = new MongoGameVote.SpawnVoteAction() { EntityId = model.EntityId, X = model.X, Z = model.Z ,EntityType = model.EntityType.Value};
                    break;
                default:
                    throw new RequestValidationException("Action not found");
            }



            MongoGameVote.GameVote gameVote = new MongoGameVote.GameVote()
            {
                Generated = DateTime.UtcNow,
                Generation = model.Generation,
                UserId = model.UserId,
                Action = action
            };
            await Task.WhenAll(
                gameVote.Insert(),
                logic.GameListener.SendGameVote(model.Generation, new GameVoteMessage() { Vote = gameVote })
            );


            return new PostVoteResponse()
            {
                Votes = logic.GameManager.TrackedVotes.Where(a => a.Action.EntityId == model.EntityId).ToArray()
            };
        }
    }
}