import {AssetManager} from "../hexLibraries/assetManager";
import {HexBoard} from "../hexLibraries/hexBoard";
import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {HexagonColor} from "../utils/drawingUtilities";
import {GridHexagon} from "../hexLibraries/gridHexagon";
export class SpriteManager  {

    constructor(private hexBoard: HexBoard) {
    }


    sprites: BaseSprite[] = [];
    spritesMap: { [tileKey: number]: BaseSprite[] } = {};


    tick() {
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            sprite.tick();
        }
    }

    getSpritesAtTile(item: GridHexagon): BaseSprite[] {
        return this.spritesMap[item.x + item.z * 5000] || [];
    }


    addSprite(sprite: BaseSprite) {
        this.sprites.push(sprite);

        sprite.hexBoard = this.hexBoard;
    }

    draw(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = <BaseSprite> this.sprites[i];
            if (sprite.tile == null && sprite.shouldDraw()) {
                sprite.draw(context);
            }
        }
    }


}

export abstract class BaseSprite  {
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

    setId(id: string) {
        this.id = id;
    }

    public tick() {

    }

    setTile(tile: GridHexagon) {
        if (this.tile) {
            this.tile.setColor((this.tile).originalColor, false);

            var sprites = this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000];
            sprites = sprites || [];
            sprites.splice(sprites.indexOf(this), 1);
            this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000] = sprites;
        }


        this.tile = tile;

        if (tile) {
            this.tile.setColor(new HexagonColor("#f0c2bc"), false);
            this.x = this.tile.getRealX();
            this.y = this.tile.getRealY();
            var sprites = this.spriteManager.spritesMap[tile.x + tile.z * 5000];
            sprites = sprites || [];
            sprites.push(this);
            this.spriteManager.spritesMap[tile.x + tile.z * 5000] = sprites;
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
        context.scale(1.4, 1.4);
        context.drawImage(image, -asset.base.x, -asset.base.y - this.hoverY() - GridHexagonConstants.depthHeight() / 2);
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
        return (Math.sin(this._drawTickNumber / 10)) * 12 - 6;
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
        context.drawImage(image, -asset.base.x, -asset.base.y - GridHexagonConstants.depthHeight() / 2);
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