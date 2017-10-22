"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animationUtils_1 = require("../utils/animationUtils");
var gridHexagonConstants_1 = require("./gridHexagonConstants");
var debounceUtils_1 = require("../utils/debounceUtils");
var gameService_1 = require("../ui/gameService");
var ViewPort = (function () {
    function ViewPort() {
        this.x = 0;
        this.y = 0;
        this.width = 400;
        this.height = 400;
        this.padding = gridHexagonConstants_1.GridHexagonConstants.width * 2;
    }
    ViewPort.prototype.getX = function () {
        return this.x;
    };
    ViewPort.prototype.getY = function () {
        return this.y;
    };
    ViewPort.prototype.getZoomedX = function () {
        return this.x;
    };
    ViewPort.prototype.getZoomedY = function () {
        return this.y;
    };
    ViewPort.prototype.getWidth = function () {
        return this.width;
    };
    ViewPort.prototype.getHeight = function () {
        return this.height;
    };
    ViewPort.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    ViewPort.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    ViewPort.prototype.constrainViewPort = function (size) {
        var scale = this.getScale();
        this.x = Math.max(this.x, 0 - this.padding * scale.x);
        this.y = Math.max(this.y, 0 - this.padding * scale.y);
        this.x = Math.min(this.x, size.width + this.padding * scale.x - this.width);
        this.y = Math.min(this.y, size.height + this.padding * scale.y - this.height);
    };
    ViewPort.prototype.setLocalStorage = function () {
        localStorage.setItem("lastX", this.x.toString());
        localStorage.setItem("lastY", this.y.toString());
    };
    ViewPort.prototype.shouldDraw = function (x, y) {
        var x2 = this.x;
        var padding = this.padding;
        var y2 = this.y;
        var width = this.width;
        var height = this.height;
        return x > x2 - padding &&
            x < x2 + width + padding &&
            y > y2 - padding &&
            y < y2 + height + padding;
    };
    ViewPort.prototype.animateZoom = function (scale, center) {
        var _this = this;
        debounceUtils_1.DebounceUtils.debounce("animateZoom", 10, function () {
            if (_this.curAnimation) {
                _this.curAnimation.cancel = true;
            }
            if (scale === 1) {
                if (!_this.scaleFactor)
                    return;
                _this.curAnimation = animationUtils_1.AnimationUtils.start({
                    start: _this.scaleFactor.x,
                    finish: 1,
                    callback: function (c) {
                        _this.scaleFactor = { x: c, y: c };
                    },
                    duration: 600,
                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                    complete: function () {
                        _this.curAnimation = null;
                        _this.scaleFactor = null;
                    }
                });
            }
            else {
                animationUtils_1.AnimationUtils.start({
                    start: _this.x,
                    finish: center.getRealX() - _this.getWidth() / scale / 2,
                    callback: function (c) {
                        _this.x = c;
                    },
                    duration: 600,
                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                });
                animationUtils_1.AnimationUtils.start({
                    start: _this.y,
                    finish: center.getRealZ() - _this.getHeight() / scale / 2,
                    callback: function (c) {
                        _this.y = c;
                        gameService_1.GameService.getGameManager().constrainViewPort();
                    },
                    duration: 600,
                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                });
                if (!_this.scaleFactor) {
                    _this.curAnimation = animationUtils_1.AnimationUtils.start({
                        start: 1,
                        finish: scale,
                        callback: function (c) {
                            _this.scaleFactor = { x: c, y: c };
                        },
                        duration: 600,
                        easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                        complete: function () {
                            _this.curAnimation = null;
                        }
                    });
                }
            }
        });
    };
    ViewPort.prototype.offset = function (context) {
        if (this.scaleFactor) {
            context.scale(this.scaleFactor.x, this.scaleFactor.y);
        }
        context.translate(-this.getX(), -this.getY());
    };
    ViewPort.prototype.getScale = function () {
        return this.scaleFactor || ViewPort.defaultScaleFactor;
    };
    ViewPort.defaultScaleFactor = { x: 1, y: 1 };
    return ViewPort;
}());
exports.ViewPort = ViewPort;
