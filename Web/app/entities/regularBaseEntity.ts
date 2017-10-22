import {EntityManager} from "./entityManager";
import {StationaryEntity} from "./stationaryEntity";
import {GameEntity} from "../models/hexBoard";
export class RegularBaseEntity extends StationaryEntity {
    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 0, 0);
        this.entityType = 'Base';
    }

    realYOffset(): number {
        return 0;
    }

    realXOffset(): number {
        return 0;
    }

    getYOffset(): number {
        return 0;
    }

}
