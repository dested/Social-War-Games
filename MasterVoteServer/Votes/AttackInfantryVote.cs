/*using Common.Data;

namespace MasterVoteServer.Votes
{
    public class AttackInfantryVote : Vote
    {
        public int X { get; set; }
        public int Z { get; set; }

        public override bool Equivalent(Vote vote)
        {
            var infantryVote = vote as AttackInfantryVote;
            if (infantryVote == null)
            {
                return false;
            }

            return (infantryVote.EntityId == EntityId &&
                    infantryVote.X == X &&
                    infantryVote.Z == Z);
        }

        public override void Complete(MongoGameState.GameState stateData)
        {
            var unit = stateData.GetUnitById(EntityId);
            if (unit != null)
            {
                var enemy = stateData.GetEntityByLocation(X, Z);
                if (enemy != null)
                {
                    enemy.Hurt(1, stateData);
                }
            }
        }
    }
}*/