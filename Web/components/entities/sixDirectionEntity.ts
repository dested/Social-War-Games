import {Direction, HexUtils} from "../game/hexUtils";
import {BaseEntity} from "./baseEntity";
import {AssetManager} from "../game/assetManager";
import {GridHexagonConstants} from "../game/gridHexagonConstants";
import {GameMetricAttackVoteAction, GameMetricMoveVoteAction, GameMetricVoteAction} from "../models/hexBoard";
import {HexBoard} from "../game/hexBoard";
import {AnimationFrame, AnimationFrameType, AnimationType} from "../animationManager";
export abstract class SixDirectionEntity extends BaseEntity {


    currentDirection: Direction = Direction.Bottom;

    setDirection(direction: "Top" | "Bottom" | "TopLeft" | "BottomLeft" | "TopRight" | "BottomRight") {
        switch (direction) {
            case "Bottom":
                this.currentDirection = Direction.Bottom;
                break;
            case "Top":
                this.currentDirection = Direction.Top;
                break;
            case "BottomLeft":
                this.currentDirection = Direction.BottomLeft;
                break;
            case "BottomRight":
                this.currentDirection = Direction.BottomRight;
                break;
            case "TopLeft":
                this.currentDirection = Direction.TopLeft;
                break;
            case "TopRight":
                this.currentDirection = Direction.TopRight;
                break;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);

        {
            context.save();
            context.translate(this.x, this.z);

            let asset = AssetManager.getAsset(this.entityType);
            let image = asset.images[this.animationFrame];


            let ratio = (GridHexagonConstants.width / asset.size.width) / 2;


            let width = GridHexagonConstants.width / 2;
            let height = asset.size.height * ratio;
            context.rotate(this.directionToRadians(this.currentDirection));
            context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
            context.restore();
        }


        if(this.missileAsset){
            context.save();
            context.translate(this.missileX, this.missileZ);

            let asset = AssetManager.getAsset(this.missileAsset);
            let image = asset.images[this.missileAnimationFrame];

            let ratio = (GridHexagonConstants.width / asset.size.width) / 2;

            let width = GridHexagonConstants.width / 2;
            let height = asset.size.height * ratio;
            context.rotate(this.directionToRadians(this.missileDirection));
            context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
            context.restore();
        }

    }


    getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] {
        let frames: AnimationFrame[] = [];
        switch (action.actionType) {
            case "Move": {
                let moveAction = <GameMetricMoveVoteAction>action;
                let tile = this.getTile();
                let path = hexBoard.pathFind(
                    hexBoard.getHexAtSpot(tile.x, tile.z),
                    hexBoard.getHexAtSpot(moveAction.x, moveAction.z)
                );
                frames.push({
                    type: AnimationType.Move,
                    frameType: AnimationFrameType.Start,
                    startX: path[0].x,
                    startZ: path[0].z,
                    entity: this
                });

                for (let i = 1; i < path.length; i++) {
                    let p = path[i];
                    let oldP = path[i - 1];

                    frames.push({
                        type: AnimationType.Move,
                        frameType: AnimationFrameType.Tick,
                        startX: oldP.x,
                        startZ: oldP.z,
                        endX: p.x,
                        endZ: p.z,
                        entity: this
                    });
                }
                frames.push({
                    type: AnimationType.Move,
                    frameType: AnimationFrameType.Stop,
                    startX: path[path.length - 1].x,
                    startZ: path[path.length - 1].z,
                    entity: this
                });
                break;
            }
            case "Attack": {
                let attackAction = <GameMetricAttackVoteAction>action;
                let tile = this.getTile();
                frames.push({
                    type: AnimationType.Attack,
                    frameType: AnimationFrameType.Start,
                    startX: attackAction.x,
                    startZ: attackAction.z,
                    entity: this
                });
                frames.push({
                    frameType: AnimationFrameType.Tick,
                    type: AnimationType.Attack,
                    startX: tile.x,
                    startZ: tile.z,
                    endX: attackAction.x,
                    endZ: attackAction.z,
                    entity: this
                });
                frames.push({
                    type: AnimationType.Attack,
                    frameType: AnimationFrameType.Stop,
                    startX: attackAction.x,
                    startZ: attackAction.z,
                    entity: this
                });
                break;
            }


        }

        return frames;
    }

    executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number) {
        switch (frame.type) {
            case AnimationType.Move: {
                switch (frame.frameType) {
                    case AnimationFrameType.Tick: {
                        let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                        let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                        this.currentDirection = HexUtils.getDirection(fromHex, toHex);
                        this._move_animateFromHex = fromHex;
                        this._move_animateToHex = toHex;
                        this._move_durationTicks = Math.floor(duration / 16);
                        this._move_currentTick = 0;
                        break;
                    }
                }


                break;
            }
            case AnimationType.Attack : {
                switch (frame.frameType) {
                    case AnimationFrameType.Tick: {
                        let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                        let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                        this.missileDirection = HexUtils.getDirection(fromHex, toHex);
                        this._attack_animateFromHex = fromHex;
                        this._attack_animateToHex = toHex;
                        this._attack_durationTicks = Math.floor(duration / 16);
                        this._attack_currentTick = 0;
                        break;
                    }
                }
                break;
            }
        }
    }

    private directionToRadians(direction:Direction): number {
        let degrees = 0;
        switch (direction) {
            case Direction.TopLeft:
                degrees = -45;
                break;
            case Direction.Top:
                degrees = 0;
                break;
            case Direction.TopRight:
                degrees = 45;
                break;
            case Direction.BottomRight:
                degrees = 45 + 90;
                break;
            case Direction.Bottom:
                degrees = 180;
                break;
            case Direction.BottomLeft:
                degrees = -45 - 90;
                break;
        }
        return degrees * 0.0174533;
    }
}
