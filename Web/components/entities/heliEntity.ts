import {EntityManager} from "./entityManager";
import {GameEntity} from "../models/hexBoard";
import {GridHexagonConstants} from "../game/gridHexagonConstants";
import {SixDirectionEntity} from "./sixDirectionEntity";
export class HeliEntity extends SixDirectionEntity {
    realYOffset(): number {

        let offset = GridHexagonConstants.depthHeight()/3;
        return -(Math.sin(this.drawTickNumber / 10)) * offset + offset * 1;
    }


    realXOffset(): number {
        return 0;
    }

    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 2, 10);
        this.entityType = 'Heli';
    }

    getYOffset(): number {
        return 1;
    }
}
