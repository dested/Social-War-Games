import {PossibleActions} from "./entityManager";
export class EntityDetail {
    public solid: boolean;
    public moveRadius: number;
    public attackRadius: number;
    public spawnRadius: number;
    public attackPower: number;
    public ticksToSpawn: number;
    public health: number;
    public healthRegenRate: number;
    public defaultAction: PossibleActions;
}

export class EntityDetails {

    static instance: EntityDetails = new EntityDetails();
    details: { [entity: string]: EntityDetail } = {};

    constructor() {

        this.details["Base"] = new EntityDetail();
        this.details["Base"].moveRadius = 0;
        this.details["Base"].health = 10;
        this.details["Base"].attackRadius = 0;
        this.details["Base"].attackPower = 0;
        this.details["Base"].ticksToSpawn = 5;
        this.details["Base"].healthRegenRate = 1;
        this.details["Base"].solid = true;
        this.details["Base"].spawnRadius = 3;
        this.details["Base"].defaultAction = 'spawn';


        this.details["MainBase"] = new EntityDetail();
        this.details["MainBase"].moveRadius = 0;
        this.details["MainBase"].health = 30;
        this.details["MainBase"].attackRadius = 0;
        this.details["MainBase"].attackPower = 0;
        this.details["MainBase"].ticksToSpawn = 0;
        this.details["MainBase"].healthRegenRate = 0;
        this.details["MainBase"].solid = true;
        this.details["MainBase"].spawnRadius = 4;
        this.details["MainBase"].defaultAction = 'spawn';


        this.details["Tank"] = new EntityDetail();
        this.details["Tank"].moveRadius = 4;
        this.details["Tank"].health = 8;
        this.details["Tank"].attackRadius = 8;
        this.details["Tank"].attackPower = 3;
        this.details["Tank"].ticksToSpawn = 3;
        this.details["Tank"].healthRegenRate = 1;
        this.details["Tank"].solid = false;
        this.details["Tank"].spawnRadius = 0;
        this.details["Tank"].defaultAction = 'move';


        this.details["Heli"] = new EntityDetail();
        this.details["Heli"].moveRadius = 10;
        this.details["Heli"].health = 2;
        this.details["Heli"].attackRadius = 3;
        this.details["Heli"].attackPower = 3;
        this.details["Heli"].ticksToSpawn = 4;
        this.details["Heli"].healthRegenRate = 1;
        this.details["Heli"].solid = false;
        this.details["Heli"].spawnRadius = 0;
        this.details["Heli"].defaultAction = 'move';


        this.details["Infantry"] = new EntityDetail();
        this.details["Infantry"].moveRadius = 8;
        this.details["Infantry"].health = 4;
        this.details["Infantry"].attackRadius = 3;
        this.details["Infantry"].attackPower = 1;
        this.details["Infantry"].ticksToSpawn = 2;
        this.details["Infantry"].healthRegenRate = 1;
        this.details["Infantry"].solid = false;
        this.details["Infantry"].spawnRadius = 2;
        this.details["Infantry"].defaultAction = 'move';
    }
}