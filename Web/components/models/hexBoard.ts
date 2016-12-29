export class GameState  {
    public id: string;
    public lastGeneration: Date;
    public terrain: Terrain;
    public entities: GameEntity[];
    public generation: number;
    public factionData: string;
}
export class Terrain {
    public width: number;
    public height: number;
    public boardStr: string;
}
export class GameEntity {
    public id: string;
    public factionId: number;
    public entityType: string;
    public health: number;
    public x: number;
    public z: number;
}
