import {GameManager} from "../game/gameManager";
import {GridHexagon} from "../game/gridHexagon";
import {PossibleActions} from "../entities/entityManager";
import {BaseEntity} from "../entities/baseEntity";

export class GameService {
    static secondsPerGeneration: number;
    private static gameManager: GameManager;


    static selectedAction: PossibleActions;
    static setSecondsToNextGeneration: (seconds: number) => void;
    static hasData: () => void;
    static onSetSelectedEntity: (entity: BaseEntity) => void;

    private static _selectedEntity: BaseEntity;
    static get selectedEntity(): BaseEntity {
        return this._selectedEntity;
    }

    static selectedHex: GridHexagon;

    static setSelectedEntity(entity: BaseEntity) {
        this._selectedEntity = entity;
        this.onSetSelectedEntity(entity);
        if (entity != null) {
            this.gameManager.viewPort.animateZoom(1.5, entity.getTile())
        } else {
            this.gameManager.viewPort.animateZoom(1, null)
        }
    }

    static resetSelection() {
        this._selectedEntity = null;
        this.selectedHex = null;
        this.selectedAction = null;
        this.onSetSelectedEntity(null);
        this.gameManager.viewPort.animateZoom(1, null)
    }

    static setGameManager(gameManager: GameManager) {
        this.gameManager = gameManager;
    };

    static getGameManager() {
        return this.gameManager;
    };
}

