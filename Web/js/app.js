var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
System.register("hexLibraries/AssetManager", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AssetManager;
    return {
        setters: [],
        execute: function () {
            AssetManager = (function () {
                function AssetManager() {
                }
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
                return AssetManager;
            }());
            AssetManager.assetQueue = {};
            AssetManager.assets = {};
            AssetManager.completed = null;
            AssetManager.$assetsLoaded = 0;
            AssetManager.$assetsRequested = 0;
            exports_1("AssetManager", AssetManager);
        }
    };
});
System.register("utils", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Point, DoublePoint, IntersectingRectangle, Rectangle;
    return {
        setters: [],
        execute: function () {
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                Object.defineProperty(Point.prototype, "x", {
                    get: function () {
                        return this._x | 0;
                    },
                    set: function (val) {
                        this._x = val | 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Point.prototype, "y", {
                    get: function () {
                        return this._y | 0;
                    },
                    set: function (val) {
                        this._y = val | 0;
                    },
                    enumerable: true,
                    configurable: true
                });
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
            exports_2("Point", Point);
            DoublePoint = (function () {
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
            exports_2("DoublePoint", DoublePoint);
            IntersectingRectangle = (function (_super) {
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
            exports_2("IntersectingRectangle", IntersectingRectangle);
            Rectangle = (function (_super) {
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
            exports_2("Rectangle", Rectangle);
        }
    };
});
System.register("utils/drawingUtilities", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var HexagonColor, DrawingUtils;
    return {
        setters: [],
        execute: function () {
            HexagonColor = (function () {
                function HexagonColor(color) {
                    this.color = "";
                    this.darkBorder = "";
                    this.dark1 = "";
                    this.dark2 = "";
                    this.dark3 = "";
                    this.color = color;
                    this.darkBorder = DrawingUtils.colorLuminance(color, -0.45);
                    this.dark1 = DrawingUtils.colorLuminance(color, -0.4);
                    this.dark2 = DrawingUtils.colorLuminance(color, -0.55);
                    this.dark3 = DrawingUtils.colorLuminance(color, -0.65);
                }
                return HexagonColor;
            }());
            exports_3("HexagonColor", HexagonColor);
            DrawingUtils = (function () {
                function DrawingUtils() {
                }
                DrawingUtils.drawCircle = function (context) {
                    context.beginPath();
                    context.arc(0, 0, 5, 0, 2 * Math.PI, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.lineWidth = 5;
                    context.stroke();
                };
                ;
                DrawingUtils.colorLuminance = function (hex, lum) {
                    // validate hex string
                    hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
                    // convert to decimal and change luminosity
                    var rgb = '#';
                    for (var i = 0; i < 3; i++) {
                        var c = parseInt(hex.substr(i * 2, 2), 16);
                        var cs = (Math.round(Math.min(Math.max(0, c + c * lum), 255)) | 0).toString(16);
                        rgb += ("00" + cs).substr(cs.length);
                    }
                    return rgb;
                };
                ;
                DrawingUtils.makeTransparent = function (hex, opacitiy) {
                    // validate hex string
                    hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
                    // convert to decimal and change luminosity
                    var rgb = 'rgba(';
                    for (var i = 0; i < 3; i++) {
                        var c = parseInt(hex.substr(i * 2, 2), 16);
                        rgb += c + ',';
                    }
                    rgb += opacitiy + ")";
                    return rgb;
                };
                ;
                DrawingUtils.pointInPolygon = function (pointX, pointY, polygon) {
                    var isInside = false;
                    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                        if (polygon[i].y > pointY !== polygon[j].y > pointY &&
                            pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                            isInside = !isInside;
                        }
                    }
                    return isInside;
                };
                ;
                return DrawingUtils;
            }());
            exports_3("DrawingUtils", DrawingUtils);
        }
    };
});
///<reference path="../typings/path2d.d.ts"/>
System.register("hexLibraries/gridHexagon", ["utils/drawingUtilities", "hexLibraries/gridHexagonConstants", "hexLibraries/hexBoard"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var drawingUtilities_1, gridHexagonConstants_1, hexBoard_1, GridHexagon;
    return {
        setters: [
            function (drawingUtilities_1_1) {
                drawingUtilities_1 = drawingUtilities_1_1;
            },
            function (gridHexagonConstants_1_1) {
                gridHexagonConstants_1 = gridHexagonConstants_1_1;
            },
            function (hexBoard_1_1) {
                hexBoard_1 = hexBoard_1_1;
            }
        ],
        execute: function () {///<reference path="../typings/path2d.d.ts"/>
            GridHexagon = (function () {
                function GridHexagon() {
                    this.topPath = null;
                    this.leftDepthPath = null;
                    this.bottomDepthPath = null;
                    this.rightDepthPath = null;
                    this.drawCache = null;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.height = 0;
                    this.heightOffset = 0;
                    this.faction = 0;
                }
                GridHexagon.prototype.getRealX = function () {
                    return gridHexagonConstants_1.GridHexagonConstants.width * 3 / 4 * this.x;
                };
                GridHexagon.prototype.getRealY = function () {
                    var y = this.z * gridHexagonConstants_1.GridHexagonConstants.height() + ((this.x % 2 === 1) ? (-gridHexagonConstants_1.GridHexagonConstants.height() / 2) : 0);
                    y -= this.getDepthHeight();
                    y += this.y * gridHexagonConstants_1.GridHexagonConstants.depthHeight();
                    return y;
                };
                GridHexagon.prototype.getDepthHeight = function () {
                    return Math.max(1, (this.height + this.heightOffset) * gridHexagonConstants_1.GridHexagonConstants.depthHeight());
                };
                GridHexagon.prototype.setSprite = function (sprite) {
                    this.sprite = sprite;
                };
                GridHexagon.prototype.setBaseColor = function (baseColor) {
                    this.baseColor = baseColor;
                };
                GridHexagon.prototype.setHighlightColor = function (highlightColor) {
                    this.highlightColor = highlightColor;
                };
                GridHexagon.prototype.clearHighlightColor = function () {
                    this.highlightColor = null;
                };
                GridHexagon.prototype.setTexture = function (texture) {
                    this.texture = texture;
                };
                GridHexagon.prototype.setHeightOffset = function (heightOffset) {
                    if (this.heightOffset != heightOffset) {
                        this.heightOffset = heightOffset;
                        this.buildPaths();
                    }
                };
                GridHexagon.prototype.buildPaths = function () {
                    var depthHeight = this.getDepthHeight();
                    this.topPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonTopPolygon());
                    this.leftDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
                    this.bottomDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
                    this.rightDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
                };
                GridHexagon.prototype.getDrawingColor = function () {
                    var spriteColor = (this.sprite && new drawingUtilities_1.HexagonColor("#f0c2bc"));
                    var highlightColor = this.highlightColor;
                    var factionColor = (this.faction > 0 && hexBoard_1.HexBoard.factionHexColors[this.faction - 1][this.height]);
                    var baseColor = (this.baseColor && this.baseColor[this.height]);
                    return spriteColor || highlightColor || factionColor || baseColor;
                };
                GridHexagon.prototype.drawLeftDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.leftDepthPath);
                        context.fillStyle = context.createPattern(this.texture.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark1, 0.75);
                        context.fill(this.leftDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = this.getDrawingColor().dark1;
                    context.stroke(this.leftDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawBottomDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.bottomDepthPath);
                        context.fillStyle = context.createPattern(this.texture.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark2, 0.75);
                        context.fill(this.bottomDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = this.getDrawingColor().dark2;
                    context.stroke(this.bottomDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawRightDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.rightDepthPath);
                        context.fillStyle = context.createPattern(this.texture.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark3, 0.75);
                        context.fill(this.rightDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = this.getDrawingColor().dark3;
                    context.stroke(this.rightDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawTop = function (context) {
                    context.save();
                    {
                        context.save();
                        {
                            context.clip(this.topPath);
                            context.fillStyle = context.createPattern(this.texture.image, 'repeat');
                            context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width, gridHexagonConstants_1.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().color, 0.6);
                            context.fill(this.topPath);
                        }
                        context.restore();
                        context.lineWidth = 1;
                        context.strokeStyle = this.getDrawingColor().darkBorder;
                        context.stroke(this.topPath);
                    }
                    context.restore();
                };
                GridHexagon.prototype.invalidate = function () {
                    this.drawCache = null;
                };
                GridHexagon.prototype.envelope = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_1.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_1.GridHexagonConstants.height();
                    size.height += this.getDepthHeight();
                    size.width += 12;
                    size.height += 6;
                    return size;
                };
                GridHexagon.prototype.hexCenter = function () {
                    var center = { x: 0, y: 0 };
                    center.y = gridHexagonConstants_1.GridHexagonConstants.height() / 2;
                    center.x = gridHexagonConstants_1.GridHexagonConstants.width / 2;
                    center.x += 6;
                    center.y += 6;
                    return center;
                };
                GridHexagon.prototype.draw = function (context, offsetX, offsetY) {
                    var center = this.hexCenter();
                    var c = GridHexagon.getCacheImage(this.getDepthHeight(), this.getDrawingColor(), this.texture.name);
                    if (c === this.drawCache) {
                        context.drawImage(this.drawCache, offsetX - center.x, offsetY - center.y);
                    }
                    else {
                        if (!c) {
                            var can = document.createElement('canvas');
                            var ctx = can.getContext('2d');
                            var size = this.envelope();
                            can.width = size.width;
                            can.height = size.height;
                            ctx.save();
                            ctx.translate(center.x, center.y);
                            if (this.getDepthHeight() > 1) {
                                this.drawLeftDepth(ctx);
                                this.drawBottomDepth(ctx);
                                this.drawRightDepth(ctx);
                            }
                            ctx.save();
                            ctx.lineWidth = 1;
                            //ctx.lineCap = "round";
                            //ctx.lineJoin = "round";
                            this.drawTop(ctx);
                            ctx.restore();
                            ctx.restore();
                            GridHexagon.setCacheImage(this.getDepthHeight(), this.getDrawingColor(), this.texture.name, can);
                            /*       ctx.strokeStyle='black';
                             ctx.lineWidth=1;
                             ctx.strokeRect(0,0,can.width,can.height);*/
                            this.drawCache = can;
                        }
                        else {
                            this.drawCache = c;
                        }
                        this.draw(context, offsetX, offsetY);
                    }
                };
                GridHexagon.prototype.getNeighbors = function () {
                    var neighbors = [];
                    if ((this.x % 2 === 0)) {
                        neighbors.push({ x: this.x - 1, z: this.z });
                        neighbors.push({ x: this.x, z: this.z - 1 });
                        neighbors.push({ x: this.x + 1, z: this.z });
                        neighbors.push({ x: this.x - 1, z: this.z + 1 });
                        neighbors.push({ x: this.x, z: this.z + 1 });
                        neighbors.push({ x: this.x + 1, z: this.z + 1 });
                    }
                    else {
                        neighbors.push({ x: this.x - 1, z: this.z - 1 });
                        neighbors.push({ x: this.x, z: this.z - 1 });
                        neighbors.push({ x: this.x + 1, z: this.z - 1 });
                        neighbors.push({ x: this.x - 1, z: this.z });
                        neighbors.push({ x: this.x, z: this.z + 1 });
                        neighbors.push({ x: this.x + 1, z: this.z });
                    }
                    return neighbors;
                };
                GridHexagon.getCacheImage = function (height, hexColor, texture) {
                    var c = height + "-" + hexColor.color + "-" + texture;
                    return GridHexagon.caches[c];
                };
                GridHexagon.setCacheImage = function (height, hexColor, texture, img) {
                    var c = height + "-" + hexColor.color + "-" + texture;
                    GridHexagon.caches[c] = img;
                };
                GridHexagon.buildPath = function (path) {
                    var p2d = new Path2D();
                    for (var i = 0; i < path.length; i++) {
                        var point = path[i];
                        p2d.lineTo(point.x, point.y);
                    }
                    return p2d;
                };
                return GridHexagon;
            }());
            GridHexagon.caches = {};
            exports_4("GridHexagon", GridHexagon);
        }
    };
});
System.register("hexLibraries/gridHexagonConstants", ["utils"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var utils_1, GridHexagonConstants;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            GridHexagonConstants = (function () {
                function GridHexagonConstants() {
                }
                GridHexagonConstants.height = function () {
                    return Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
                };
                GridHexagonConstants.depthHeight = function () {
                    return GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
                };
                ;
                GridHexagonConstants.hexagonTopPolygon = function () {
                    return [new utils_1.Point(-GridHexagonConstants.width / 2, 0), new utils_1.Point(-GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new utils_1.Point(GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new utils_1.Point(GridHexagonConstants.width / 2, 0), new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new utils_1.Point(-GridHexagonConstants.width / 2, 0)];
                };
                ;
                GridHexagonConstants.hexagonDepthLeftPolygon = function (depthHeight) {
                    return [new utils_1.Point(-GridHexagonConstants.width / 2, 0), new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight), new utils_1.Point(-GridHexagonConstants.width / 2, depthHeight), new utils_1.Point(-GridHexagonConstants.width / 2, 0)];
                };
                ;
                GridHexagonConstants.hexagonDepthBottomPolygon = function (depthHeight) {
                    return [new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2),
                        new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2),
                        new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight),
                        new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight),
                        new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
                };
                ;
                GridHexagonConstants.hexagonDepthRightPolygon = function (depthHeight) {
                    return [new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new utils_1.Point(GridHexagonConstants.width / 2, 0), new utils_1.Point(GridHexagonConstants.width / 2, depthHeight), new utils_1.Point(GridHexagonConstants.width / 4, depthHeight + GridHexagonConstants.height() / 2), new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
                };
                ;
                return GridHexagonConstants;
            }());
            GridHexagonConstants.width = 50;
            GridHexagonConstants.heightSkew = .7;
            GridHexagonConstants.depthHeightSkew = .3;
            exports_5("GridHexagonConstants", GridHexagonConstants);
            /*
            setTimeout(() => {
            
                document.getElementById('ranger').oninput = () => {
                    var ranger = document.getElementById('ranger');
                    GridHexagonConstants.width = ranger.value;
                    GridHexagon.caches = {};
                    for (var i = 0; i < Main.gameManager.hexBoard.hexList.length; i++) {
                        var hex = Main.gameManager.hexBoard.hexList[i];
                        hex. buildPaths();
                        hex.drawCache = null;
                    }
                };
            }, 100)*/
        }
    };
});
/*
setTimeout(() => {

    document.getElementById('ranger').oninput = () => {
        var ranger = document.getElementById('ranger');
        GridHexagonConstants.width = ranger.value;
        GridHexagon.caches = {};
        for (var i = 0; i < Main.gameManager.hexBoard.hexList.length; i++) {
            var hex = Main.gameManager.hexBoard.hexList[i];
            hex. buildPaths();
            hex.drawCache = null;
        }
    };
}, 100)*/
System.register("models/hexBoard", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("color", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Color, ColorUtils;
    return {
        setters: [],
        execute: function () {
            /*[Serializable]*/
            Color = (function () {
                function Color(r, g, b, a) {
                    if (a === void 0) { a = 1; }
                    this.R = r;
                    this.G = g;
                    this.B = b;
                    this.A = a;
                }
                return Color;
            }());
            exports_7("Color", Color);
            ColorUtils = (function () {
                function ColorUtils() {
                }
                /*
                 blend two colors to create the color that is at the percentage away from the first color
                 this is a 5 step process
                 1: validate input
                 2: convert input to 6 char hex
                 3: convert hex to rgb
                 4: take the percentage to create a ratio between the two colors
                 5: convert blend to hex
                 @param: color1      => the first color, hex (ie: #000000)
                 @param: color2      => the second color, hex (ie: #ffffff)
                 @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
                 @returns: string    => the third color, hex, represenatation of the blend between color1 and color2 at the given percentage
                 */
                ColorUtils.blend_colors = function (color1, color2, percentage) {
                    // check input
                    color1 = color1 || '#000000';
                    color2 = color2 || '#ffffff';
                    percentage = percentage || 0.5;
                    // 1: validate input, make sure we have provided a valid hex
                    if (color1.length != 4 && color1.length != 7)
                        throw new Error('colors must be provided as hexes');
                    if (color2.length != 4 && color2.length != 7)
                        throw new Error('colors must be provided as hexes');
                    if (percentage > 1 || percentage < 0)
                        throw new Error('percentage must be between 0 and 1');
                    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
                    //      the three character hex is just a representation of the 6 hex where each character is repeated
                    //      ie: #060 => #006600 (green)
                    if (color1.length == 4)
                        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
                    else
                        color1 = color1.substring(1);
                    if (color2.length == 4)
                        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
                    else
                        color2 = color2.substring(1);
                    // 3: we have valid input, convert colors to rgb
                    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
                    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
                    // 4: blend
                    var color3 = [
                        (1 - percentage) * color1[0] + percentage * color2[0],
                        (1 - percentage) * color1[1] + percentage * color2[1],
                        (1 - percentage) * color1[2] + percentage * color2[2]
                    ];
                    // 5: convert to hex
                    // return hex
                    return '#' + ColorUtils.int_to_hex(color3[0]) + ColorUtils.int_to_hex(color3[1]) + ColorUtils.int_to_hex(color3[2]);
                };
                ColorUtils.int_to_hex = function (num) {
                    var hex = Math.round(num).toString(16);
                    if (hex.length == 1)
                        hex = '0' + hex;
                    return hex;
                };
                return ColorUtils;
            }());
            exports_7("ColorUtils", ColorUtils);
        }
    };
});
System.register("hexLibraries/hexUtils", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Node, HexUtils, Direction;
    return {
        setters: [],
        execute: function () {
            Node = (function () {
                function Node(parent, piece) {
                    this.parent = null;
                    this.x = 0;
                    this.z = 0;
                    this.item = null;
                    this.f = 0;
                    this.g = 0;
                    this.parent = parent;
                    // array index of this Node in the world linear array
                    // the location coordinates of this Node
                    this.x = piece.x;
                    this.z = piece.z;
                    this.item = piece;
                    // the distanceFunction cost to get
                    // TO this Node from the START
                    this.f = 0;
                    // the distanceFunction cost to get
                    // from this Node to the GOAL
                    this.g = 0;
                }
                Node.prototype.value = function () {
                    return this.x + (this.z * 5000);
                };
                return Node;
            }());
            exports_8("Node", Node);
            HexUtils = (function () {
                function HexUtils() {
                }
                HexUtils.distance = function (p1, p2) {
                    var x1 = p1.x;
                    var y1 = p1.z;
                    var x2 = p2.x;
                    var y2 = p2.z;
                    var du = x2 - x1;
                    var dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
                    if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
                        return Math.max(Math.abs(du), Math.abs(dv));
                    else
                        return Math.abs(du) + Math.abs(dv);
                };
                HexUtils.orderBy = function (list, callback) {
                    var itms = [];
                    for (var i = 0; i < list.length; i++) {
                        var obj = list[i];
                        itms.push({ item: obj, val: callback(obj) });
                    }
                    itms.sort(function (a, b) { return (a.val - b.val); });
                    list = [];
                    for (var i = 0; i < itms.length; i++) {
                        var obj1 = itms[i];
                        list.push(obj1.item);
                    }
                    return list;
                };
                HexUtils.mathSign = function (f) {
                    if (f < 0)
                        return -1;
                    else if (f > 0)
                        return 1;
                    return 0;
                };
                HexUtils.getDirection = function (p1, p2) {
                    // console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
                    if (p1.x > p2.x) {
                        if (p1.z == p2.z) {
                            return Direction.BottomLeft;
                        }
                        else {
                            if (p1.z < p2.z) {
                                return Direction.TopLeft;
                            }
                            else {
                                return Direction.BottomLeft;
                            }
                        }
                    }
                    else if (p1.x < p2.x) {
                        if (p1.z == p2.z) {
                            // console.log('a');
                            return Direction.TopRight;
                        }
                        else {
                            if (p1.z < p2.z) {
                                // console.log('b');
                                return Direction.BottomRight;
                            }
                            else {
                                // console.log('c');
                                return Direction.TopRight;
                            }
                        }
                    }
                    else {
                        if (p1.z < p2.z) {
                            return Direction.Bottom;
                        }
                        else {
                            return Direction.Top;
                        }
                    }
                };
                return HexUtils;
            }());
            exports_8("HexUtils", HexUtils);
            (function (Direction) {
                Direction[Direction["TopLeft"] = 0] = "TopLeft";
                Direction[Direction["Top"] = 1] = "Top";
                Direction[Direction["TopRight"] = 2] = "TopRight";
                Direction[Direction["BottomRight"] = 3] = "BottomRight";
                Direction[Direction["Bottom"] = 4] = "Bottom";
                Direction[Direction["BottomLeft"] = 5] = "BottomLeft";
            })(Direction || (Direction = {}));
        }
    };
});
System.register("hexLibraries/hexBoard", ["hexLibraries/gridHexagonConstants", "utils/drawingUtilities", "hexLibraries/gridHexagon", "sprites/spriteManager", "color", "hexLibraries/hexUtils", "hexLibraries/AssetManager"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var gridHexagonConstants_2, drawingUtilities_2, gridHexagon_1, spriteManager_1, color_1, hexUtils_1, assetManager_1, HexBoard;
    return {
        setters: [
            function (gridHexagonConstants_2_1) {
                gridHexagonConstants_2 = gridHexagonConstants_2_1;
            },
            function (drawingUtilities_2_1) {
                drawingUtilities_2 = drawingUtilities_2_1;
            },
            function (gridHexagon_1_1) {
                gridHexagon_1 = gridHexagon_1_1;
            },
            function (spriteManager_1_1) {
                spriteManager_1 = spriteManager_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            },
            function (hexUtils_1_1) {
                hexUtils_1 = hexUtils_1_1;
            },
            function (assetManager_1_1) {
                assetManager_1 = assetManager_1_1;
            }
        ],
        execute: function () {
            HexBoard = (function () {
                function HexBoard() {
                    this.viewPort = { x: 0, y: 0, width: 400, height: 400, padding: gridHexagonConstants_2.GridHexagonConstants.width * 2 };
                    this.hexList = [];
                    this.hexBlock = {};
                    this.boardSize = { width: 0, height: 0 };
                    this.spriteManager = new spriteManager_1.SpriteManager(this);
                }
                HexBoard.prototype.setSize = function (width, height) {
                    this.boardSize.width = width;
                    this.boardSize.height = height;
                };
                HexBoard.prototype.gameDimensions = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_2.GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_2.GridHexagonConstants.height() * this.boardSize.height;
                    return size;
                };
                HexBoard.prototype.addHexagon = function (hexagon) {
                    this.hexList.push(hexagon);
                    this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
                };
                HexBoard.prototype.reorderHexList = function () {
                    this.hexList = hexUtils_1.HexUtils.orderBy(this.hexList, function (m) { return (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height; });
                };
                HexBoard.prototype.getHexAtSpot = function (x, z) {
                    return this.hexBlock[x + z * 5000];
                };
                HexBoard.prototype.pathFind = function (start, finish) {
                    var myPathStart = new hexUtils_1.Node(null, start);
                    var myPathEnd = new hexUtils_1.Node(null, finish);
                    var aStar = [];
                    var open = [myPathStart];
                    var closed = [];
                    var result = [];
                    var neighbors;
                    var node;
                    var path;
                    var length, max, min, i, j;
                    while (length = open.length) {
                        max = Infinity;
                        min = -1;
                        for (i = 0; i < length; i++) {
                            if (open[i].f < max) {
                                max = open[i].f;
                                min = i;
                            }
                        }
                        node = open.splice(min, 1)[0];
                        if (node.x === myPathEnd.x && node.z === myPathEnd.z) {
                            path = closed[closed.push(node) - 1];
                            do {
                                result.push(path.item);
                            } while (path = path.parent);
                            aStar = closed = open = [];
                            result.reverse();
                        }
                        else {
                            neighbors = node.item.getNeighbors();
                            for (i = 0, j = neighbors.length; i < j; i++) {
                                var n = this.getHexAtSpot(neighbors[i].x, neighbors[i].z);
                                if (!n)
                                    continue;
                                if (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) >= 2)
                                    continue;
                                path = new hexUtils_1.Node(node, n);
                                if (!aStar[path.value()]) {
                                    path.g = node.g + hexUtils_1.HexUtils.distance(n, node.item) + (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) * 2);
                                    path.f = path.g + hexUtils_1.HexUtils.distance(n, finish);
                                    open.push(path);
                                    aStar[path.value()] = true;
                                }
                            }
                            closed.push(node);
                        }
                    }
                    return result;
                };
                HexBoard.prototype.resize = function (width, height) {
                    this.viewPort.width = width;
                    this.viewPort.height = height;
                };
                HexBoard.prototype.offsetView = function (x, y) {
                    this.viewPort.x += x;
                    this.viewPort.y += y;
                    this.constrainViewPort();
                };
                HexBoard.prototype.setView = function (x, y) {
                    this.viewPort.x = x;
                    this.viewPort.y = y;
                    this.constrainViewPort();
                    localStorage.setItem("lastX", this.viewPort.x.toString());
                    localStorage.setItem("lastY", this.viewPort.y.toString());
                };
                HexBoard.prototype.constrainViewPort = function () {
                    this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
                    this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
                    var size = this.gameDimensions();
                    this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
                    this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height);
                };
                HexBoard.prototype.initialize = function (state) {
                    this.state = state;
                    var terrain = state.terrain;
                    var str = terrain.boardStr;
                    this.setSize(terrain.width, terrain.height);
                    var tile = assetManager_1.AssetManager.assets['tile'];
                    var ys = str.split('|');
                    for (var z = 0; z < terrain.height; z++) {
                        var yItem = ys[z].split('');
                        for (var x = 0; x < terrain.width; x++) {
                            var result = parseInt(yItem[x]);
                            var gridHexagon = new gridHexagon_1.GridHexagon();
                            gridHexagon.x = x;
                            gridHexagon.y = 0;
                            gridHexagon.z = z;
                            gridHexagon.height = result;
                            gridHexagon.setTexture(tile);
                            gridHexagon.setBaseColor(HexBoard.otherColors);
                            gridHexagon.buildPaths();
                            this.addHexagon(gridHexagon);
                        }
                    }
                    this.updateFactionEntities(this.state);
                    this.spriteManager.empty();
                    for (var i = 0; i < state.entities.length; i++) {
                        var entity = state.entities[i];
                        var gridHexagon = this.getHexAtSpot(entity.x, entity.z);
                        var sprite = void 0;
                        switch (entity.entityType) {
                            case "MainBase": {
                                sprite = new spriteManager_1.MainBaseSprite(this.spriteManager);
                                break;
                            }
                            case "Plane": {
                                sprite = new spriteManager_1.HeliSprite(this.spriteManager);
                                break;
                            }
                        }
                        sprite.setTile(gridHexagon);
                        sprite.setId(entity.id);
                        sprite.setHealth(entity.health);
                        this.spriteManager.addSprite(sprite);
                    }
                    this.reorderHexList();
                    var lx = localStorage.getItem("lastX");
                    var ly = localStorage.getItem("lastY");
                    if (lx && ly) {
                        this.setView(parseInt(lx), parseInt(ly));
                    }
                };
                HexBoard.prototype.updateFactionEntities = function (state) {
                    this.state = state;
                    var factionData = state.factionData;
                    var ys = factionData.split('|');
                    for (var z = 0; z < state.terrain.height; z++) {
                        var yItem = ys[z].split('');
                        for (var x = 0; x < state.terrain.width; x++) {
                            var faction = parseInt(yItem[x]);
                            var hex = this.getHexAtSpot(x, z);
                            hex.faction = faction;
                        }
                    }
                    for (var i = 0; i < state.entities.length; i++) {
                        var entity = state.entities[i];
                        var sprite = this.spriteManager.getSpriteById(entity.id);
                        var gridHexagon = this.getHexAtSpot(entity.x, entity.z);
                        if (sprite == null) {
                            var sprite_1 = void 0;
                            switch (entity.entityType) {
                                case "MainBase": {
                                    sprite_1 = new spriteManager_1.MainBaseSprite(this.spriteManager);
                                    break;
                                }
                                case "Plane": {
                                    sprite_1 = new spriteManager_1.HeliSprite(this.spriteManager);
                                    break;
                                }
                            }
                            sprite_1.setTile(gridHexagon);
                            sprite_1.setId(entity.id);
                            sprite_1.setHealth(entity.health);
                            this.spriteManager.addSprite(sprite_1);
                        }
                        else {
                            sprite.setHealth(entity.health);
                            sprite.setTile(gridHexagon);
                        }
                    }
                };
                HexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
                    var lastClick = null;
                    clickX += this.viewPort.x;
                    clickY += this.viewPort.y;
                    for (var i = 0; i < this.hexList.length; i++) {
                        var gridHexagon = this.hexList[i];
                        var x = gridHexagonConstants_2.GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        var z = gridHexagon.z * gridHexagonConstants_2.GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_2.GridHexagonConstants.height() / 2) : 0);
                        z -= gridHexagon.getDepthHeight();
                        z += gridHexagon.y * gridHexagonConstants_2.GridHexagonConstants.depthHeight();
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_2.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_2.GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * gridHexagonConstants_2.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_2.GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * gridHexagonConstants_2.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_2.GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * gridHexagonConstants_2.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                };
                HexBoard.prototype.drawBoard = function (context) {
                    context.save();
                    context.translate(-this.viewPort.x, -this.viewPort.y);
                    context.lineWidth = 1;
                    for (var i = 0; i < this.hexList.length; i++) {
                        var gridHexagon = this.hexList[i];
                        if (this.shouldDraw(gridHexagon)) {
                            this.drawHexagon(context, gridHexagon);
                            var sprite = this.spriteManager.getSpriteAtTile(gridHexagon);
                            if (sprite) {
                                sprite.draw(context);
                            }
                        }
                    }
                    this.spriteManager.draw(context);
                    context.restore();
                };
                HexBoard.prototype.shouldDraw = function (gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    return x > this.viewPort.x - this.viewPort.padding &&
                        x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
                        y > this.viewPort.y - this.viewPort.padding &&
                        y < this.viewPort.y + this.viewPort.height + this.viewPort.padding;
                };
                HexBoard.prototype.drawHexagon = function (context, gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    gridHexagon.draw(context, x, y);
                };
                HexBoard.prototype.centerOnHex = function (gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
                };
                HexBoard.setupColors = function () {
                    this.otherColors = [new drawingUtilities_2.HexagonColor('#AFFFFF')];
                    for (var i = 0; i < 6; i++) {
                        this.otherColors.push(new drawingUtilities_2.HexagonColor(drawingUtilities_2.DrawingUtils.colorLuminance('#AFF000', (i / 6))));
                    }
                    this.factionColors = ["#4953FF", "#FF4F66", "#3DFF53"];
                    this.factionHexColors = [];
                    for (var f = 0; f < this.factionColors.length; f++) {
                        this.factionHexColors[f] = [];
                        this.factionHexColors[f].push(new drawingUtilities_2.HexagonColor(color_1.ColorUtils.blend_colors(this.otherColors[0].color, this.factionColors[f], 0.9)));
                        for (var i = 0; i < 6; i++) {
                            this.factionHexColors[f].push(new drawingUtilities_2.HexagonColor(color_1.ColorUtils.blend_colors(this.otherColors[i + 1].color, drawingUtilities_2.DrawingUtils.colorLuminance(this.factionColors[f], (i / 6)), 0.9)));
                        }
                    }
                };
                return HexBoard;
            }());
            exports_9("HexBoard", HexBoard);
        }
    };
});
System.register("sprites/spriteManager", ["hexLibraries/AssetManager", "hexLibraries/gridHexagonConstants"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var assetManager_2, gridHexagonConstants_3, SpriteManager, BaseSprite, SixDirectionSprite, StationarySprite, HeliSprite, MainBaseSprite;
    return {
        setters: [
            function (assetManager_2_1) {
                assetManager_2 = assetManager_2_1;
            },
            function (gridHexagonConstants_3_1) {
                gridHexagonConstants_3 = gridHexagonConstants_3_1;
            }
        ],
        execute: function () {
            SpriteManager = (function () {
                function SpriteManager(hexBoard) {
                    this.hexBoard = hexBoard;
                    this.sprites = [];
                    this.spriteKeys = {};
                    this.spritesMap = {};
                }
                SpriteManager.prototype.tick = function () {
                    for (var i = 0; i < this.sprites.length; i++) {
                        var sprite = this.sprites[i];
                        sprite.tick();
                    }
                };
                SpriteManager.prototype.getSpriteAtTile = function (item) {
                    return this.spritesMap[item.x + item.z * 5000];
                };
                SpriteManager.prototype.addSprite = function (sprite) {
                    this.sprites.push(sprite);
                    this.spriteKeys[sprite.id] = sprite;
                    sprite.hexBoard = this.hexBoard;
                };
                SpriteManager.prototype.draw = function (context) {
                    for (var i = 0; i < this.sprites.length; i++) {
                        var sprite = this.sprites[i];
                        if (sprite.tile == null && sprite.shouldDraw()) {
                            sprite.draw(context);
                        }
                    }
                };
                SpriteManager.prototype.empty = function () {
                    this.sprites.length = 0;
                    this.spritesMap = {};
                    this.spriteKeys = {};
                };
                SpriteManager.prototype.getSpriteById = function (id) {
                    return this.spriteKeys[id];
                };
                SpriteManager.prototype.clearSpriteAtTile = function (tile) {
                    this.spritesMap[tile.x + tile.z * 5000] = null;
                };
                SpriteManager.prototype.setSpriteAtTile = function (tile, sprite) {
                    this.spritesMap[tile.x + tile.z * 5000] = sprite;
                };
                return SpriteManager;
            }());
            exports_10("SpriteManager", SpriteManager);
            BaseSprite = (function () {
                function BaseSprite(spriteManager, totalFrames, animationSpeed) {
                    this.animationFrame = 0;
                    this._drawTickNumber = (Math.random() * 1000) | 0;
                    this.spriteManager = spriteManager;
                    this.animationSpeed = animationSpeed;
                    this.totalFrames = totalFrames;
                }
                BaseSprite.prototype.setId = function (id) {
                    this.id = id;
                };
                BaseSprite.prototype.tick = function () {
                };
                BaseSprite.prototype.setHealth = function (health) {
                    this.health = health;
                };
                BaseSprite.prototype.setTile = function (tile) {
                    if (this.tile) {
                        this.tile.setSprite(null);
                        this.spriteManager.clearSpriteAtTile(this.tile);
                    }
                    this.tile = tile;
                    if (tile) {
                        this.tile.setSprite(this);
                        this.x = this.tile.getRealX();
                        this.y = this.tile.getRealY();
                        this.spriteManager.setSpriteAtTile(tile, this);
                    }
                };
                BaseSprite.prototype.draw = function (context) {
                    this._drawTickNumber++;
                    if (this._drawTickNumber % this.animationSpeed === 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
                    }
                };
                BaseSprite.prototype.shouldDraw = function () {
                    var x = this.x;
                    var y = this.y;
                    var viewPort = this.hexBoard.viewPort;
                    return x > viewPort.x - viewPort.padding &&
                        x < viewPort.x + viewPort.width + viewPort.padding &&
                        y > viewPort.y - viewPort.padding &&
                        y < viewPort.y + viewPort.height + viewPort.padding;
                };
                return BaseSprite;
            }());
            exports_10("BaseSprite", BaseSprite);
            SixDirectionSprite = (function (_super) {
                __extends(SixDirectionSprite, _super);
                function SixDirectionSprite() {
                    var _this = _super.apply(this, arguments) || this;
                    _this.currentDirection = (Math.random() * 6) | 0;
                    return _this;
                }
                SixDirectionSprite.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.y);
                    var assetName = this.key + '.' + this.currentDirectionToSpriteName();
                    var asset = assetManager_2.AssetManager.assets[assetName];
                    var image = asset.images[this.animationFrame];
                    var ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width);
                    var width = gridHexagonConstants_3.GridHexagonConstants.width;
                    var height = asset.size.height * ratio;
                    context.drawImage(image, -asset.base.x * ratio, -asset.base.y * ratio - this.hoverY(), width, height);
                    context.restore();
                };
                SixDirectionSprite.prototype.currentDirectionToSpriteName = function () {
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
                        default:
                            throw "Direction not found";
                    }
                };
                SixDirectionSprite.prototype.hoverY = function () {
                    var offset = gridHexagonConstants_3.GridHexagonConstants.depthHeight();
                    return -(Math.sin(this._drawTickNumber / 10)) * offset + offset * 1.5;
                };
                return SixDirectionSprite;
            }(BaseSprite));
            exports_10("SixDirectionSprite", SixDirectionSprite);
            StationarySprite = (function (_super) {
                __extends(StationarySprite, _super);
                function StationarySprite() {
                    return _super.apply(this, arguments) || this;
                }
                StationarySprite.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.y);
                    var assetName = this.key;
                    var asset = assetManager_2.AssetManager.assets[assetName];
                    var image = asset.image || asset.images[this.animationFrame];
                    var ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width);
                    var shrink = .75;
                    var width = gridHexagonConstants_3.GridHexagonConstants.width * shrink;
                    var height = asset.size.height * ratio * shrink;
                    context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
                    context.restore();
                };
                return StationarySprite;
            }(BaseSprite));
            exports_10("StationarySprite", StationarySprite);
            HeliSprite = (function (_super) {
                __extends(HeliSprite, _super);
                function HeliSprite(SpriteManager) {
                    var _this = _super.call(this, SpriteManager, 2, 10) || this;
                    _this.key = 'Heli';
                    return _this;
                }
                return HeliSprite;
            }(SixDirectionSprite));
            exports_10("HeliSprite", HeliSprite);
            MainBaseSprite = (function (_super) {
                __extends(MainBaseSprite, _super);
                function MainBaseSprite(SpriteManager) {
                    var _this = _super.call(this, SpriteManager, 0, 0) || this;
                    _this.key = 'MainBase';
                    return _this;
                }
                return MainBaseSprite;
            }(StationarySprite));
            exports_10("MainBaseSprite", MainBaseSprite);
        }
    };
});
System.register("hexLibraries/menuManager", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var MenuManager;
    return {
        setters: [],
        execute: function () {
            MenuManager = (function () {
                function MenuManager(canvas) {
                    this.canvas = null;
                    this.context = null;
                    this.items = [];
                    this.selectedItem = null;
                    this.isOpen = false;
                    this.iconSize = 0;
                    this.location = null;
                    this.onClick = null;
                    this.canvas = canvas;
                    this.context = this.canvas.getContext('2d');
                    this.canvas.width = document.body.clientWidth;
                    this.canvas.height = document.body.clientHeight;
                    this.items = [];
                    this.selectedItem = null;
                    this.isOpen = false;
                    this.iconSize = 100;
                }
                MenuManager.prototype.openMenu = function (items, location, onClick) {
                    this.isOpen = true;
                    this.location = location;
                    this.items = items;
                    this.onClick = onClick;
                    this.selectedItem = null;
                };
                MenuManager.prototype.closeMenu = function () {
                    this.canvas.width = this.canvas.width;
                    this.isOpen = false;
                    this.location = null;
                    this.items = null;
                    this.onClick = null;
                    this.selectedItem = null;
                };
                MenuManager.prototype.size = function () {
                    var size = { width: this.iconSize * this.items.length, height: this.iconSize };
                    return size;
                };
                MenuManager.prototype.tap = function (x, y) {
                    if (!this.isOpen)
                        return false;
                    var size = this.size();
                    if (x >= this.location.x && y >= this.location.y &&
                        x <= this.location.x + size.width && y <= this.location.y + size.height) {
                        x -= this.location.x;
                        y -= this.location.y;
                        var ind = (x / this.iconSize) | 0;
                        this.selectedItem = this.items[ind];
                        this.onClick && this.onClick(this.selectedItem);
                        return true;
                    }
                    return false;
                };
                MenuManager.prototype.draw = function () {
                    if (!this.isOpen)
                        return;
                    this.canvas.width = this.canvas.width;
                    this.context.save();
                    this.context.translate(this.location.x, this.location.y);
                    var size = this.size();
                    this.context.lineWidth = 15;
                    this.context.lineJoin = "round";
                    this.context.strokeStyle = 'grey';
                    this.context.strokeRect(0, 0, size.width, size.height);
                    this.context.fillStyle = 'white';
                    this.context.fillRect(0, 0, size.width, size.height);
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        if (this.selectedItem == item) {
                            this.context.fillStyle = 'red';
                            this.context.fillRect(i * (this.iconSize), 0, this.iconSize, this.iconSize);
                        }
                    }
                    for (var i = 0; i < this.items.length - 1; i++) {
                        this.context.fillStyle = 'grey';
                        this.context.fillRect(this.iconSize + i * (this.iconSize), 0, 2, this.iconSize);
                    }
                    for (var i = 0; i < this.items.length; i++) {
                        var item = this.items[i];
                        this.context.drawImage(item.image, i * (this.iconSize) + 5, 0 + 5, this.iconSize - 10, this.iconSize - 10);
                    }
                    this.context.restore();
                };
                return MenuManager;
            }());
            exports_11("MenuManager", MenuManager);
        }
    };
});
System.register("dataServices", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var DataService;
    return {
        setters: [],
        execute: function () {
            DataService = (function () {
                function DataService() {
                }
                DataService.getGameMetrics = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, ex_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch(this.voteServer + 'api/game/metrics', {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            }
                                        })];
                                case 1:
                                    response = _a.sent();
                                    if (!response.ok)
                                        throw new Error(response.statusText);
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    json = _a.sent();
                                    return [2 /*return*/, json.data.metrics];
                                case 3:
                                    ex_1 = _a.sent();
                                    console.log('Fetch Error :-S', ex_1);
                                    return [2 /*return*/, ex_1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                DataService.vote = function (vote) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, ex_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch(this.voteServer + 'api/game/vote', {
                                            method: "POST",
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(vote)
                                        })];
                                case 1:
                                    response = _a.sent();
                                    ;
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    json = _a.sent();
                                    return [2 /*return*/, json.data];
                                case 3:
                                    ex_2 = _a.sent();
                                    console.error(ex_2);
                                    return [2 /*return*/, ex_2];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                DataService.getGameState = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, ex_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch(this.voteServer + 'api/game/state', {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            }
                                        })];
                                case 1:
                                    response = _a.sent();
                                    if (!response.ok)
                                        throw new Error(response.statusText);
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    json = _a.sent();
                                    return [2 /*return*/, json.data.state];
                                case 3:
                                    ex_3 = _a.sent();
                                    console.log('Fetch Error :-S', ex_3);
                                    return [2 /*return*/, ex_3];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                DataService.getGenerationResult = function (generation) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, ex_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch(this.voteServer + 'api/game/result?generation=' + generation, {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            }
                                        })];
                                case 1:
                                    response = _a.sent();
                                    if (!response.ok)
                                        throw new Error(response.statusText);
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    json = _a.sent();
                                    return [2 /*return*/, json.data.metrics];
                                case 3:
                                    ex_4 = _a.sent();
                                    console.log('Fetch Error :-S', ex_4);
                                    return [2 /*return*/, ex_4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                return DataService;
            }());
            // private static voteServer: string = 'https://vote.socialwargames.com/';
            DataService.voteServer = 'http://localhost:3568/';
            exports_12("DataService", DataService);
        }
    };
});
System.register("gameManager", ["utils/drawingUtilities", "hexLibraries/menuManager", "hexLibraries/hexUtils", "hexLibraries/hexBoard", "dataServices"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var drawingUtilities_3, menuManager_1, hexUtils_2, hexBoard_2, dataServices_1, GameManager;
    return {
        setters: [
            function (drawingUtilities_3_1) {
                drawingUtilities_3 = drawingUtilities_3_1;
            },
            function (menuManager_1_1) {
                menuManager_1 = menuManager_1_1;
            },
            function (hexUtils_2_1) {
                hexUtils_2 = hexUtils_2_1;
            },
            function (hexBoard_2_1) {
                hexBoard_2 = hexBoard_2_1;
            },
            function (dataServices_1_1) {
                dataServices_1 = dataServices_1_1;
            }
        ],
        execute: function () {
            GameManager = (function () {
                function GameManager() {
                    this.swipeVelocity = { x: 0, y: 0 };
                    this.tapStart = { x: 0, y: 0 };
                    this.animating = false;
                }
                GameManager.prototype.init = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var menu, overlay, mc, state;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.fpsMeter = new window.FPSMeter(document.body, {
                                        right: '5px',
                                        left: 'auto',
                                        heat: 1
                                    });
                                    hexBoard_2.HexBoard.setupColors();
                                    this.hexBoard = new hexBoard_2.HexBoard();
                                    this.canvas = document.getElementById("hex");
                                    this.context = this.canvas.getContext("2d");
                                    menu = document.getElementById("menu");
                                    this.menuManager = new menuManager_1.MenuManager(menu);
                                    overlay = document.getElementById("overlay");
                                    mc = new Hammer.Manager(overlay);
                                    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
                                    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
                                    mc.add(new Hammer.Tap());
                                    window.onresize = function () {
                                        _this.canvas.width = document.body.clientWidth;
                                        _this.canvas.height = document.body.clientHeight;
                                        _this.hexBoard.resize(_this.canvas.width, _this.canvas.height);
                                    };
                                    this.canvas.width = document.body.clientWidth;
                                    this.canvas.height = document.body.clientHeight;
                                    overlay.style.width = '100vw';
                                    overlay.style.height = '100vh';
                                    this.hexBoard.resize(this.canvas.width, this.canvas.height);
                                    mc.on('panstart', function (ev) {
                                        if (_this.menuManager.isOpen) {
                                            return false;
                                        }
                                        _this.menuManager.closeMenu();
                                        _this.swipeVelocity.x = _this.swipeVelocity.y = 0;
                                        _this.tapStart.x = _this.hexBoard.viewPort.x;
                                        _this.tapStart.y = _this.hexBoard.viewPort.y;
                                        _this.hexBoard.setView(_this.tapStart.x - ev.deltaX, _this.tapStart.y - ev.deltaY);
                                        return true;
                                    });
                                    mc.on('panmove', function (ev) {
                                        if (_this.menuManager.isOpen) {
                                            return false;
                                        }
                                        _this.hexBoard.setView(_this.tapStart.x - ev.deltaX, _this.tapStart.y - ev.deltaY);
                                    });
                                    mc.on('swipe', function (ev) {
                                        if (_this.menuManager.isOpen) {
                                            return false;
                                        }
                                        _this.menuManager.closeMenu();
                                        _this.swipeVelocity.x = ev.velocityX * 10;
                                        _this.swipeVelocity.y = ev.velocityY * 10;
                                    });
                                    mc.on('tap', function (ev) {
                                        var x = ev.center.x;
                                        var y = ev.center.y;
                                        _this.tapHex(x, y);
                                    });
                                    this.draw();
                                    return [4 /*yield*/, dataServices_1.DataService.getGameState()];
                                case 1:
                                    state = _a.sent();
                                    this.hexBoard.initialize(state);
                                    setTimeout(function () {
                                        _this.randomTap();
                                    }, 1000);
                                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.checkState()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 10 * 1000);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.checkState = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var metrics, result, totalAnimations_1, doneAnimations_1, doneAnimating_1, _loop_2, this_2, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('checking generation');
                                    if (!this.hexBoard || !this.hexBoard.state || this.animating)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, dataServices_1.DataService.getGameMetrics()];
                                case 1:
                                    metrics = _a.sent();
                                    if (!(this.hexBoard.state.generation != metrics.generation))
                                        return [3 /*break*/, 3];
                                    return [4 /*yield*/, dataServices_1.DataService.getGenerationResult(this.hexBoard.state.generation)];
                                case 2:
                                    result = _a.sent();
                                    if (!result) {
                                        console.log('getting new game state');
                                        dataServices_1.DataService.getGameState().then(function (state) {
                                            console.log('game updated');
                                            _this.hexBoard.updateFactionEntities(state);
                                        });
                                        return [2 /*return*/];
                                    }
                                    this.animating = true;
                                    totalAnimations_1 = 0;
                                    doneAnimations_1 = 0;
                                    doneAnimating_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            doneAnimations_1++;
                                            if (doneAnimations_1 == totalAnimations_1) {
                                                console.log('getting new game state');
                                                dataServices_1.DataService.getGameState().then(function (state) {
                                                    console.log('game updated');
                                                    _this.animating = false;
                                                    _this.hexBoard.updateFactionEntities(state);
                                                });
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); };
                                    console.log(result.votes);
                                    _loop_2 = function (i) {
                                        var vote = result.votes[i];
                                        var action = vote.action;
                                        var selectedEntity;
                                        for (var j = 0; j < this_2.hexBoard.state.entities.length; j++) {
                                            var entity = this_2.hexBoard.state.entities[j];
                                            if (entity.id == action.entityId) {
                                                selectedEntity = entity;
                                                break;
                                            }
                                        }
                                        if (!selectedEntity)
                                            return "continue";
                                        var sprite = this_2.hexBoard.spriteManager.getSpriteAtTile(selectedEntity);
                                        console.log('executing action: ', action);
                                        if (!sprite) {
                                            return "continue";
                                        }
                                        switch (action.actionType) {
                                            case "Move":
                                                var moveAction = action;
                                                var path = this_2.hexBoard.pathFind(this_2.hexBoard.getHexAtSpot(selectedEntity.x, selectedEntity.z), this_2.hexBoard.getHexAtSpot(moveAction.x, moveAction.z));
                                                var _loop_3 = function (i_1) {
                                                    var p = path[i_1];
                                                    var oldP = path[i_1 - 1];
                                                    setTimeout(function () {
                                                        sprite.tile.clearHighlightColor();
                                                        sprite.currentDirection = hexUtils_2.HexUtils.getDirection(oldP, p);
                                                        var hex = _this.hexBoard.getHexAtSpot(p.x, p.z);
                                                        hex.faction = selectedEntity.factionId;
                                                        var neighbors = hex.getNeighbors();
                                                        for (var j = 0; j < neighbors.length; j++) {
                                                            var ne = neighbors[j];
                                                            var tile = _this.hexBoard.getHexAtSpot(ne.x, ne.z);
                                                            if (!tile)
                                                                continue;
                                                            tile.faction = selectedEntity.factionId;
                                                        }
                                                        sprite.setTile(hex);
                                                        doneAnimating_1();
                                                    }, i_1 * 500);
                                                    totalAnimations_1++;
                                                };
                                                for (var i_1 = 1; i_1 < path.length; i_1++) {
                                                    _loop_3(i_1);
                                                }
                                                break;
                                        }
                                    };
                                    this_2 = this;
                                    for (i = 0; i < result.votes.length; i++) {
                                        _loop_2(i);
                                    }
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.startAction = function (item) {
                    var radius = 5;
                    var spots = this.findAvailableSpots(radius, item);
                    for (var i = 0; i < spots.length; i++) {
                        var spot = spots[i];
                        var sprite = this.hexBoard.spriteManager.getSpriteAtTile(spot);
                        if (spot == item || sprite)
                            continue;
                        var path = this.hexBoard.pathFind(item, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            spot.setHighlightColor(GameManager.moveHighlightColor);
                        }
                    }
                };
                GameManager.prototype.findAvailableSpots = function (radius, center) {
                    var items = [];
                    for (var q = 0; q < this.hexBoard.hexList.length; q++) {
                        var item = this.hexBoard.hexList[q];
                        if (hexUtils_2.HexUtils.distance(center, item) <= radius) {
                            items.push(item);
                        }
                    }
                    return items;
                };
                GameManager.prototype.draw = function () {
                    var _this = this;
                    requestAnimationFrame(function () {
                        _this.draw();
                    });
                    this.tick();
                    this.canvas.width = this.canvas.width;
                    this.hexBoard.drawBoard(this.context);
                    this.menuManager.draw();
                    this.fpsMeter.tick();
                };
                GameManager.prototype.tick = function () {
                    if (Math.abs(this.swipeVelocity.x) > 0) {
                        var sign = hexUtils_2.HexUtils.mathSign(this.swipeVelocity.x);
                        this.swipeVelocity.x += 0.7 * -sign;
                        if (hexUtils_2.HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                            this.swipeVelocity.x = 0;
                        }
                    }
                    if (Math.abs(this.swipeVelocity.y) > 0) {
                        var sign = hexUtils_2.HexUtils.mathSign(this.swipeVelocity.y);
                        this.swipeVelocity.y += 0.7 * -sign;
                        if (hexUtils_2.HexUtils.mathSign(this.swipeVelocity.y) != sign) {
                            this.swipeVelocity.y = 0;
                        }
                    }
                    // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
                    {
                        this.hexBoard.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
                    }
                    this.hexBoard.spriteManager.tick();
                };
                GameManager.prototype.randomTap = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var ent, px, pz, p, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.animating) {
                                        setTimeout(function () {
                                            _this.randomTap();
                                        }, Math.random() * 1000 + 100);
                                        return [2 /*return*/];
                                    }
                                    while (true) {
                                        p = Math.round(this.hexBoard.state.entities.length * Math.random());
                                        ent = this.hexBoard.state.entities[p];
                                        if (!ent)
                                            continue;
                                        px = Math.round(ent.x + Math.random() * 10 - 5);
                                        pz = Math.round(ent.z + Math.random() * 10 - 5);
                                        if (px == 0 && pz == 0)
                                            continue;
                                        if (hexUtils_2.HexUtils.distance({ x: px, z: pz }, { x: ent.x, z: ent.z }) <= 5) {
                                            break;
                                        }
                                    }
                                    return [4 /*yield*/, dataServices_1.DataService.vote({
                                            entityId: ent.id,
                                            action: 'Move',
                                            userId: 'foo',
                                            generation: this.hexBoard.state.generation,
                                            x: px,
                                            z: pz
                                        })];
                                case 1:
                                    result = _a.sent();
                                    if (!result.generationMismatch)
                                        return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.checkState()];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    setTimeout(function () {
                                        _this.randomTap();
                                    }, Math.random() * 1000 + 100);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.tapHex = function (x, y) {
                    return __awaiter(this, void 0, void 0, function () {
                        var i, h, item, sprite_2, distance, sprite;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.swipeVelocity.x = this.swipeVelocity.y = 0;
                                    /* if (this.menuManager.tap(x, y)) {
                                     return;
                                     }
                                     this.menuManager.closeMenu();*/
                                    for (i = 0; i < this.hexBoard.hexList.length; i++) {
                                        h = this.hexBoard.hexList[i];
                                        h.clearHighlightColor();
                                    }
                                    item = this.hexBoard.getHexAtPoint(x, y);
                                    if (!item)
                                        return [2 /*return*/];
                                    if (!this.selectedHex)
                                        return [3 /*break*/, 2];
                                    sprite_2 = this.hexBoard.spriteManager.getSpriteAtTile(this.selectedHex);
                                    distance = hexUtils_2.HexUtils.distance(this.selectedHex, item);
                                    console.log(distance);
                                    if (distance > 5) {
                                        return [2 /*return*/];
                                    }
                                    if (!sprite_2) {
                                        this.selectedHex = null;
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, dataServices_1.DataService.vote({
                                            entityId: sprite_2.id,
                                            action: 'Move',
                                            userId: 'foo',
                                            generation: this.hexBoard.state.generation,
                                            x: item.x,
                                            z: item.z
                                        })];
                                case 1:
                                    _a.sent();
                                    this.selectedHex = null;
                                    return [2 /*return*/];
                                case 2:
                                    sprite = this.hexBoard.spriteManager.getSpriteAtTile(item);
                                    if (sprite) {
                                        this.selectedHex = item;
                                        this.startAction(item);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                return GameManager;
            }());
            GameManager.baseColor = new drawingUtilities_3.HexagonColor('#FFFFFF');
            GameManager.highlightColor = new drawingUtilities_3.HexagonColor('#00F9FF');
            GameManager.selectedHighlightColor = new drawingUtilities_3.HexagonColor('#6B90FF');
            GameManager.moveHighlightColor = new drawingUtilities_3.HexagonColor('#BE9EFF');
            GameManager.attackHighlightColor = new drawingUtilities_3.HexagonColor('#91F9CF');
            exports_13("GameManager", GameManager);
        }
    };
});
/// <reference path="./typings/Compress.d.ts" />
/// <reference path="./node_modules/@types/core-js/index.d.ts" />
/// <reference path="./node_modules/@types/whatwg-fetch/index.d.ts" />
System.register("main", ["hexLibraries/AssetManager", "gameManager"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var AssetManager_1, gameManager_1, Main;
    return {
        setters: [
            function (AssetManager_1_1) {
                AssetManager_1 = AssetManager_1_1;
            },
            function (gameManager_1_1) {
                gameManager_1 = gameManager_1_1;
            }
        ],
        execute: function () {/// <reference path="./typings/Compress.d.ts" />
            /// <reference path="./node_modules/@types/core-js/index.d.ts" />
            /// <reference path="./node_modules/@types/whatwg-fetch/index.d.ts" />
            Main = (function () {
                function Main() {
                }
                Main.run = function () {
                    var _this = this;
                    this.loadAssets(function () {
                        _this.gameManager = new gameManager_1.GameManager();
                        _this.gameManager.init();
                    });
                };
                Main.loadAssets = function (onComplete) {
                    AssetManager_1.AssetManager.completed = onComplete;
                    var size = { width: 80, height: 80 };
                    var base = { x: 40, y: 55 };
                    AssetManager_1.AssetManager.addAsset('Infantry', 'images/tower_10.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Tank', 'images/tower_40.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Base', 'images/tower_42.png', size, base);
                    AssetManager_1.AssetManager.addAsset('MainBase', 'images/tower_42.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);
                    AssetManager_1.AssetManager.addAsset('tile', 'images/tile.png', size, base);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.TopLeft', 0, 'images/heli/top_left_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.TopLeft', 1, 'images/heli/top_left_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.TopRight', 0, 'images/heli/top_right_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.TopRight', 1, 'images/heli/top_right_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.BottomLeft', 0, 'images/heli/bottom_left_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.BottomLeft', 1, 'images/heli/bottom_left_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.BottomRight', 0, 'images/heli/bottom_right_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.BottomRight', 1, 'images/heli/bottom_right_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.Bottom', 0, 'images/heli/down_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.Bottom', 1, 'images/heli/down_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.Top', 0, 'images/heli/up_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli.Top', 1, 'images/heli/up_2.png', null, null);
                    AssetManager_1.AssetManager.start();
                };
                return Main;
            }());
            exports_14("Main", Main);
            Main.run();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy9oZXhMaWJyYXJpZXMvQXNzZXRNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvZHJhd2luZ1V0aWxpdGllcy50cyIsIi4uL2NvbXBvbmVudHMvaGV4TGlicmFyaWVzL2dyaWRIZXhhZ29uLnRzIiwiLi4vY29tcG9uZW50cy9oZXhMaWJyYXJpZXMvZ3JpZEhleGFnb25Db25zdGFudHMudHMiLCIuLi9jb21wb25lbnRzL21vZGVscy9oZXhCb2FyZC50cyIsIi4uL2NvbXBvbmVudHMvY29sb3IudHMiLCIuLi9jb21wb25lbnRzL2hleExpYnJhcmllcy9oZXhVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvaGV4TGlicmFyaWVzL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9zcHJpdGVzL3Nwcml0ZU1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL2hleExpYnJhcmllcy9tZW51TWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvZGF0YVNlcnZpY2VzLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWVBO2dCQUFBO2dCQXNFQSxDQUFDO2dCQTlEVSxrQkFBSyxHQUFaO29CQUFBLGlCQWFDOzRDQVpjLE1BQUk7d0JBQ1gsRUFBRSxDQUFDLENBQUMsT0FBSyxVQUFVLENBQUMsY0FBYyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkMsSUFBTSxLQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzs0QkFFeEIsS0FBRyxDQUFDLE1BQU0sR0FBRztnQ0FDVCxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUcsRUFBRSxNQUFJLENBQUMs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QUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7b0JBQ25ELENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMvQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUUvQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMvQyxDQUFD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QUFFLENBQUM7b0JBQ25CLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELElBQUk7d0JBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFFTSxnQkFBTyxHQUFkLFVBQWUsSUFBSSxFQUFFLFFBQVE7b0JBQ3pCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25DLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7b0JBQy9DLENBQUM7b0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENB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