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
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.Create = function (pos) {
        return new Point(pos.x, pos.y);
    };
    Point.prototype.offset = function (windowLocation) {
        return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
    };
    Point.prototype.negatePoint = function (windowLocation) {
        return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
    };
    Point.prototype.negate = function (x, y) {
        return new Point(this.x - (x | 0), this.y - (y | 0));
    };
    Point.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return Point;
}());
exports.Point = Point;
var DoublePoint = (function () {
    function DoublePoint(x, y) {
        this.x = x;
        this.y = y;
    }
    DoublePoint.create = function (pos) {
        return new DoublePoint(pos.x, pos.y);
    };
    DoublePoint.prototype.offset = function (windowLocation) {
        return new DoublePoint(this.x + windowLocation.x, this.y + windowLocation.y);
    };
    DoublePoint.prototype.negatePoint = function (windowLocation) {
        return new DoublePoint(this.x - windowLocation.x, this.y - windowLocation.y);
    };
    DoublePoint.prototype.negate = function (x, y) {
        return new DoublePoint(this.x - (x | 0), this.y - (y | 0));
    };
    DoublePoint.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return DoublePoint;
}());
exports.DoublePoint = DoublePoint;
var IntersectingRectangle = (function (_super) {
    __extends(IntersectingRectangle, _super);
    function IntersectingRectangle(x, y, width, height) {
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    IntersectingRectangle.prototype.intersects = function (p) {
        return this.x < p.x && this.x + this.width > p.x && this.y < p.y && this.y + this.height > p.y;
    };
    IntersectingRectangle.intersectsRect = function (r, p) {
        return r.x < p.x && r.x + r.width > p.x && r.y < p.y && r.y + r.height > p.y;
    };
    IntersectingRectangle.intersectRect = function (r1, r2) {
        return !(r2.x > r1.x + r1.width || r2.x + 0 < r1.x || r2.y > r1.y + r1.height || r2.y + 0 < r1.y);
    };
    return IntersectingRectangle;
}(Point));
exports.IntersectingRectangle = IntersectingRectangle;
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this, x, y) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    return Rectangle;
}(Point));
exports.Rectangle = Rectangle;
