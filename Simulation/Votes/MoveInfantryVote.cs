using Common.Data;

namespace Simulation.Votes
{
    public class MoveInfantryVote : Vote
    {
        public int X { get; set; }
        public int Y { get; set; }

        public override bool Equivalent(Vote vote)
        {
            var infantryVote = vote as MoveInfantryVote;
            if (infantryVote == null)
            {
                return false;
            }

            return (infantryVote.UnitId == UnitId &&
                    infantryVote.X == X &&
                    infantryVote.Y == Y);
        }

        public override void Complete(MongoGameStateData.GameStateData stateData)
        {
            var unit = stateData.GetUnitById(UnitId);
            if (unit != null)
            {
                unit.X = this.X;
                unit.Y = this.Y;
            }
        }
    }

    public class AttackInfantryVote : Vote
    {
        public int X { get; set; }
        public int Y { get; set; }

        public override bool Equivalent(Vote vote)
        {
            var infantryVote = vote as AttackInfantryVote;
            if (infantryVote == null)
            {
                return false;
            }

            return (infantryVote.UnitId == UnitId &&
                    infantryVote.X == X &&
                    infantryVote.Y == Y);
        }

        public override void Complete(MongoGameStateData.GameStateData stateData)
        {
            var unit = stateData.GetUnitById(UnitId);
            if (unit != null)
            {
                var enemy = stateData.GetUnitByLocation(X, Y);
                if (enemy != null)
                {
                    enemy.Hurt(1, stateData);
                }
            }
        }
    }
}