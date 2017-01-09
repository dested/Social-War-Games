using Common.Data;

namespace MasterVoteServer.Votes
{
    public class MoveInfantryVote : Vote
    {
        public int X { get; set; }
        public int Z { get; set; }

        public override bool Equivalent(Vote vote)
        {
            var infantryVote = vote as MoveInfantryVote;
            if (infantryVote == null)
            {
                return false;
            }

            return (infantryVote.UnitId == UnitId &&
                    infantryVote.X == X &&
                    infantryVote.Z == Z);
        }

        public override void Complete(MongoGameState.GameState state)
        {
            var unit = state.GetEntityById(UnitId);
            if (unit != null)
            {
                unit.X = this.X;
                unit.Z = this.Z;
            }
        }
    }
}