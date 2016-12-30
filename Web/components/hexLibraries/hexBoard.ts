import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {GameState} from "../models/hexBoard";
import {GridHexagon} from "./gridHexagon";
import {
    SpriteManager,
    HeliSprite,
    BaseSprite,
    MainBaseSprite
} from "../sprites/spriteManager";
import {ColorUtils} from "../color";
import {Vector3, HexUtils, Node} from "./hexUtils";

export class HexBoard {
    viewPort = {x: 0, y: 0, width: 400, height: 400, padding: GridHexagonConstants.width * 2};
    hexList: GridHexagon[] = [];
    hexBlock: {[key: number]: GridHexagon} = {};
    boardSize = {width: 0, height: 0};
    spriteManager: SpriteManager;

    constructor() {
        this.spriteManager = new SpriteManager(this);
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

    xyToHexIndex(x, y): GridHexagon {
        return this.hexBlock[x + y * 5000];
    }

    pathFind(start: Vector3, finish: Vector3) {
        const myPathStart = new Node(null, start);
        const myPathEnd = new Node(null, finish);
        let aStar = [];
        let open = [myPathStart];
        let closed = [];
        const result: Vector3[] = [];
        let neighbours;
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
            if (node.x === myPathEnd.x && node.y === myPathEnd.y) {
                path = closed[closed.push(node) - 1];
                do {
                    result.push(path.item);
                }
                while (path = path.parent);
                aStar = closed = open = [];
                result.reverse();
            }
            else {
                neighbours = node.item.getNeighbors();
                for (i = 0, j = neighbours.length; i < j; i++) {
                    const n = this.xyToHexIndex(neighbours[i].x, neighbours[i].y);
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
    }

    constrainViewPort() {
        this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
        this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
        const size = this.gameDimensions();
        this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
        this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height)
    }

    initialize(state: GameState) {
        let terrain = state.terrain;
        const str = terrain.boardStr;
        this.setSize(terrain.width, terrain.height);
        let baseColor = new HexagonColor('#AFFFFF');

        let otherColors = [];

        for (let i = 0; i < 6; i++) {
            otherColors[i] = new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6)));
        }

        let ys = str.split('|');
        for (let y = 0; y < terrain.height; y++) {
            const yItem = ys[y].split('');
            for (let x = 0; x < terrain.width; x++) {
                const xItem = parseInt(yItem[x]);
                let gridHexagon = new GridHexagon();
                gridHexagon.x = x;
                gridHexagon.y = 0;
                gridHexagon.z = y;
                gridHexagon.height = xItem === 0 ? 0 : xItem;
                if (xItem === 0) {
                    gridHexagon.setColor(baseColor, true);

                } else {
                    gridHexagon.setColor(otherColors[xItem - 1], true);
                }
                gridHexagon.buildPaths();
                this.addHexagon(gridHexagon);
            }
        }

        let factionData = state.factionData;
        let factionColors = ["#FFFFFF", "#4953FF", "#FF4F66", "#3DFF53"];

        ys = factionData.split('|');
        for (let y = 0; y < terrain.height; y++) {
            const yItem = ys[y].split('');
            for (let x = 0; x < terrain.width; x++) {
                const faction = parseInt(yItem[x]);
                let hex = this.getHexAtSpot(x, 0, y);
                hex.faction = faction;
                if (faction > 0) {
                    if (hex.height == 0) {
                        hex.setColor(new HexagonColor(ColorUtils.blend_colors('#AFFFFF', DrawingUtils.colorLuminance(factionColors[faction], (hex.height / 6)), 0.6)), true);
                    } else {
                        hex.setColor(new HexagonColor(ColorUtils.blend_colors(otherColors[hex.height - 1].color, DrawingUtils.colorLuminance(factionColors[faction], (hex.height / 6)), 0.6)), true);
                    }
                }
            }
        }
        for (let i = 0; i < state.entities.length; i++) {
            let entity = state.entities[i];
            let gridHexagon = this.getHexAtSpot(entity.x, 0, entity.z);
            switch (entity.entityType) {
                case "MainBase": {
                    let sprite = new MainBaseSprite(this.spriteManager);
                    sprite.setTile(gridHexagon);
                    sprite.setId(entity.id);
                    this.spriteManager.addSprite(sprite);
                    this.centerOnHex(gridHexagon);
                    break;
                }
                case "Plane": {
                    let sprite = new HeliSprite(this.spriteManager);
                    sprite.setTile(gridHexagon);
                    sprite.setId(entity.id);
                    this.spriteManager.addSprite(sprite);
                    break;
                }
            }
        }


        this.reorderHexList();
    }


    getHexAtSpot(x: number, y: number, z: number): GridHexagon {
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            if (gridHexagon.x === x && gridHexagon.y === y && gridHexagon.z === z) {
                return gridHexagon;
            }
        }
        return null;
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


    drawBoard(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(-this.viewPort.x, -this.viewPort.y);
        context.lineWidth = 1;
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = this.hexList[i];
            if (this.shouldDraw(gridHexagon)) {
                this.drawHexagon(context, gridHexagon);
                let sprites = this.spriteManager.spritesMap[gridHexagon.x + gridHexagon.z * 5000];
                if (sprites) {
                    for (let j = 0; j < sprites.length; j++) {
                        let sprite = <BaseSprite>sprites[j];
                        sprite.draw(context);
                    }
                }
            }
        }

        this.spriteManager.draw(context);
        context.restore();
    }

    shouldDraw(gridHexagon: GridHexagon) {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealY();

        return x > this.viewPort.x - this.viewPort.padding &&
            x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
            y > this.viewPort.y - this.viewPort.padding &&
            y < this.viewPort.y + this.viewPort.height + this.viewPort.padding;


    }

    drawHexagon(context: CanvasRenderingContext2D, gridHexagon: GridHexagon) {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealY();
        context.save();
        context.translate(x, y);
        gridHexagon.draw(context);
        context.restore();

    }

    centerOnHex(gridHexagon: GridHexagon) {
        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealY();
        this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
    }
}