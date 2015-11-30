﻿using Common.Data;

namespace Simulation.Votes
{
    public abstract class Vote
    {
        public string UnitId { get; set; }
        public abstract bool Equivalent(Vote vote);
        public int Count { get; set; }

        public abstract void Complete(MongoGameStateData.GameStateData stateData);

    }
}