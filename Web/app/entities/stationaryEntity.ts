import {HexBoard} from "../game/hexBoard";
import {GridHexagonConstants} from "../game/gridHexagonConstants";
import {AssetManager} from "../game/assetManager";
import {AnimationFrame} from "../animationManager";
import {GameMetricVoteAction} from "../models/hexBoard";
import {BaseEntity} from "./baseEntity";
export abstract class StationaryEntity  extends BaseEntity {
    getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] {
        return [];
    }

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.z);

        let assetName = this.entityType;
        let asset = AssetManager.getAsset(assetName);
        let image = asset.image || asset.images[this.animationFrame];

        let ratio = (GridHexagonConstants.width / asset.size.width);

        let shrink = .75;
        let width = GridHexagonConstants.width * shrink;
        let height = asset.size.height * ratio * shrink;


        context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
        context.restore();
    }

    executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number) {
    }
}
