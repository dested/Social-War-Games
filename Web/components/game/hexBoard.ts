import {GridHexagonConstants, GridMiniHexagonConstants} from ".//gridHexagonConstants";
import {GameState} from "../models/hexBoard";
import {GridHexagon} from "./gridHexagon";
import {EntityManager} from "../entities/entityManager";
import {Vector3, HexUtils, Node, Direction} from "./hexUtils";
import {AssetManager} from "./assetManager";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
import {ViewPort} from "./viewPort";
import {ISize} from "../utils/utils";
import {BaseEntity} from "../entities/baseEntity";
import {MainBaseEntity} from "../entities/mainBaseEntity";
import {RegularBaseEntity} from "../entities/regularBaseEntity";
import {HeliEntity} from "../entities/heliEntity";
import {SixDirectionEntity} from "../entities/sixDirectionEntity";
import {InfantryEntity} from "../entities/infantyEntity";
import {TankEntity} from "../entities/tankEntity";
import {GameService} from "../ui/gameService";

export class HexBoard {
    hexListLength: number;
    hexList: GridHexagon[] = [];
    hexBlock: { [key: number]: GridHexagon } = {};
    boardSize: ISize = {width: 0, height: 0};
    entityManager: EntityManager;
    generation: number = -1;
    private visibleHexListMap: GridHexagon[];
    private visibleEntityMap: BaseEntity[];

    constructor() {
        this.entityManager = new EntityManager(this);
    }

    setSize(width: number, height: number) {
        this.boardSize.width = width;
        this.boardSize.height = height;
    }

    gameDimensions(): ISize {
        const size = {width: 0, height: 0};
        size.width = GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = GridHexagonConstants.height() * this.boardSize.height;
        return size;
    }

    gameDimensionsMini(): { width: number, height: number } {
        const size = {width: 0, height: 0};
        size.width = GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = GridMiniHexagonConstants.height() * this.boardSize.height;
        return size;
    }


    addHexagon(hexagon: GridHexagon) {
        this.hexList.push(hexagon);
        this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
    }


    reorderHexList() {
        this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200)
        // this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200 + m.height);
    }

    getHexAtSpot(x: number, z: number): GridHexagon {
        return this.hexBlock[x + z * 5000];
    }

    getHexAtSpotDirection(x: number, z: number, direction: Direction): GridHexagon {
        switch (direction) {
            case Direction.Top:
                z -= 1;
                break;
            case Direction.Bottom:
                z += 1;
                break;

            case Direction.TopLeft:
                if (x % 2 === 1) {
                    z -= 1;
                }
                x -= 1;

                break;
            case Direction.BottomLeft:
                if (x % 2 === 0) {
                    z += 1;
                }
                x -= 1;
                break;

            case Direction.TopRight:
                if (x % 2 === 1) {
                    z -= 1;
                }
                x += 1;
                break;
            case Direction.BottomRight:
                if (x % 2 === 0) {
                    z += 1;
                }
                x += 1;
                break;

        }

        return this.hexBlock[x + z * 5000];
    }


    pathFind(start: GridHexagon, finish: GridHexagon) {
        const myPathStart = new Node(null, start);
        const myPathEnd = new Node(null, finish);
        let aStar: boolean[] = [];
        let open = [myPathStart];
        let closed: Node[] = [];
        const result: Vector3[] = [];
        let neighbors;
        let node;
        let path;
        let length, max, min, i, j;
        while (length = open.length) {
            max = Infinity;
            min = -1;
            for (i = 0; i < length; i++) {
                if (open[i].f < max) {
                    max = open[i].f;
                    min = i;
                }
            }
            node = open.splice(min, 1)[0];
            if (node.x === myPathEnd.x && node.z === myPathEnd.z) {
                path = closed[closed.push(node) - 1];
                do {
                    result.push(path.item);
                }
                while (path = path.parent);
                aStar = closed = open = [];
                result.reverse();
            }
            else {
                neighbors = node.item.getNeighbors();
                for (i = 0, j = neighbors.length; i < j; i++) {
                    const n = this.getHexAtSpot(neighbors[i].x, neighbors[i].z);
                    if (!n) continue;
                    /*
                     if (Math.abs((node.item.height) - (n.height)) >= 2)
                     continue;
                     */
                    path = new Node(node, n);
                    if (!aStar[path.value()]) {
                        path.g = node.g + HexUtils.distance(n, node.item) /*+ (Math.abs((node.item.height) - (n.height)) * 2)*/;
                        path.f = path.g + HexUtils.distance(n, finish);
                        open.push(path);
                        aStar[path.value()] = true;
                    }
                }
                closed.push(node);
            }
        }
        return result;
    }


    initialize(state: GameState) {
        this.generation = state.generation;
        let terrain = state.terrain;
        const str = terrain.boardStr;
        this.setSize(terrain.width, terrain.height);
        let stoneTop = AssetManager.getAsset('Stone.Top');


        let grassTop = AssetManager.getAsset('Grass.Top');

        let waterTop = AssetManager.getAsset('Water.Top');

        let ys = str.split('|');
        for (let z = 0; z < terrain.height; z++) {
            const yItem = ys[z].split('');
            for (let x = 0; x < terrain.width; x++) {
                const tileType = parseInt(yItem[x]);
                let gridHexagon = new GridHexagon();
                gridHexagon.x = x;
                gridHexagon.z = z;
                gridHexagon.tileType = tileType;
                if (tileType == 0) {
                    gridHexagon.setTexture(waterTop);
                } else if (tileType > 0 && tileType < 3) {
                    gridHexagon.setTexture(grassTop);
                } else {
                    gridHexagon.setTexture(stoneTop);
                }
                gridHexagon.setBaseColor(HexagonColorUtils.baseColors);
                gridHexagon.buildPaths();
                gridHexagon.buildMiniPaths();
                this.addHexagon(gridHexagon);
            }
        }

        this.hexListLength = this.hexList.length;

        this.entityManager.empty();
        this.reorderHexList();

        this.updateFactionEntities(state);
    }


    public updateFactionEntities(state: GameState) {
        this.generation = state.generation;

        let factionData = state.factionData;

        let ys = factionData.split('|');
        for (let z = 0; z < state.terrain.height; z++) {
            const yItem = ys[z].split('');
            for (let x = 0; x < state.terrain.width; x++) {
                const faction = parseInt(yItem[x]);
                let hex = this.getHexAtSpot(x, z);
                hex.setFaction(faction);

            }
        }

        for (let i = 0; i < state.entities.length; i++) {
            let stateEntity = state.entities[i];
            let entity = this.entityManager.getEntityById(stateEntity.id);
            let gridHexagon = this.getHexAtSpot(stateEntity.x, stateEntity.z);
            if (entity == null) {
                switch (stateEntity.entityType) {
                    case "MainBase": {
                        entity = new MainBaseEntity(this.entityManager, stateEntity);
                        break;
                    }
                    case "Base": {
                        entity = new RegularBaseEntity(this.entityManager, stateEntity);
                        break;
                    }
                    case "Heli": {
                        entity = new HeliEntity(this.entityManager, stateEntity);
                        (<SixDirectionEntity>entity).setDirection(stateEntity.direction);
                        break;
                    }
                    case "Infantry": {
                        entity = new InfantryEntity(this.entityManager, stateEntity);
                        (<SixDirectionEntity>entity).setDirection(stateEntity.direction);
                        break;
                    }
                    case "Tank": {
                        entity = new TankEntity(this.entityManager, stateEntity);
                        (<SixDirectionEntity>entity).setDirection(stateEntity.direction);
                        break;
                    }
                }
                gridHexagon.setFaction(stateEntity.factionId);
                entity.setId(stateEntity.id);
                entity.setHealth(stateEntity.health);
                entity.setTile(gridHexagon);
                entity.markAlive();
                this.entityManager.addEntity(entity);
            } else {
                entity.setHealth(stateEntity.health);
                entity.markAlive();
                entity.setTile(gridHexagon);
            }
        }


        for (let i = this.entityManager.entities.length - 1; i >= 0; i--) {
            let entity = this.entityManager.entities[i];
            if (!entity.stillAlive) {
                this.entityManager.killEntity(entity);
            }
            else {
                entity.stillAlive = false;
            }
        }
        this.resetVisibleHexList()
    }


    drawBoard(context: CanvasRenderingContext2D, viewPort: ViewPort): void {
        context.lineWidth = 1;
        let vx = viewPort.getX();
        let vy = viewPort.getY();
        let vw = viewPort.getWidth();
        let vh = viewPort.getHeight();


        // context.drawImage(this.hexListCanvas.canvas, vx, vy, vw, vh, vx, vy, vw, vh);

        for (let j = 0; j < this.visibleHexListMap.length; j++) {
            let gridHexagon = this.visibleHexListMap[j];
            gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());

        }
        let entList = this.visibleEntityMap;
        for (let j = 0; j < entList.length; j++) {
            entList[j].draw(context);
        }
    }

    resetVisibleHexList(): void {
        let viewPort = GameService.getGameManager().viewPort;
        let visibleHexList: GridHexagon[] = [];
        let visibleEntity: BaseEntity[] = [];
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            if (gridHexagon.shouldDraw(viewPort)) {
                visibleHexList.push(gridHexagon);
                let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                if (entities.length) {
                    for (let c = 0; c < entities.length; c++) {
                        visibleEntity.push(entities[c]);
                    }
                }
            }
        }

        this.visibleHexListMap = visibleHexList;
        this.visibleEntityMap = visibleEntity;
    }

}