export interface VoteResponse {
    generationMismatch: boolean;
    issueVoting: boolean;
    votes: GameMetricsVote[];
}
export interface GameState {
    id: string;
    lastGeneration: Date;
    terrain: Terrain;
    entities: GameEntity[];
    generation: number;
    tickIntervalSeconds:number;
    factionData: string;
}
export interface Terrain {
    width: number;
    height: number;
    boardStr: string;
}
export interface GameEntity {
    id: string;
    factionId: number;
    entityType: string;
    health: number;
    x: number;
    z: number;
}
export interface GameMetrics {
    generation: number;
    usersVoted: number;
    votes: GameMetricsVote[];
    nextGeneration: string;
    nextGenerationDate: Date;
}
export interface GameMetricsVote {
    votes: number;
    action: GameMetricVoteAction;
}
export interface GameMetricVoteAction {
    entityId: string;
    actionType: string;
}
export interface GameMetricMoveVoteAction extends GameMetricVoteAction {
    x: number;
    z: number;
}
export interface GameMetricAttackVoteAction extends GameMetricVoteAction {
    x: number;
    z: number;
}
export interface GameMetricSpawnVoteAction extends GameMetricVoteAction {
    x: number;
    z: number;
    unit: string;
}
