import {EntityManager} from "./entityManager";
import {SixDirectionEntity} from "./sixDirectionEntity";
import {GameEntity} from "../models/hexBoard";
export class InfantryEntity extends SixDirectionEntity {
    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 2, 10);
        this.entityType = 'Infantry';
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
