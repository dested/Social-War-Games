using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Common.Data;
using Common.HexUtils;
using Common.Utils.Mongo;
using RestServer.Common;
using RestServer.Modules;
using Simulation;
using Simulation.Votes;

namespace RestServer.Logic
{
    public class GameLogic
    {
        public static GetStateResponse GetState(GetStateRequest model)
        {
            var stateData = SocialWarGames.Instance.StateData;
            return new GetStateResponse()
            {
                StateData = stateData
            };
        }


        public static PostVoteResponse VoteAction(PostVoteRequest model)
        {
            var gameStateData = SocialWarGames.Instance.StateData;

            if (model.Generation != gameStateData.Generation)
            {
                throw new ValidationException("Generation invalid");
            }

            var unit = gameStateData.GetUnitById(model.UnitId);
            if (unit == null) throw new ValidationException("Unit not found");
            Layout n = new Layout(Layout.flat, new Point(1, 1), new Point(50, 50));

            var h = FractionalHex.HexRound(Layout.PixelToHex(n, new Point(unit.X, unit.Y)));
            var c = FractionalHex.HexRound(Layout.PixelToHex(n, new Point(model.X, model.Y)));

            var distance = Hex.Distance(h, c);

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
    }
}