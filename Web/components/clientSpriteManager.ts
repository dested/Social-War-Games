import {SpriteManager, Sprite} from "./spriteManager";
import {AssetManager} from "./hexLibraries/assetManager";
import {ClientHexBoard} from "./hexLibraries/clientHexBoard";
import {GridHexagonConstants} from "./hexLibraries/gridHexagonConstants";
export class ClientSpriteManager extends SpriteManager {

    constructor(private clientHexBoard: ClientHexBoard) {
        super();
    }

    addSprite(sprite: ClientBaseSprite) {
        super.addSprite(sprite);
        sprite.clientHexBoard = this.clientHexBoard;
    }

    draw(context: CanvasRenderingContext2D) {
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = <ClientBaseSprite> this.sprites[i];
            if (sprite.tile == null && sprite.shouldDraw()) {
                sprite.draw(context);
            }
        }
    }

    tick() {
        super.tick();
    }

}

export abstract class ClientBaseSprite extends Sprite {
    totalFrames: number;
    animationSpeed: number;

    animationFrame: number = 0;
    _drawTickNumber: number = (Math.random()*1000)|0;

    constructor(clientSpriteManager:ClientSpriteManager,totalFrames: number, animationSpeed: number) {
        super(clientSpriteManager);
        this.animationSpeed = animationSpeed;
        this.totalFrames = totalFrames;
    }

    clientHexBoard: ClientHexBoard;

    draw(context: CanvasRenderingContext2D) {

        this._drawTickNumber++;

        if (this._drawTickNumber % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
        }

    }

    shouldDraw(): boolean {
        const x = this.x;
        const y = this.y;
        var viewPort = this.clientHexBoard.viewPort;

        return x > viewPort.x - viewPort.padding &&
            x < viewPort.x + viewPort.width + viewPort.padding &&
            y > viewPort.y - viewPort.padding &&
            y < viewPort.y + viewPort.height + viewPort.padding;

    }
}
export class ClientSixDirectionSprite extends ClientBaseSprite {

    currentDirection: number = (Math.random() * 6) | 0;

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.y);

        var assetName = this.key + '.' + this.currentDirectionToSpriteName();
        var asset = AssetManager.assets[assetName];
        var image = asset.images[this.animationFrame];
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

export class ClientHeliSprite extends ClientSixDirectionSprite {
    constructor(clientSpriteManager:ClientSpriteManager) {
        super(clientSpriteManager,2, 10)
    }
}