import {BaseEntity} from "../entities/entityManager";
import {GameManager} from "../game/gameManager";
export class GameService {
    static secondsPerGeneration: number;
    private static gameManager: GameManager;


    static setSecondsToNextGeneration: (seconds: number) => void;
    static hasData: () => void;
    static setSelectedEntity: (entity: BaseEntity) => void;

    static setGameManager(gameManager:GameManager) {
        this.gameManager=gameManager;
    };
}

