using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.GameLogic.Models;
using Common.HexUtils;
using Common.Utils.Mongo;
using VoteServer.Modules.Models;

namespace VoteServer.Logic
{
    public class GameLogic
    {
        public static async Task<GetStateResponse> GetState(GetStateRequest model)
        {
            return new GetStateResponse()
            {
                State = (await MongoGameState.Collection.GetOne(a => true))
            };
        }
        public static async Task<PostVoteResponse> VoteAction(PostVoteRequest model)
        {
            var gameStateData = (await MongoGameState.Collection.GetOne(a => true));

            if (model.Generation != gameStateData.Generation)
            {
                throw new ValidationException("GenerationId invalid");
            }
            var board = new GameBoard(gameStateData.Terrain);

            var unit = gameStateData.GetUnitById(model.UnitId);
            if (unit == null) throw new ValidationException("Unit not found");

            switch (unit.EntityType)
            {
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
                                GenerationId = model.Generation,
                                Details = new MongoGameVote.GameVoteDetails()
                                {
                                    UnitId = model.UnitId,
                                    UserId = model.UserId,
                                    Type = MongoGameVote.VoteActionType.Move,
                                    Action = new MongoGameVote.MoveVoteAction()
                                    {
                                        X = model.X,
                                        Z = model.Z
                                    }
                                }
                            };
                            await gameVote.Insert();

                            await VoteServerLogic.Logic.GameListener.SendGameVote(new GameVoteMessage()
                            {
                                Vote = gameVote
                            });
                            break;
                    }
                    break;
            }



            return new PostVoteResponse();
        }
    }
}