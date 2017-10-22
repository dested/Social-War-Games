"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetManager = (function () {
    function AssetManager() {
    }
    AssetManager.getAsset = function (key) {
        return this.assets[key];
    };
    AssetManager.start = function () {
        var _this = this;
        var _loop_1 = function (name_1) {
            if (this_1.assetQueue.hasOwnProperty(name_1)) {
                var img_1 = new Image();
                img_1.onload = function () {
                    _this.imageLoaded(img_1, name_1);
                };
                img_1.src = this_1.assetQueue[name_1].url;
            }
        };
        var this_1 = this;
        for (var name_1 in this.assetQueue) {
            _loop_1(name_1);
        }
    };
    AssetManager.addAsset = function (name, url, size, base) {
        this.assetQueue[name] = { base: base, size: size, url: url, realName: name };
        this.$assetsRequested++;
    };
    AssetManager.addAssetFrame = function (name, frameIndex, url, size, base) {
        this.assetQueue[name + frameIndex] = { base: base, size: size, url: url, frameIndex: frameIndex, realName: name };
        this.$assetsRequested++;
    };
    AssetManager.imageLoaded = function (img, name) {
        var _this = this;
        var assetQueue = this.assetQueue[name];
        var asset = this.assets[assetQueue.realName] || {
            size: null,
            base: null,
            name: name,
            animated: assetQueue.frameIndex !== undefined
        };
        asset.size = assetQueue.size || { width: img.width, height: img.height };
        asset.base = assetQueue.base || {
            x: asset.size.width / 2,
            y: asset.size.height / 2
        };
        if (asset.animated) {
            asset.images = asset.images || [];
            asset.images[assetQueue.frameIndex] = img;
        }
        else {
            asset.image = img;
        }
        this.assets[assetQueue.realName] = asset;
        this.$assetsLoaded++;
        if (this.$assetsLoaded === this.$assetsRequested) {
            setTimeout(function () {
                _this.completed();
            }, 100);
        }
    };
    AssetManager.assetQueue = {};
    AssetManager.assets = {};
    AssetManager.completed = null;
    AssetManager.$assetsLoaded = 0;
    AssetManager.$assetsRequested = 0;
    return AssetManager;
}());
exports.AssetManager = AssetManager;
