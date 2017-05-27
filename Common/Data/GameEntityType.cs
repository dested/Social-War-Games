using System.Collections.Generic;

namespace Common.Data
{
    public enum GameEntityType
    {
        Infantry = 0,
        Tank = 1,
        Base = 2,
        MainBase = 3,
        Heli = 4/*,
        Wall = 5,
        Gate = 6*/
    }

    public enum VoteActionType
    {
        Move,
        Attack,
        Spawn
    }

    public static class EntityDetails
    {
        public static Dictionary<GameEntityType, EntityDetail> Detail = new Dictionary<GameEntityType, EntityDetail>()
        {
            {
                GameEntityType.Base, new EntityDetail()
                {
                    MoveRadius = 0,
                    Health = 10,
                    AttackRadius = 0,
                    AttackPower = 0,
                    TicksToSpawn = 5,
                    HealthRegenRate = 1,
                    Solid = true,
                    SpawnRadius = 3
                }
            },
            {
                GameEntityType.MainBase, new EntityDetail()
                {
                    MoveRadius = 0,
                    Health = 30,
                    AttackRadius = 0,
                    AttackPower = 0,
                    TicksToSpawn = 0,
                    HealthRegenRate = 0,
                    Solid = true,
                    SpawnRadius = 4
                }
            },
            {
                GameEntityType.Tank, new EntityDetail()
                {
                    MoveRadius = 4,
                    Health = 8,
                    AttackRadius = 8,
                    AttackPower = 3,
                    TicksToSpawn = 3,
                    HealthRegenRate = 1,
                    Solid = false,
                    SpawnRadius = 0
                }
            },
            {
                GameEntityType.Heli, new EntityDetail()
                {
                    MoveRadius = 10,
                    Health = 2,
                    AttackRadius = 3,
                    AttackPower = 3,
                    TicksToSpawn = 4,
                    HealthRegenRate = 1,
                    Solid = false,
                    SpawnRadius = 0
                }
            },
            {
                GameEntityType.Infantry, new EntityDetail()
                {
                    MoveRadius = 8,
                    Health = 4,
                    AttackRadius = 3,
                    AttackPower = 1,
                    TicksToSpawn = 2,
                    HealthRegenRate = 1,
                    Solid = false,
                    SpawnRadius = 2
                }
            }
        };
    }

    public class EntityDetail
    {
        public bool Solid { get; set; }

        public int MoveRadius { get; set; }
        public int AttackRadius { get; set; }
        public int SpawnRadius { get; set; }

        public int AttackPower { get; set; }

        public int TicksToSpawn { get; set; }

        public int Health { get; set; }
        public int HealthRegenRate { get; set; }
    }
}