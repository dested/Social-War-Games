import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {GameState} from "../models/hexBoard";
import {GridHexagon} from "./gridHexagon";
import {
    EntityManager,
    HeliEntity,
    BaseEntity,
    MainBaseEntity
} from "../entities/entityManager";
import {ColorUtils} from "../utils/color";
import {Vector3, HexUtils, Node} from "./hexUtils";
import {AssetManager} from "./assetManager";

export class HexBoard {
    viewPort = {x: 0, y: 0, width: 400, height: 400, padding: GridHexagonConstants.width * 2};
    hexList: GridHexagon[] = [];
    hexBlock: {[key: number]: GridHexagon} = {};
    boardSize = {width: 0, height: 0};
    entityManager: EntityManager;
    generation: number = -1;

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


    resize(width: number, height: number) {
        this.viewPort.width = width;
        this.viewPort.height = height;
    }


    offsetView(x: number, y: number) {
        this.viewPort.x += x;
        this.viewPort.y += y;
        this.constrainViewPort();
    }

    setView(x: number, y: number) {
        this.viewPort.x = x;
        this.viewPort.y = y;
        this.constrainViewPort();
        localStorage.setItem("lastX", this.viewPort.x.toString());
        localStorage.setItem("lastY", this.viewPort.y.toString());
    }

    constrainViewPort() {
        this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
        this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
        const size = this.gameDimensions();
        this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
        this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height)
    }

    initialize(state: GameState) {
        this.generation = state.generation;
        let terrain = state.terrain;
        const str = terrain.boardStr;
        this.setSize(terrain.width, terrain.height);
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
                gridHexagon.setBaseColor(HexBoard.otherColors);
                gridHexagon.buildPaths();
                this.addHexagon(gridHexagon);
            }
        }

        this.entityManager.empty();
        this.updateFactionEntities(state);

        this.reorderHexList();

        let lx = localStorage.getItem("lastX");
        let ly = localStorage.getItem("lastY");

        if (lx && ly) {
            this.setView(parseInt(lx), parseInt(ly))
        }
    }


    static otherColors: HexagonColor[];
    static factionHexColors: HexagonColor[][];
    static factionColors: string[];


    public updateFactionEntities(state: GameState) {
        this.generation = state.generation;

        let factionData = state.factionData;

        let ys = factionData.split('|');
        for (let z = 0; z < state.terrain.height; z++) {
            const yItem = ys[z].split('');
            for (let x = 0; x < state.terrain.width; x++) {
                const faction = parseInt(yItem[x]);
                let hex = this.getHexAtSpot(x, z);
                hex.faction = faction;
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
                gridHexagon.faction = stateEntity.factionId;
                entity.setId(stateEntity.id);
                entity.setHealth(stateEntity.health);
                entity.setTile(gridHexagon);
                this.entityManager.addEntity(entity);
            } else {
                entity.setHealth(stateEntity.health);
                entity.setTile(gridHexagon);
            }
        }
    }

    getHexAtPoint(clickX, clickY): GridHexagon {
        let lastClick: GridHexagon = null;
        clickX += this.viewPort.x;
        clickY += this.viewPort.y;

        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            const x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
            let z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
            z -= gridHexagon.getDepthHeight();
            z += gridHexagon.y * GridHexagonConstants.depthHeight();
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonTopPolygon())) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
        }

        return lastClick;
    }


    drawBoard(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(-this.viewPort.x, -this.viewPort.y);
        context.lineWidth = 1;
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            if (this.shouldDraw(gridHexagon)) {
                this.drawHexagon(context, gridHexagon);
                let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                if (entities) {
                    for (let j = 0; j < entities.length; j++) {
                        entities[j].draw(context);
                    }
                }
            }
        }
        context.restore();
    }

    shouldDraw(gridHexagon: GridHexagon): boolean {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealZ();

        return x > this.viewPort.x - this.viewPort.padding &&
            x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
            y > this.viewPort.y - this.viewPort.padding &&
            y < this.viewPort.y + this.viewPort.height + this.viewPort.padding;


    }

    drawHexagon(context: CanvasRenderingContext2D, gridHexagon: GridHexagon): void {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealZ();
        gridHexagon.draw(context, x, y);
    }

    centerOnHex(gridHexagon: GridHexagon): void {
        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealZ();
        this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
    }

    public static setupColors() {
        this.otherColors = [new HexagonColor('#AFFFFF')];
        for (let i = 0; i < 6; i++) {
            this.otherColors.push(new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6))));
        }
        this.factionColors = ["#4953FF", "#FF4F66", "#3DFF53"];
        this.factionHexColors = [];

        for (let f = 0; f < this.factionColors.length; f++) {
            this.factionHexColors[f] = [];
            this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.otherColors[0].color, this.factionColors[f], 0.9)));
            for (let i = 0; i < 6; i++) {
                this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.otherColors[i + 1].color, DrawingUtils.colorLuminance(this.factionColors[f], (i / 6)), 0.9)));
            }
        }

    }

}