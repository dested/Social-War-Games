﻿import {GridHexagonConstants, GridMiniHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {GameState} from "../models/hexBoard";
import {GridHexagon} from "./gridHexagon";
import {
    EntityManager,
    HeliEntity,
    MainBaseEntity
} from "../entities/entityManager";
import {Vector3, HexUtils, Node} from "./hexUtils";
import {AssetManager} from "./assetManager";
import {ViewPort} from "../gameManager";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
declare let Hammer;

export class HexBoard {
    hexList: GridHexagon[] = [];
    hexBlock: {[key: number]: GridHexagon} = {};
    boardSize = {width: 0, height: 0};
    entityManager: EntityManager;
    generation: number = -1;
    private visibleHexList: GridHexagon[];

    constructor() {
        this.entityManager = new EntityManager(this);
    }

    setSize(width, height) {
        this.boardSize.width = width;
        this.boardSize.height = height;
    }

    gameDimensions(): {width: number, height: number} {
        const size = {width: 0, height: 0};
        size.width = GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = GridHexagonConstants.height() * this.boardSize.height;
        return size;
    }

    gameDimensionsMini(): {width: number, height: number} {
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
        this.hexList = HexUtils.orderBy(this.hexList, m => (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height);
    }

    getHexAtSpot(x, z): GridHexagon {
        return this.hexBlock[x + z * 5000];
    }

    pathFind(start: GridHexagon, finish: GridHexagon) {
        const myPathStart = new Node(null, start);
        const myPathEnd = new Node(null, finish);
        let aStar = [];
        let open = [myPathStart];
        let closed = [];
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
        this.createMiniCanvas();
        let tile = AssetManager.assets['tile'];

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
                gridHexagon.setTexture(tile);
                gridHexagon.setBaseColor(HexagonColorUtils.baseColors);
                gridHexagon.buildPaths();
                gridHexagon.buildMiniPaths();
                this.addHexagon(gridHexagon);
            }
        }

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

        /*
         state.entities = [];
         for (var i = 0; i < state.terrain.width - 10; i += 1) {
         state.entities.push({
         factionId: i % 3 + 1, health: 10,
         x: 10 + i, z: state.terrain.height/4,
         id: 'foo' + i,
         entityType: "Plane"
         });
         }*/

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
                    case "Plane": {
                        entity = new HeliEntity(this.entityManager, stateEntity);
                        break;
                    }
                }
                gridHexagon.setFaction(stateEntity.factionId);
                entity.setId(stateEntity.id);
                entity.setHealth(stateEntity.health);
                entity.setTile(gridHexagon);
                this.entityManager.addEntity(entity);
            } else {
                entity.setHealth(stateEntity.health);
                entity.setTile(gridHexagon);
            }
        }

        this.rebuildMiniBoard();
    }


    drawBoard(context: CanvasRenderingContext2D, viewPort: ViewPort): void {
        context.lineWidth = 1;
        for (let i = 0; i < this.visibleHexList.length; i++) {
            const gridHexagon = this.visibleHexList[i];
            gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
            // gridHexagon.drawMini(context, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ())
            let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
            if (entities) {
                for (let j = 0; j < entities.length; j++) {
                    entities[j].draw(context);
                }
            }
        }

    }


    resetVisibleHexList(viewPort: ViewPort): void {
        let visibleHexList = [];
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            if (gridHexagon.shouldDraw(viewPort)) {
                visibleHexList.push(gridHexagon);
            }
        }
        this.visibleHexList = visibleHexList;
    }

    private createMiniCanvas() {
        let size = this.gameDimensionsMini();

        let canvas = document.createElement("canvas");
        canvas.width = size.width + 20;
        canvas.height = size.height + 20;
        let context = canvas.getContext("2d");

        this.miniCanvas = canvas;
        this.miniContext = context;

        let leftBubble = document.getElementById('leftBubble');
        leftBubble.appendChild(this.miniCanvas);
        var width = leftBubble.clientWidth;
        var height = leftBubble.clientHeight;
        let mc = new Hammer.Manager(leftBubble);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        let tapStart = {x: 0, y: 0};
        mc.on('panstart', (ev) => {
            tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
            tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
            tapStart.x = tapStart.x || 0;
            tapStart.y = tapStart.y || 0;
            return true;
        });

        mc.on('panmove', (ev) => {
            let rx = (tapStart.x + ev.deltaX);
            let ry = (tapStart.y + ev.deltaY);

            if (rx < width * 2 / 5 && rx > -size.width + width * 2 / 5) {
                canvas.style.marginLeft = rx + "px";
            }
            if (ry < height * 2 / 5 && ry > -size.height + height * 2 / 5) {
                canvas.style.marginTop = ry + "px";
            }
        });
    }

    private miniCanvas: HTMLCanvasElement;
    private miniContext: CanvasRenderingContext2D;

    private rebuildMiniBoard() {
        let size = this.gameDimensionsMini();
        this.miniContext.save();
        this.miniContext.clearRect(0, 0, size.width + 20, size.height + 20);
        this.miniContext.translate(10, 10);
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            gridHexagon.drawMini(this.miniContext, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ());

        }
        this.miniContext.restore();
    }
}