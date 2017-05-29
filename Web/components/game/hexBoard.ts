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
    private hexListHeightMap: GridHexagon[][];
    private visibleHexListHeightMap: GridHexagon[][];
    private visibleEntityHeightMap: BaseEntity[][];

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

        let hx = this.hexList.sort((a, b) => a.height - b.height);

        let curHeight = 0;
        let hx_h = [];

        let c_h = [];
        for (let t = 0; t < hx.length; t++) {
            let hex = this.hexList[t];
            if (hex.height != curHeight) {
                curHeight = hex.height;
                hx_h.push(c_h);
                c_h = [];
            }
            c_h.push(hex);
        }
        hx_h.push(c_h);
        for (let i = 0; i < hx_h.length; i++) {
            hx_h[i] = HexUtils.orderBy(hx_h[i], m => (m.z) * 1000 + (m.x % 2) * -200)
        }

        this.hexList = [];
        this.hexListHeightMap = [];
        for (let i = 0; i < hx_h.length; i++) {
            let h = hx_h[i];
            // console.log(h.length);
            this.hexListHeightMap[i] = h;
            this.hexList.push(...h);
        }

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
                    if (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) >= 2)
                        continue;
                    path = new Node(node, n);
                    if (!aStar[path.value()]) {
                        path.g = node.g + HexUtils.distance(n, node.item) + (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) * 2);
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
        let stoneLeft = AssetManager.getAsset('Stone.Left');
        let stoneBottom = AssetManager.getAsset('Stone.Bottom');
        let stoneRight = AssetManager.getAsset('Stone.Right');


        let grassTop = AssetManager.getAsset('Grass.Top');
        let grassLeft = AssetManager.getAsset('Grass.Left');
        let grassBottom = AssetManager.getAsset('Grass.Bottom');
        let grassRight = AssetManager.getAsset('Grass.Right');

        let waterTop = AssetManager.getAsset('Water.Top');
        let waterLeft = AssetManager.getAsset('Water.Left');
        let waterBottom = AssetManager.getAsset('Water.Bottom');
        let waterRight = AssetManager.getAsset('Water.Right');

        let ys = str.split('|');
        for (let z = 0; z < terrain.height; z++) {
            const yItem = ys[z].split('');
            for (let x = 0; x < terrain.width; x++) {
                const result = parseInt(yItem[x]);
                let gridHexagon = new GridHexagon();
                gridHexagon.x = x;
                gridHexagon.y = 0;
                gridHexagon.z = z;
                gridHexagon.height = result;
                if (result == 0) {
                    gridHexagon.setTexture(waterTop, waterLeft, waterBottom, waterRight);
                } else if (result > 0 && result < 3) {
                    gridHexagon.setTexture(grassTop, grassLeft, grassBottom, grassRight);
                } else {
                    gridHexagon.setTexture(stoneTop, stoneLeft, stoneBottom, stoneRight);
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


    drawBoard(context: CanvasRenderingContext2D): void {
        context.lineWidth = 1;
        let str = '';
        for (let j = 0; j < this.visibleHexListHeightMap.length; j++) {
            let hexList = this.visibleHexListHeightMap[j];
            let entList = this.visibleEntityHeightMap[j];
            for (let i = 0; i < hexList.length; i++) {
                const gridHexagon = hexList[i];
                gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
            }

            for (let j = 0; j < entList.length; j++) {
                entList[j].draw(context);
            }
            str += `height ${j} hexes: ${hexList.length} entities: ${entList.length} \r\n`;
        }
        str += '-------';
        console.log(str);
    }

    resetVisibleHexList(): void {
        let viewPort = GameService.getGameManager().viewPort;
        let visibleHexList = new Array(10);
        let visibleEntity = new Array(10);

        for (let i = 0; i < 10; i++) {
            visibleHexList[i] = [];
            visibleEntity[i] = [];
        }

        for (let j = 0; j < this.hexListHeightMap.length; j++) {
            let hexList = this.hexListHeightMap[j];
            for (let i = 0; i < hexList.length; i++) {
                const gridHexagon = hexList[i];
                if (gridHexagon.shouldDraw(viewPort)) {
                    visibleHexList[j].push(gridHexagon);
                    let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                    if (entities.length) {
                        let aboveMe = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, Direction.Top);
                        let localYOffset = 0;
                        if (aboveMe && aboveMe.height > gridHexagon.height) {
                            localYOffset = 1;
                        } else {
                            let topLeft = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, Direction.TopLeft);
                            if (topLeft && topLeft.height > gridHexagon.height) {
                                localYOffset = 1;
                            } else {
                                let topRight = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, Direction.TopRight);
                                if (topRight && topRight.height > gridHexagon.height) {
                                    localYOffset = 1;
                                }
                            }
                        }


                        for (let c = 0; c < entities.length; c++) {
                            visibleEntity[j + entities[c].getYOffset() + localYOffset].push(entities[c]);
                        }
                    }
                }
            }
        }


        this.visibleHexListHeightMap = visibleHexList;
        this.visibleEntityHeightMap = visibleEntity;
    }

}