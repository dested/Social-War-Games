import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {HexBoard} from "../hexBoard";
import {HexBoardModel} from "../models/hexBoard";
import {ClientGridHexagon} from "./clientGridHexagon";
import {ClientSpriteManager, ClientHeliSprite, ClientBaseSprite} from "../clientSpriteManager";

export class ClientHexBoard extends HexBoard {
    viewPort = {x: 0, y: 0, width: 400, height: 400, padding: GridHexagonConstants.width * 2};
    clientSpriteManager: ClientSpriteManager;

    constructor() {
        super();
        this.clientSpriteManager = this.spriteManager = new ClientSpriteManager(this);
    }


    resize(width, height) {
        this.viewPort.width = width;
        this.viewPort.height = height;
    }



    offsetView(x, y) {
        this.viewPort.x += x;
        this.viewPort.y += y;
        this.constrainViewPort();
    }

    setView(x, y) {
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

    initialize(board: HexBoardModel) {
        const str = board.boardStr;
        this.setSize(board.width, board.height);
        var baseColor = new HexagonColor('#AFFFFF');

        var otherColors = [];

        for (var i = 0; i < 6; i++) {
            otherColors[i] = new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6)));
        }

        const ys = str.split('|');
        for (let y = 0; y < board.height; y++) {
            const yItem = ys[y].split('');
            for (let x = 0; x < board.width; x++) {
                const xItem = parseInt(yItem[x]);

                let gridHexagon = new ClientGridHexagon();
                gridHexagon.x = x;
                gridHexagon.y = 0;
                gridHexagon.z = y;
                gridHexagon.height = xItem == 0 ? 0 : xItem;
                if (xItem == 0) {
                    gridHexagon.hexColor = baseColor;

                } else {
                    gridHexagon.hexColor = otherColors[xItem - 1];
                }
                gridHexagon.buildPaths();
                this.addHexagon(gridHexagon);

                if (Math.random() * 100 < 5) {

                    var sprite = new ClientHeliSprite(this.clientSpriteManager);
                    sprite.setTile(gridHexagon);
                    sprite.key = 'Heli';

                    this.clientSpriteManager.addSprite(sprite);
                }

            }
        }
        this.reorderHexList();
    }


    getHexAtSpot(x: number, y: number, z: number): ClientGridHexagon {
        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = <ClientGridHexagon> this.hexList[i];
            if (gridHexagon.x === x && gridHexagon.y === y && gridHexagon.z === z) {
                return gridHexagon;
            }
        }
        return null;
    }

    getHexAtPoint(clickX, clickY): ClientGridHexagon {
        let lastClick: ClientGridHexagon = null;
        clickX += this.viewPort.x;
        clickY += this.viewPort.y;

        for (let i = 0; i < this.hexList.length; i++) {
            const gridHexagon = <ClientGridHexagon> this.hexList[i];
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
            const gridHexagon = <ClientGridHexagon> this.hexList[i];
            if (this.shouldDraw(gridHexagon)) {
                this.drawHexagon(context, gridHexagon);
                var sprites = this.clientSpriteManager.spritesMap[gridHexagon.x + gridHexagon.z * 5000];
                if (sprites) {
                    for (var j = 0; j < sprites.length; j++) {
                        var sprite = <ClientBaseSprite> sprites[j];
                        sprite.draw(context);
                    }
                }
            }
        }

        this.clientSpriteManager.draw(context);
        context.restore();
    }

    shouldDraw(gridHexagon: ClientGridHexagon) {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealY();

        return x > this.viewPort.x - this.viewPort.padding &&
            x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
            y > this.viewPort.y - this.viewPort.padding &&
            y < this.viewPort.y + this.viewPort.height + this.viewPort.padding;


    }

    drawHexagon(context: CanvasRenderingContext2D, gridHexagon: ClientGridHexagon) {

        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealY();
        context.save();
        context.translate(x, y);
        gridHexagon.draw(context);
        context.restore();

    }

}