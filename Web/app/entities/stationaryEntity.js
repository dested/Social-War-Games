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
var gridHexagonConstants_1 = require("../game/gridHexagonConstants");
var assetManager_1 = require("../game/assetManager");
var baseEntity_1 = require("./baseEntity");
var StationaryEntity = (function (_super) {
    __extends(StationaryEntity, _super);
    function StationaryEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StationaryEntity.prototype.getActionFrames = function (action, hexBoard) {
        return [];
    };
    StationaryEntity.prototype.draw = function (context) {
        _super.prototype.draw.call(this, context);
        context.save();
        context.translate(this.x, this.z);
        var assetName = this.entityType;
        var asset = assetManager_1.AssetManager.getAsset(assetName);
        var image = asset.image || asset.images[this.animationFrame];
        var ratio = (gridHexagonConstants_1.GridHexagonConstants.width / asset.size.width);
        var shrink = .75;
        var width = gridHexagonConstants_1.GridHexagonConstants.width * shrink;
        var height = asset.size.height * ratio * shrink;
        context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
        context.restore();
    };
    StationaryEntity.prototype.executeFrame = function (hexBoard, frame, duration) {
    };
    return StationaryEntity;
}(baseEntity_1.BaseEntity));
exports.StationaryEntity = StationaryEntity;
