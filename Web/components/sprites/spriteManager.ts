import {AssetManager} from "../hexLibraries/assetManager";
import {HexBoard} from "../hexLibraries/hexBoard";
import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {HexagonColor} from "../utils/drawingUtilities";
import {GridHexagon} from "../hexLibraries/gridHexagon";
import {Vector3} from "../hexLibraries/hexUtils";
export class SpriteManager {

    constructor(private hexBoard: HexBoard) {
    }


    private sprites: BaseSprite[] = [];
    private spriteKeys: {[entityId: number]: BaseSprite} = {};
    private spritesMap: {[tileKey: number]: BaseSprite} = {};


    tick() {
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i];
            sprite.tick();
        }
    }

    getSpriteAtTile(item: Vector3): BaseSprite {
        return this.spritesMap[item.x + item.z * 5000];
    }


    addSprite(sprite: BaseSprite) {
        this.sprites.push(sprite);
        this.spriteKeys[sprite.id] = sprite;
        sprite.hexBoard = this.hexBoard;
    }

    draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i];
            if (sprite.tile == null && sprite.shouldDraw()) {
                sprite.draw(context);
            }
        }
    }


    empty(): void {
        this.sprites.length = 0;
        this.spritesMap = {};
        this.spriteKeys = {};
    }

    getSpriteById(id: string): BaseSprite {
        return this.spriteKeys[id];
    }

    clearSpriteAtTile(tile: GridHexagon): void {
        this.spritesMap[tile.x + tile.z * 5000] = null;
    }

    setSpriteAtTile(tile: GridHexagon, sprite: BaseSprite): void {
        this.spritesMap[tile.x + tile.z * 5000] = sprite;
    }
}

export abstract class BaseSprite {
    totalFrames: number;
    animationSpeed: number;

    animationFrame: number = 0;
    _drawTickNumber: number = (Math.random() * 1000) | 0;

    public x: number;
    public y: number;
    tile: GridHexagon;
    public key: string;
    public spriteManager: SpriteManager;
    id: string;
    private health: number;

    setId(id: string) {
        this.id = id;
    }

    public tick() {

    }

    setHealth(health: number) {
        this.health = health;
    }

    setTile(tile: GridHexagon) {
        if (this.tile) {
            this.tile.setSprite(null);
            this.spriteManager.clearSpriteAtTile(this.tile);
        }


        this.tile = tile;

        if (tile) {
            this.tile.setSprite(this);
            this.x = this.tile.getRealX();
            this.y = this.tile.getRealY();
            this.spriteManager.setSpriteAtTile(tile, this);
        }
    }


    constructor(spriteManager: SpriteManager, totalFrames: number, animationSpeed: number) {
        this.spriteManager = spriteManager;
        this.animationSpeed = animationSpeed;
        this.totalFrames = totalFrames;
    }

    hexBoard: HexBoard;

    draw(context: CanvasRenderingContext2D) {

        this._drawTickNumber++;

        if (this._drawTickNumber % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
        }

    }

    shouldDraw(): boolean {
        const x = this.x;
        const y = this.y;
        let viewPort = this.hexBoard.viewPort;

        return x > viewPort.x - viewPort.padding &&
            x < viewPort.x + viewPort.width + viewPort.padding &&
            y > viewPort.y - viewPort.padding &&
            y < viewPort.y + viewPort.height + viewPort.padding;

    }

}
export class SixDirectionSprite extends BaseSprite {

    currentDirection: number = (Math.random() * 6) | 0;

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.y);

        let assetName = this.key + '.' + this.currentDirectionToSpriteName();
        let asset = AssetManager.assets[assetName];
        let image = asset.images[this.animationFrame];


        let ratio = (GridHexagonConstants.width / asset.size.width);


        let width = GridHexagonConstants.width;
        let height = asset.size.height * ratio;

        context.drawImage(image, -asset.base.x * ratio, -asset.base.y * ratio - this.hoverY(), width, height);


        context.restore();
    }

    currentDirectionToSpriteName() {
        switch (this.currentDirection) {
            case 0:
                return "TopLeft";
            case 1:
                return "Top";
            case 2:
                return "TopRight";
            case 3:
                return "BottomRight";
            case 4:
                return "Bottom";
            case 5:
                return "BottomLeft";
            default :
                throw "Direction not found";
        }
    }

    private hoverY() {
        let offset = GridHexagonConstants.depthHeight();
        return -(Math.sin(this._drawTickNumber / 10)) * offset + offset * 1.5;
    }
}

export class StationarySprite extends BaseSprite {
    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.y);

        let assetName = this.key;
        let asset = AssetManager.assets[assetName];
        let image = asset.image || asset.images[this.animationFrame];

        let ratio = (GridHexagonConstants.width / asset.size.width);

        var shrink = .75;
        let width = GridHexagonConstants.width * shrink;
        let height = asset.size.height * ratio * shrink;


        context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
        context.restore();
    }
}

export class HeliSprite extends SixDirectionSprite {
    constructor(SpriteManager: SpriteManager) {
        super(SpriteManager, 2, 10);
        this.key = 'Heli';
    }
}
export class MainBaseSprite extends StationarySprite {
    constructor(SpriteManager: SpriteManager) {
        super(SpriteManager, 0, 0);
        this.key = 'MainBase';
    }

}