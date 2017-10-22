import {HexBoard} from "../game/hexBoard";
import {GridHexagon} from "../game/gridHexagon";
import {BaseEntity} from "./baseEntity";
import {Vector3} from "../game/hexUtils";
export class EntityManager {

    constructor(public hexBoard: HexBoard) {
    }


    public entities: BaseEntity[] = [];
    private entityKeys: { [entityId: string]: BaseEntity } = {};
    private entitiesMap: { [tileKey: string]: BaseEntity[] } = {};


    tick() {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            entity.tick();
        }
    }

    getEntitiesAtTile(item: Vector3): BaseEntity[] {
        return this.entitiesMap[item.x + item.z * 5000] || [];
    }

    addEntity(entity: BaseEntity) {
        this.entities.push(entity);
        this.entityKeys[entity.id] = entity;
    }

    empty(): void {
        this.entities.length = 0;
        this.entitiesMap = {};
        this.entityKeys = {};
    }

    getEntityById(id: string): BaseEntity {
        return this.entityKeys[id];
    }

    removeEntityFromTile(tile: GridHexagon, entity: BaseEntity): void {
        let entities = this.entitiesMap[tile.x + tile.z * 5000];
        entities.splice(entities.indexOf(entity), 1);

        this.entitiesMap[tile.x + tile.z * 5000] = entities;
    }

    killEntity(entity: BaseEntity): void {
        var tile = entity.getTile();

        let entities = this.entitiesMap[tile.x + tile.z * 5000];
        entities.splice(entities.indexOf(entity), 1);

        this.entitiesMap[tile.x + tile.z * 5000] = entities;
        this.entities.splice(this.entities.indexOf(entity), 1);
    }

    addEntityToTile(tile: GridHexagon, entity: BaseEntity): void {
        if (!this.entitiesMap[tile.x + tile.z * 5000]) {
            this.entitiesMap[tile.x + tile.z * 5000] = [];
        }
        this.entitiesMap[tile.x + tile.z * 5000].push(entity);
    }
}

export type EntityUnits = 'Tank' | 'Heli' | 'Infantry' | 'MainBase' | 'Base';
export type PossibleActions = 'move' | 'attack' | 'spawn';
