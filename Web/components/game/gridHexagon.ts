///<reference path="../typings/path2d.d.ts"/>

import {Asset} from "./assetManager";
import {HexagonColor, DrawingUtils} from "../utils/drawingUtilities";
import {GridHexagonConstants, GridMiniHexagonConstants} from "./gridHexagonConstants";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
import {IPoint, Point} from "../utils/utils";
import {GameService} from "../ui/gameService";
import {ViewPort} from "./viewPort";
import {BaseEntity} from "../entities/baseEntity";

export class GridHexagon {

    private topPath: Path2D = null;
    private topPathInner: Path2D = null;
    private leftDepthPath: Path2D = null;
    private bottomDepthPath: Path2D = null;
    private rightDepthPath: Path2D = null;

    private topMiniPath: Path2D = null;


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
    private textureTop: Asset;
    private textureLeft: Asset;
    private textureRight: Asset;
    private textureBottom: Asset;
    private entities: BaseEntity[] = [];
    private currentDrawColorNoVote: HexagonColor;
    private currentDrawColor: HexagonColor;
    private currentFactionColor: HexagonColor;
    private currentMiniColor: HexagonColor;


    private drawCache: HTMLCanvasElement;
    private drawCacheNoVote: HTMLCanvasElement;
    private drawMiniCache: HTMLCanvasElement;

    private showVotes: boolean = true;


    private _realX: number = undefined;
    private _realZ: number = undefined;

    getRealX(): number {
        if (this._realX !== undefined) {
            return this._realX;
        }
        return this._realX = (GridHexagonConstants.width * 3 / 4 * this.x);
    }

    getRealZ(): number {
        if (this._realZ !== undefined) {
            return this._realZ;
        }
        let height = GridHexagonConstants.height();
        return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
            - this.getDepthHeight(true)
            + this.y * GridHexagonConstants.depthHeight();
    }


    getScreenX(): number {
        return this.getRealX() - GameService.getGameManager().viewPort.getX();
    }

    getScreenZ(): number {
        return this.getRealZ() - GameService.getGameManager().viewPort.getY();
    }


    getRealMiniX(): number {
        return (GridMiniHexagonConstants.width * 3 / 4 * this.x);
    }

    getRealMiniZ(): number {
        let height = GridMiniHexagonConstants.height();
        return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0)) + this.y * 0;
    }

    getDepthHeight(position: boolean): number {
        if (position)
            return Math.max(1, (this.height + this.heightOffset) * (GridHexagonConstants.depthHeight() - 2));
        return GridHexagonConstants.depthHeight();
    }

    getEntities() {
        return this.entities;
    }

    hasEntities() {
        return this.entities && this.entities.length > 0;
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
        if (this.baseColor !== baseColor) {
            this.baseColor = baseColor;
            this.invalidateColor();
        }
    }

    setFaction(faction: number): void {
        if (this.faction !== faction) {
            this.faction = faction;
            this.invalidateColor();
        }
    }

    setHighlightColor(highlightColor: HexagonColor): void {
        if (this.highlightColor !== highlightColor) {
            this.highlightColor = highlightColor;
            this.invalidateColor();
        }
    }


    setVoteColor(voteColor: HexagonColor): void {
        if (this.voteColor !== voteColor) {
            this.voteColor = voteColor;
            this.invalidateColor();
        }
    }

    clearVoteColor(): void {
        if (this.voteColor !== null) {
            this.voteColor = null;
            this.invalidateColor();
        }
    }

    setSecondaryVoteColor(voteColor: HexagonColor): void {
        if (this.secondaryVoteColor !== voteColor) {
            this.secondaryVoteColor = voteColor;
            this.invalidateColor();
        }
    }

    clearSecondaryVoteColor(): void {
        if (this.secondaryVoteColor !== null) {
            this.secondaryVoteColor = null;
            this.invalidateColor();
        }
    }

    clearHighlightColor(): void {
        if (this.highlightColor !== null) {
            this.highlightColor = null;
            this.invalidateColor();
        }
    }

    setTexture(textureTop: Asset, textureLeft: Asset, textureBottom: Asset, textureRight: Asset): void {
        this.textureTop = textureTop;
        this.textureLeft = textureLeft;
        this.textureBottom = textureBottom;
        this.textureRight = textureRight;
        this.invalidateColor();
    }


    setHeightOffset(heightOffset: number): void {
        if (this.heightOffset != heightOffset) {
            this.heightOffset = heightOffset;
            this.buildPaths();
            this.buildMiniPaths();
        }
    }

    public buildPaths(): void {
        this._realX = undefined;
        this._realZ = undefined;

        const depthHeight = this.getDepthHeight(false);
        this.topPath = GridHexagon.buildPath(GridHexagonConstants.hexagonTopPolygon());
        // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
        this.leftDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
        this.bottomDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
        this.rightDepthPath = GridHexagon.buildPath(GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
    }

    public buildMiniPaths(): void {
        this.topMiniPath = GridHexagon.buildPath(GridMiniHexagonConstants.hexagonTopPolygon());
        // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
    }


    private invalidateColor() {
        let entityColor = (this.entities.length > 0 && HexagonColorUtils.entityHexColor);
        let voteColor = this.voteColor;
        let secondaryVoteColor = this.secondaryVoteColor;
        let highlightColor = this.highlightColor;
        let factionColor = (this.faction > 0 && HexagonColorUtils.factionHexColors[this.faction - 1][this.height]);
        let baseColor = (this.baseColor && this.baseColor[this.height]);
        this.currentDrawColorNoVote = factionColor || baseColor;
        this.currentDrawColor = voteColor || secondaryVoteColor || highlightColor || entityColor || factionColor || baseColor;
        this.currentFactionColor = factionColor || baseColor;

        this.currentMiniColor = voteColor || entityColor || factionColor || baseColor;

        if (this.currentDrawColor && this.textureTop) {
            this.drawCache = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
            this.drawCacheNoVote = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColorNoVote, this.textureTop.name);
            this.drawMiniCache = GridHexagon.getMiniCacheImage(this.currentMiniColor)
        }
    }


    drawLeftDepth(context: CanvasRenderingContext2D, color: HexagonColor): void {
        context.save();
        context.save();
        {
            context.clip(this.leftDepthPath);

            context.fillStyle = context.createPattern(this.textureLeft.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(color.dark1, .75);
            context.fill(this.leftDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = color.dark1;
        context.stroke(this.leftDepthPath);
        context.restore();
    }


    drawBottomDepth(context: CanvasRenderingContext2D, color: HexagonColor): void {
        context.save();
        context.save();
        {
            context.clip(this.bottomDepthPath);

            context.fillStyle = context.createPattern(this.textureBottom.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
            context.fillStyle = DrawingUtils.makeTransparent(color.dark2, .75);
            context.fill(this.bottomDepthPath);
        }
        context.restore();
        context.lineWidth = 1;


        context.strokeStyle = color.dark2;
        context.stroke(this.bottomDepthPath);
        context.restore();
    }

    drawRightDepth(context: CanvasRenderingContext2D, color: HexagonColor): void {
        context.save();
        context.save();
        {
            context.clip(this.rightDepthPath);

            context.fillStyle = context.createPattern(this.textureRight.image, 'repeat');
            context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width * 2, GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);

            context.fillStyle = DrawingUtils.makeTransparent(color.dark3, .75);
            context.fill(this.rightDepthPath);
        }
        context.restore();

        context.lineWidth = 1;

        context.strokeStyle = color.dark3;
        context.stroke(this.rightDepthPath);
        context.restore();
    }

    drawTop(context: CanvasRenderingContext2D, color: HexagonColor): void {

        context.save();

        {
            context.save();
            {
                context.clip(this.topPath);

                context.fillStyle = context.createPattern(this.textureTop.image, 'repeat');
                context.fillRect(-GridHexagonConstants.width / 2, -GridHexagonConstants.height() / 2, GridHexagonConstants.width, GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                context.fillStyle = DrawingUtils.makeTransparent(color.color, 0.6);
                context.fill(this.topPath);

                /*  if (this.currentDrawColorVote !== this.currentDrawColor) {
                 context.save();
                 context.scale(0.4, 0.4);
                 context.clip(this.topPath);
                 context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColorVote.color, 0.6);
                 context.fill(this.topPath);
                 context.restore();
                 }*/
            }
            context.restore();
            context.strokeStyle = color.darkBorder;
            context.stroke(this.topPath);
        }
        context.restore();
    }

    drawTopMini(context: CanvasRenderingContext2D): void {
        let color = this.currentMiniColor.color;
        context.fillStyle = color;
        context.fill(this.topMiniPath);
        /*        context.lineWidth = 3;
         context.strokeStyle = color;
         context.stroke(this.topMiniPath);*/
    }

    private envelope(): { width: number, height: number } {
        const size = {width: 0, height: 0};
        size.width = GridHexagonConstants.width;
        size.height = GridHexagonConstants.height();

        size.height += this.getDepthHeight(false);


        size.width += 12;
        size.height += 6;

        return size;
    }

    private envelopeMini(): { width: number, height: number } {
        const size = {width: 0, height: 0};
        size.width = GridMiniHexagonConstants.width;
        size.height = GridMiniHexagonConstants.height();

        size.width += 20;
        size.height += 20;

        return size;
    }

    static hexCenter: IPoint;
    static hexCenterMini: IPoint;

    static generateHexCenters() {
        this.hexCenter = {x: (GridHexagonConstants.width / 2 + 6), y: (GridHexagonConstants.height() / 2 + 6)};
        this.hexCenterMini = {
            x: (GridMiniHexagonConstants.width / 2 + 6),
            y: (GridMiniHexagonConstants.height() / 2 + 6)
        };
    }

    draw(context: CanvasRenderingContext2D, offsetX: number, offsetY: number): void {
        if (this.showVotes) {
            if (this.drawCache) {
                context.drawImage(this.drawCache, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);

/*
                context.fillStyle = 'black';
                context.font = '11px bold san-serif';
                context.fillText(this.x + "," + this.z, offsetX - 10, offsetY + 5)
*/

            } else {
                let cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                if (cacheImage) {
                    this.drawCache = cacheImage
                } else {
                    this.drawCache = this.prepDraw(this.currentDrawColor);
                }
                this.draw(context, offsetX, offsetY);
            }
        } else {

            if (this.drawCacheNoVote) {
                context.drawImage(this.drawCacheNoVote, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
            } else {
                let cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                if (cacheImage) {
                    this.drawCacheNoVote = cacheImage
                } else {
                    this.drawCacheNoVote = this.prepDraw(this.currentDrawColorNoVote);
                }
                this.draw(context, offsetX, offsetY);
            }
        }
    }

    drawMini(context: CanvasRenderingContext2D, offsetX: number, offsetY: number) {

        if (this.drawMiniCache) {
            context.drawImage(this.drawMiniCache, offsetX - GridHexagon.hexCenterMini.x, offsetY - GridHexagon.hexCenterMini.y);
        } else {
            let miniCacheImage = GridHexagon.getMiniCacheImage(this.currentMiniColor);
            if (miniCacheImage) {
                this.drawMiniCache = miniCacheImage
            } else {
                this.prepMiniDraw();
            }
            this.drawMini(context, offsetX, offsetY);
        }
    }

    getNeighbors(): { x: number; z: number }[] {
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


    static caches: { [key: string]: HTMLCanvasElement } = {};

    static getCacheImage(height: number, hexColor: HexagonColor, texture: string): HTMLCanvasElement {
        const c = `${height}-${hexColor.color}-${texture}`;
        return GridHexagon.caches[c]
    }

    static setCacheImage(height: number, hexColor: HexagonColor, texture: string, img: HTMLCanvasElement) {
        const c = `${height}-${hexColor.color}-${texture}`;
        GridHexagon.caches[c] = img;
    }


    static getMiniCacheImage(hexColor: HexagonColor): HTMLCanvasElement {
        const c = `m${hexColor.color}`;
        return GridHexagon.caches[c]
    }

    static setMiniCacheImage(hexColor: HexagonColor, img: HTMLCanvasElement) {
        const c = `m${hexColor.color}`;
        GridHexagon.caches[c] = img;
    }

    static buildPath(path:Point[]): Path2D {
        const p2d = new Path2D();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            p2d.lineTo(point.x, point.y);
        }
        return p2d;
    }


    private prepDraw(color: HexagonColor) {

        const can = document.createElement('canvas');
        const ctx = can.getContext('2d');

        const size = this.envelope();
        can.width = size.width;
        can.height = size.height;
        ctx.save();


        ctx.translate(GridHexagon.hexCenter.x, GridHexagon.hexCenter.y);
        if (this.getDepthHeight(false) > 1) {
            this.drawLeftDepth(ctx, color);
            this.drawBottomDepth(ctx, color);
            this.drawRightDepth(ctx, color);
        }

        ctx.save();
        ctx.lineWidth = 1;
        //ctx.lineCap = "round";
        //ctx.lineJoin = "round";
        this.drawTop(ctx, color);
        ctx.restore();


        ctx.restore();

        GridHexagon.setCacheImage(this.getDepthHeight(false), color, this.textureTop.name, can);
        return can;
    }


    private prepMiniDraw() {
        const can = document.createElement('canvas');
        const ctx = can.getContext('2d');

        const size = this.envelopeMini();
        can.width = size.width;
        can.height = size.height;
        ctx.save();


        ctx.translate(GridHexagon.hexCenterMini.x, GridHexagon.hexCenterMini.y);
        this.drawTopMini(ctx);


        ctx.restore();

        GridHexagon.setMiniCacheImage(this.currentMiniColor, can);
        this.drawMiniCache = can;
        /*       ctx.strokeStyle='black';
         ctx.lineWidth=1;
         ctx.strokeRect(0,0,can.width,can.height);*/
        return can;
    }


    shouldDraw(viewPort: ViewPort): boolean {

        const x = this.getRealX();
        const y = this.getRealZ();

        return viewPort.shouldDraw(x, y);
    }


    setShowVotes(showVotes: boolean) {
        this.showVotes = showVotes;
    }
}