import {GridHexagon} from "./gridHexagon";
import {ClientGridHexagon} from "./hexLibraries/clientGridHexagon";
import {HexagonColor} from "./utils/drawingUtilities";

export class SpriteManager {

    sprites: Sprite[] = [];
    spritesMap: { [tileKey: number]: Sprite[] } = {};

    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
    }

    tick() {
        for (var i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            sprite.tick();
        }
    }

    getSpritesAtTile(item: GridHexagon): Sprite[] {
        return this.spritesMap[item.x + item.z * 5000] || [];
    }

}

export class Sprite {
    public x: number;
    public y: number;
    tile: GridHexagon;
    public key: string;
    public spriteManager: SpriteManager;
    id: string;

    constructor(spriteManager: SpriteManager) {
        this.spriteManager = spriteManager;
    }

    setId(id: string) {
        this.id = id;
    }

    public tick() {

    }

    setTile(tile: GridHexagon) {
        if (this.tile) {
            (<ClientGridHexagon>this.tile).setColor((<ClientGridHexagon>this.tile).originalColor, false);

            var sprites = this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000];
            sprites = sprites || [];
            sprites.splice(sprites.indexOf(this), 1);
            this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000] = sprites;
        }


        this.tile = tile;

        if (tile) {
            (<ClientGridHexagon>this.tile).setColor(new HexagonColor("#f0c2bc"), false);
            this.x = this.tile.getRealX();
            this.y = this.tile.getRealY();
            var sprites = this.spriteManager.spritesMap[tile.x + tile.z * 5000];
            sprites = sprites || [];
            sprites.push(this);
            this.spriteManager.spritesMap[tile.x + tile.z * 5000] = sprites;
        }
    }
}