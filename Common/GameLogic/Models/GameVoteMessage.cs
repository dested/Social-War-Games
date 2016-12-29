namespace Common.GameLogic.Models
{
    public class GameVoteMessage
    {
        public string UserId { get; set; }
        public int GenerationId { get; set; }
        public string UnitId { get; set; }
        public VoteActionType Type { get; set; }
        public IVoteAction Action { get; set; }
    }

    public interface IVoteAction
    {

    }
    public class MoveAction : IVoteAction
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }
    public class AttackAction : IVoteAction
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }

    public class SpawnAction : IVoteAction
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public string Unit { get; set; }
    }

    public enum VoteActionType
    {
        Move, Attack, Spawn
    }
}