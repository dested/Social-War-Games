using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Common.Data;
using Common.GameLogic;
using Common.HexUtils;
using Common.Utils.Mongo;
using MasterVoteServer.Votes;
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

                            if (distance <= 5)
                            {
                                throw new ValidationException("Distance must be 1");
                            }
                            Console.WriteLine(distance);
                            var vote = new MoveInfantryVote()
                            {
                                X = model.X,
                                Z = model.Z,
                                UnitId = model.UnitId,
                                Generation = model.Generation
                            };
                            break;
                    }
                    break;
            }



            return new PostVoteResponse();
        }
    }
}