"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var hexUtils_1 = require("../game/hexUtils");
var baseEntity_1 = require("./baseEntity");
var assetManager_1 = require("../game/assetManager");
var gridHexagonConstants_1 = require("../game/gridHexagonConstants");
var animationManager_1 = require("../animationManager");
var SixDirectionEntity = (function (_super) {
    __extends(SixDirectionEntity, _super);
    function SixDirectionEntity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentDirection = hexUtils_1.Direction.Bottom;
        return _this;
    }
    SixDirectionEntity.prototype.setDirection = function (direction) {
        switch (direction) {
            case "Bottom":
                this.currentDirection = hexUtils_1.Direction.Bottom;
                break;
            case "Top":
                this.currentDirection = hexUtils_1.Direction.Top;
                break;
            case "BottomLeft":
                this.currentDirection = hexUtils_1.Direction.BottomLeft;
                break;
            case "BottomRight":
                this.currentDirection = hexUtils_1.Direction.BottomRight;
                break;
            case "TopLeft":
                this.currentDirection = hexUtils_1.Direction.TopLeft;
                break;
            case "TopRight":
                this.currentDirection = hexUtils_1.Direction.TopRight;
                break;
        }
    };
    SixDirectionEntity.prototype.draw = function (context) {
        _super.prototype.draw.call(this, context);
        {
            context.save();
            context.translate(this.x, this.z);
            var asset = assetManager_1.AssetManager.getAsset(this.entityType);
            var image = asset.images[this.animationFrame];
            var ratio = (gridHexagonConstants_1.GridHexagonConstants.width / asset.size.width) / 2;
            var width = gridHexagonConstants_1.GridHexagonConstants.width / 2;
            var height = asset.size.height * ratio;
            context.rotate(this.directionToRadians(this.currentDirection));
            context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
            context.restore();
        }
        if (this.missileAsset) {
            context.save();
            context.translate(this.missileX, this.missileZ);
            var asset = assetManager_1.AssetManager.getAsset(this.missileAsset);
            var image = asset.images[this.missileAnimationFrame];
            var ratio = (gridHexagonConstants_1.GridHexagonConstants.width / asset.size.width) / 2;
            var width = gridHexagonConstants_1.GridHexagonConstants.width / 2;
            var height = asset.size.height * ratio;
            context.rotate(this.directionToRadians(this.missileDirection));
            context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
            context.restore();
        }
    };
    SixDirectionEntity.prototype.getActionFrames = function (action, hexBoard) {
        var frames = [];
        switch (action.actionType) {
            case "Move": {
                var moveAction = action;
                var tile = this.getTile();
                var path = hexBoard.pathFind(hexBoard.getHexAtSpot(tile.x, tile.z), hexBoard.getHexAtSpot(moveAction.x, moveAction.z));
                frames.push({
                    type: animationManager_1.AnimationType.Move,
                    frameType: animationManager_1.AnimationFrameType.Start,
                    startX: path[0].x,
                    startZ: path[0].z,
                    entity: this
                });
                for (var i = 1; i < path.length; i++) {
                    var p = path[i];
                    var oldP = path[i - 1];
                    frames.push({
                        type: animationManager_1.AnimationType.Move,
                        frameType: animationManager_1.AnimationFrameType.Tick,
                        startX: oldP.x,
                        startZ: oldP.z,
                        endX: p.x,
                        endZ: p.z,
                        entity: this
                    });
                }
                frames.push({
                    type: animationManager_1.AnimationType.Move,
                    frameType: animationManager_1.AnimationFrameType.Stop,
                    startX: path[path.length - 1].x,
                    startZ: path[path.length - 1].z,
                    entity: this
                });
                break;
            }
            case "Attack": {
                var attackAction = action;
                var tile = this.getTile();
                frames.push({
                    type: animationManager_1.AnimationType.Attack,
                    frameType: animationManager_1.AnimationFrameType.Start,
                    startX: attackAction.x,
                    startZ: attackAction.z,
                    entity: this
                });
                frames.push({
                    frameType: animationManager_1.AnimationFrameType.Tick,
                    type: animationManager_1.AnimationType.Attack,
                    startX: tile.x,
                    startZ: tile.z,
                    endX: attackAction.x,
                    endZ: attackAction.z,
                    entity: this
                });
                frames.push({
                    type: animationManager_1.AnimationType.Attack,
                    frameType: animationManager_1.AnimationFrameType.Stop,
                    startX: attackAction.x,
                    startZ: attackAction.z,
                    entity: this
                });
                break;
            }
        }
        return frames;
    };
    SixDirectionEntity.prototype.executeFrame = function (hexBoard, frame, duration) {
        switch (frame.type) {
            case animationManager_1.AnimationType.Move: {
                switch (frame.frameType) {
                    case animationManager_1.AnimationFrameType.Tick: {
                        var fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                        var toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                        this.currentDirection = hexUtils_1.HexUtils.getDirection(fromHex, toHex);
                        this._move_animateFromHex = fromHex;
                        this._move_animateToHex = toHex;
                        this._move_durationTicks = Math.floor(duration / 16);
                        this._move_currentTick = 0;
                        break;
                    }
                }
                break;
            }
            case animationManager_1.AnimationType.Attack: {
                switch (frame.frameType) {
                    case animationManager_1.AnimationFrameType.Tick: {
                        var fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                        var toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                        this.missileDirection = hexUtils_1.HexUtils.getDirection(fromHex, toHex);
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
    };
    SixDirectionEntity.prototype.directionToRadians = function (direction) {
        var degrees = 0;
        switch (direction) {
            case hexUtils_1.Direction.TopLeft:
                degrees = -45;
                break;
            case hexUtils_1.Direction.Top:
                degrees = 0;
                break;
            case hexUtils_1.Direction.TopRight:
                degrees = 45;
                break;
            case hexUtils_1.Direction.BottomRight:
                degrees = 45 + 90;
                break;
            case hexUtils_1.Direction.Bottom:
                degrees = 180;
                break;
            case hexUtils_1.Direction.BottomLeft:
                degrees = -45 - 90;
                break;
        }
        return degrees * 0.0174533;
    };
    return SixDirectionEntity;
}(baseEntity_1.BaseEntity));
exports.SixDirectionEntity = SixDirectionEntity;
