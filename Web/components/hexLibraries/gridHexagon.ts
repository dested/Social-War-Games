///<reference path="../typings/path2d.d.ts"/>

import {AssetManager, Asset} from "./AssetManager";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {GridHexagonConstants} from "./gridHexagonConstants";
import {HexBoard} from "./hexBoard";
import {BaseSprite} from "../sprites/spriteManager";

export class GridHexagon {

    private topPath: Path2D = null;
    private leftDepthPath: Path2D = null;
    private bottomDepthPath: Path2D = null;
    private rightDepthPath: Path2D = null;
    private drawCache: HTMLCanvasElement = null;


    public x = 0;
    public y = 0;
    public z = 0;
    public height = 0;
    public heightOffset = 0;
    public faction: number = 0;
    private baseColor: HexagonColor[];
    private highlightColor: HexagonColor;
    private texture: Asset;
    private sprite: BaseSprite;


    getRealX(): number {
        return GridHexagonConstants.width * 3 / 4 * this.x;
    }

    getRealY(): number {
        let y = this.z * GridHexagonConstants.height() + ((this.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
        y -= this.getDepthHeight();
        y += this.y * GridHexagonConstants.depthHeight();
        return y;
    }

    getDepthHeight(): number {
        return Math.max(1, (this.height + this.heightOffset) * GridHexagonConstants.depthHeight());
    }

    setSprite(sprite: BaseSprite) {
        this.sprite = sprite;
    }

    setBaseColor(baseColor: HexagonColor[]): void {
        this.baseColor = baseColor;
    }

    setHighlightColor(highlightColor: HexagonColor): void {
        this.highlightColor = highlightColor;
    }

    clearHighlightColor(): void {
        this.highlightColor = null;
    }

    setTexture(texture: Asset): void {
        this.texture = texture;
    }

    setHeightOffset(heightOffset: number): void {
        if (this.heightOffset != heightOffset) {
            this.heightOffset = heightOffset;
            this.buildPaths();
        }
    }

    buildPaths(): void {
        const depthHeight = this.getDepthHeight();
        this.topPath = GridHexagon.buildPath(GridHexagonConstants.hexagonTopPolygon());
        this.leftDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
        this.bottomDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
        this.rightDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
    }


    private  getDrawingColor(): HexagonColor {
        let spriteColor = (this.sprite && new HexagonColor("#f0c2bc"));
        let highlightColor = this.highlightColor;
        let factionColor = (this.faction > 0 && HexBoard.factionHexColors[this.faction-1][this.height]);
        let baseColor = (this.baseColor && this.baseColor[this.height]);
        return spriteColor || highlightColor || factionColor || baseColor;
    }

    drawLeftDepth(context: CanvasRenderingContext2D): void {
        context.save();
        context.save();
        {
            context.clip(this.leftDepthPath);

            context.fillStyle = context.createPattern(this.texture.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().dark1, 0.75);
            context.fill(this.leftDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = this.getDrawingColor().dark1;
        context.stroke(this.leftDepthPath);
        context.restore();
    }


    drawBottomDepth(context: CanvasRenderingContext2D): void {
        context.save();
        context.save();
        {
            context.clip(this.bottomDepthPath);

            context.fillStyle = context.createPattern(this.texture.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().dark2, 0.75);
            context.fill(this.bottomDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = this.getDrawingColor().dark2;
        context.stroke(this.bottomDepthPath);
        context.restore();
    }

    drawRightDepth(context: CanvasRenderingContext2D): void {
        context.save();
        context.save();
        {
            context.clip(this.rightDepthPath);

            context.fillStyle = context.createPattern(this.texture.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().dark3, 0.75);
            context.fill(this.rightDepthPath);
        }
        context.restore();

        context.lineWidth = 1;

        context.strokeStyle = this.getDrawingColor().dark3;
        context.stroke(this.rightDepthPath);
        context.restore();
    }

    drawTop(context: CanvasRenderingContext2D): void {

        context.save();

        {
            context.save();
            {
                context.clip(this.topPath);

                context.fillStyle = context.createPattern(this.texture.image, 'repeat');
                context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width, GridHexagonConstants.height()); // context.fillRect(x, y, width, height);

                context.fillStyle = DrawingUtils.makeTransparent(this.getDrawingColor().color, 0.6);
                context.fill(this.topPath);
            }
            context.restore();
            context.lineWidth = 1;

            context.strokeStyle = this.getDrawingColor().darkBorder;
            context.stroke(this.topPath);
        }
        context.restore();
    }

    invalidate(): void {
        this.drawCache = null;
    }

    envelope(): {width: number, height: number} {
        const size = {width: 0, height: 0};
        size.width = GridHexagonConstants.width;
        size.height = GridHexagonConstants.height();

        size.height += this.getDepthHeight();


        size.width += 12;
        size.height += 6;

        return size;
    }

    hexCenter(): {x: number, y: number} {
        const center = {x: 0, y: 0};
        center.y = GridHexagonConstants.height() / 2;
        center.x = GridHexagonConstants.width / 2;
        center.x += 6;
        center.y += 6;
        return center;
    }


    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        const center = this.hexCenter();
        const c = GridHexagon.getCacheImage(this.getDepthHeight(), this.getDrawingColor(), this.texture.name);

        if (c === this.drawCache) {
            context.drawImage(this.drawCache, offsetX - center.x, offsetY - center.y);
        } else {
            if (!c) {
                const can = document.createElement('canvas');
                const ctx = can.getContext('2d');

                const size = this.envelope();
                can.width = size.width;
                can.height = size.height;
                ctx.save();


                ctx.translate(center.x, center.y);
                if (this.getDepthHeight() > 1) {
                    this.drawLeftDepth(ctx);
                    this.drawBottomDepth(ctx);
                    this.drawRightDepth(ctx);
                }

                ctx.save();
                ctx.lineWidth = 1;
                //ctx.lineCap = "round";
                //ctx.lineJoin = "round";
                this.drawTop(ctx);
                ctx.restore();


                ctx.restore();

                GridHexagon.setCacheImage(this.getDepthHeight(), this.getDrawingColor(), this.texture.name, can);
                /*       ctx.strokeStyle='black';
                 ctx.lineWidth=1;
                 ctx.strokeRect(0,0,can.width,can.height);*/
                this.drawCache = can;

            } else {
                this.drawCache = c;
            }
            this.draw(context, offsetX, offsetY);
        }
    }

    getNeighbors(): {x: number, z: number}[] {
        const neighbors = [];
        if ((this.x % 2 === 0)) {
            neighbors.push({x: this.x - 1, z: this.z});
            neighbors.push({x: this.x, z: this.z - 1});
            neighbors.push({x: this.x + 1, z: this.z});

            neighbors.push({x: this.x - 1, z: this.z + 1});
            neighbors.push({x: this.x, z: this.z + 1});
            neighbors.push({x: this.x + 1, z: this.z + 1});
        } else {
            neighbors.push({x: this.x - 1, z: this.z - 1});
            neighbors.push({x: this.x, z: this.z - 1});
            neighbors.push({x: this.x + 1, z: this.z - 1});

            neighbors.push({x: this.x - 1, z: this.z});
            neighbors.push({x: this.x, z: this.z + 1});
            neighbors.push({x: this.x + 1, z: this.z});
        }
        return neighbors;
    }


    static caches: {[key: string]: HTMLCanvasElement} = {};

    static getCacheImage(height: number, hexColor: HexagonColor, texture: string): HTMLCanvasElement {
        const c = `${height}-${hexColor.color}-${texture}`;
        return GridHexagon.caches[c]
    }

    static setCacheImage(height: number, hexColor: HexagonColor, texture: string, img: HTMLCanvasElement) {
        const c = `${height}-${hexColor.color}-${texture}`;
        GridHexagon.caches[c] = img;
    }

    static buildPath(path): Path2D {
        const p2d = new Path2D();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            p2d.lineTo(point.x, point.y);
        }
        return p2d;
    }

}



