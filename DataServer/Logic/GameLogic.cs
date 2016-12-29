﻿using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Common.Data;
using Common.HexUtils;
using DataServer.Modules;
using DataServer.Modules.Models;
using MasterVoteServer;
using MasterVoteServer.Votes;

namespace DataServer.Logic
{
    public class GameLogic
    {
        public static async Task<GetStateResponse> GetState(GetStateRequest model)
        {
            return new GetStateResponse()
            {
                State=HexBoard.GenerateBoard()
            };
        }


/*
        public static PostVoteResponse VoteAction(PostVoteRequest model)
        {
            var gameStateData = SocialWarGames.Instance.StateData;

            if (model.Generation != gameStateData.Generation)
            {
                throw new ValidationException("GenerationId invalid");
            }

            var unit = gameStateData.GetUnitById(model.UnitId);
            if (unit == null) throw new ValidationException("Unit not found");

            var distance = 12;
            switch (unit.UnitType)
            {
                case GameUnitType.Infantry:
                    switch (model.Action)
                    {
                        case "Move":
                            if (distance != 1)
                            {
                                throw new ValidationException("Distance must be 1");
                            }

                            SocialWarGames.Instance.VoteAction(new MoveInfantryVote()
                            {
                                X = model.X,
                                Y = model.Y,
                                UnitId = model.UnitId,
                                Generation=model.Generation
                            });
                            break;

                        case "Attack":
                            if (distance != 1)
                            {
                                throw new ValidationException("Distance must be 1");
                            }

                            SocialWarGames.Instance.VoteAction(new AttackInfantryVote()
                            {
                                X = model.X,
                                Y = model.Y,
                                UnitId = model.UnitId,
                                Generation = model.Generation
                            });
                            break;
                    }
                    break;
            }



            return new PostVoteResponse();
        }
*/
    }
}