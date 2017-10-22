import {StationaryEntity} from "./stationaryEntity";

import {EntityManager} from "./entityManager";
import {GameEntity} from "../models/hexBoard";
export class MainBaseEntity extends StationaryEntity {
    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 0, 0);
        this.entityType = 'MainBase';
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
