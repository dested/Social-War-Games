import {BaseEntity} from "../entities/entityManager";
import {GameManager} from "../game/gameManager";
import {GridHexagon} from "../game/gridHexagon";

export type PossibleActions = 'move' | 'attack' | 'spawn';
export class GameService {
    static secondsPerGeneration: number;
    private static gameManager: GameManager;


    static selectedAction: PossibleActions;
    static setSecondsToNextGeneration: (seconds: number) => void;
    static hasData: () => void;
    static onSetSelectedEntity: (entity: BaseEntity) => void;

    static selectedEntity: BaseEntity;
    static selectedHex: GridHexagon;

    static setSelectedEntity(entity: BaseEntity) {
        this.selectedEntity = entity;
        this.onSetSelectedEntity(entity);
    }

    static resetSelection() {
        this.selectedEntity = null;
        this.selectedHex = null;
        this.selectedAction = null;
        this.onSetSelectedEntity(null);
    }

    static setGameManager(gameManager: GameManager) {
        this.gameManager = gameManager;
    };

    static getGameManager() {
        return this.gameManager;
    };
}

