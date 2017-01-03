///<reference path="../typings/path2d.d.ts"/>

import {Asset} from "./AssetManager";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {GridHexagonConstants} from "./gridHexagonConstants";
import {BaseEntity} from "../entities/entityManager";
import {ViewPort} from "../gameManager";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";

export class GridHexagon {

    private topPath: Path2D = null;
    private leftDepthPath: Path2D = null;
    private bottomDepthPath: Path2D = null;
    private rightDepthPath: Path2D = null;

    public x = 0;
    public y = 0;
    public z = 0;
    public height = 0;
    public heightOffset = 0;
    private faction: number = 0;
    private baseColor: HexagonColor[];
    private highlightColor: HexagonColor;
    private voteColor: HexagonColor;
    private secondaryVoteColor: HexagonColor;
    private texture: Asset;
    private entities: BaseEntity[] = [];
    private drawCache: HTMLCanvasElement;


    getRealX(): number {
        return (GridHexagonConstants.width * 3 / 4 * this.x);
    }

    getRealZ(): number {
        let height = GridHexagonConstants.height();
        return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
            - this.getDepthHeight()
            + this.y * GridHexagonConstants.depthHeight();
    }

    getDepthHeight(): number {
        return Math.max(1, (this.height + this.heightOffset) * GridHexagonConstants.depthHeight());
    }

    getEntities() {
        return this.entities;
    }

    getEntityById(id: string) {
        return this.entities.filter(a => a.id == id)[0];
    }

    addEntity(entity: BaseEntity) {
        this.entities.push(entity);
        this.invalidateColor();
    }

    removeEntity(entity: BaseEntity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        this.invalidateColor();
    }

    setBaseColor(baseColor: HexagonColor[]): void {
        this.baseColor = baseColor;
        this.invalidateColor();
    }

    setFaction(faction: number): void {
        this.faction = faction;
        this.invalidateColor();
    }

    setHighlightColor(highlightColor: HexagonColor): void {
        this.highlightColor = highlightColor;
        this.invalidateColor();
    }


    setVoteColor(voteColor: HexagonColor): void {
        this.voteColor = voteColor;
        this.invalidateColor();
    }

    clearVoteColor(): void {
        this.voteColor = null;
        this.invalidateColor();
    }

    setSecondaryVoteColor(voteColor: HexagonColor): void {
        this.secondaryVoteColor = voteColor;
        this.invalidateColor();
    }

    clearSecondaryVoteColor(): void {
        this.secondaryVoteColor = null;
        this.invalidateColor();
    }

    clearHighlightColor(): void {
        this.highlightColor = null;
        this.invalidateColor();
    }

    setTexture(texture: Asset): void {
        this.texture = texture;
        this.invalidateColor();
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


    private invalidateColor() {
        let entityColor = (this.entities.length > 0 && HexagonColorUtils.entityHexColor);
        let voteColor = this.voteColor;
        let secondaryVoteColor = this.secondaryVoteColor;
        let highlightColor = this.highlightColor;
        let factionColor = (this.faction > 0 && HexagonColorUtils.factionHexColors[this.faction - 1][this.height]);
        let baseColor = (this.baseColor && this.baseColor[this.height]);
        this.currentDrawColor = voteColor || secondaryVoteColor || entityColor || highlightColor || factionColor || baseColor;
        if (this.currentDrawColor && this.texture)
            this.drawCache = GridHexagon.getCacheImage(this.getDepthHeight(), this.currentDrawColor, this.texture.name)
    }

    private currentDrawColor: HexagonColor;

    drawLeftDepth(context: CanvasRenderingContext2D): void {
        context.save();
        context.save();
        {
            context.clip(this.leftDepthPath);

            context.fillStyle = context.createPattern(this.texture.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColor.dark1, 0.75);
            context.fill(this.leftDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = this.currentDrawColor.dark1;
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

            context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColor.dark2, 0.75);
            context.fill(this.bottomDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = this.currentDrawColor.dark2;
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

            context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColor.dark3, 0.75);
            context.fill(this.rightDepthPath);
        }
        context.restore();

        context.lineWidth = 1;

        context.strokeStyle = this.currentDrawColor.dark3;
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

                context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColor.color, 0.6);
                context.fill(this.topPath);
            }
            context.restore();
            context.lineWidth = 1;

            context.strokeStyle = this.currentDrawColor.darkBorder;
            context.stroke(this.topPath);
        }
        context.restore();
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

    static hexCenter = {x: (GridHexagonConstants.width / 2 + 6), y: (GridHexagonConstants.height() / 2 + 6)};

    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        const center = GridHexagon.hexCenter;
        const c = this.drawCache;
        if (c) {
            context.drawImage(c, offsetX - center.x, offsetY - center.y);
        } else {
            context.drawImage(this.prepDraw(center), offsetX - center.x, offsetY - center.y);
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


    private prepDraw(center) {
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

        GridHexagon.setCacheImage(this.getDepthHeight(), this.currentDrawColor, this.texture.name, can);
        this.drawCache = can;
        /*       ctx.strokeStyle='black';
         ctx.lineWidth=1;
         ctx.strokeRect(0,0,can.width,can.height);*/
        return can;
    }

    shouldDraw(viewPort: ViewPort): boolean {

        const x = this.getRealX();
        const y = this.getRealZ();


        let x2 = viewPort.x;
        let padding = viewPort.padding;
        let y2 = viewPort.y;
        let width = viewPort.width;

        return x > x2 - padding &&
            x < x2 + width + padding &&
            y > y2 - padding &&
            y < y2 + viewPort.height + padding;


    }

}



