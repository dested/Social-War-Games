var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
System.register("hexLibraries/gridHexagonConstants", ["utils"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
            GridHexagonConstants.width = 150;
            GridHexagonConstants.heightSkew = .7;
            GridHexagonConstants.depthHeightSkew = .3;
            exports_3("GridHexagonConstants", GridHexagonConstants);
        }
    };
});
System.register("gridHexagon", ["hexLibraries/gridHexagonConstants"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var gridHexagonConstants_1, GridHexagon;
    return {
        setters: [
            function (gridHexagonConstants_1_1) {
                gridHexagonConstants_1 = gridHexagonConstants_1_1;
            }
        ],
        execute: function () {
            GridHexagon = (function () {
                function GridHexagon() {
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
                return GridHexagon;
            }());
            exports_4("GridHexagon", GridHexagon);
        }
    };
});
System.register("spriteManager", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var SpriteManager, Sprite;
    return {
        setters: [],
        execute: function () {
            SpriteManager = (function () {
                function SpriteManager() {
                    this.sprites = [];
                    this.spritesMap = {};
                }
                SpriteManager.prototype.addSprite = function (sprite) {
                    this.sprites.push(sprite);
                };
                SpriteManager.prototype.tick = function () {
                    for (var i = 0; i < this.sprites.length; i++) {
                        var sprite = this.sprites[i];
                        sprite.tick();
                    }
                };
                SpriteManager.prototype.getSpritesAtTile = function (item) {
                    return this.spritesMap[item.x + item.z * 5000] || [];
                };
                return SpriteManager;
            }());
            exports_5("SpriteManager", SpriteManager);
            Sprite = (function () {
                function Sprite(spriteManager) {
                    this.spriteManager = spriteManager;
                }
                Sprite.prototype.setId = function (id) {
                    this.id = id;
                };
                Sprite.prototype.tick = function () {
                };
                Sprite.prototype.setTile = function (tile) {
                    if (this.tile) {
                        var sprites = this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000];
                        sprites = sprites || [];
                        sprites.splice(sprites.indexOf(this), 1);
                        this.spriteManager.spritesMap[this.tile.x + this.tile.z * 5000] = sprites;
                    }
                    this.tile = tile;
                    if (tile) {
                        this.x = this.tile.getRealX();
                        this.y = this.tile.getRealY();
                        var sprites = this.spriteManager.spritesMap[tile.x + tile.z * 5000];
                        sprites = sprites || [];
                        sprites.push(this);
                        this.spriteManager.spritesMap[tile.x + tile.z * 5000] = sprites;
                    }
                };
                return Sprite;
            }());
            exports_5("Sprite", Sprite);
        }
    };
});
System.register("utils/drawingUtilities", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
            exports_6("HexagonColor", HexagonColor);
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
            exports_6("DrawingUtils", DrawingUtils);
        }
    };
});
System.register("hexLibraries/hexUtils", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Node, HexUtils, Direction;
    return {
        setters: [],
        execute: function () {
            Node = (function () {
                function Node(parent, piece) {
                    this.parent = null;
                    this.x = 0;
                    this.y = 0;
                    this.item = null;
                    this.f = 0;
                    this.g = 0;
                    this.parent = parent;
                    // array index of this Node in the world linear array
                    // the location coordinates of this Node
                    this.x = piece.x;
                    this.y = piece.z;
                    this.item = piece;
                    // the distanceFunction cost to get
                    // TO this Node from the START
                    this.f = 0;
                    // the distanceFunction cost to get
                    // from this Node to the GOAL
                    this.g = 0;
                }
                Node.prototype.value = function () {
                    return this.x + (this.y * 5000);
                };
                return Node;
            }());
            exports_7("Node", Node);
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
                    console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
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
                            console.log('a');
                            return Direction.TopRight;
                        }
                        else {
                            if (p1.z < p2.z) {
                                console.log('b');
                                return Direction.BottomRight;
                            }
                            else {
                                console.log('c');
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
            exports_7("HexUtils", HexUtils);
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
System.register("hexBoard", ["hexLibraries/gridHexagonConstants", "hexLibraries/hexUtils"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var gridHexagonConstants_2, hexUtils_1, HexBoard;
    return {
        setters: [
            function (gridHexagonConstants_2_1) {
                gridHexagonConstants_2 = gridHexagonConstants_2_1;
            },
            function (hexUtils_1_1) {
                hexUtils_1 = hexUtils_1_1;
            }
        ],
        execute: function () {
            HexBoard = (function () {
                function HexBoard() {
                    this.hexList = [];
                    this.hexBlock = {};
                    this.boardSize = { width: 0, height: 0 };
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
                HexBoard.prototype.xyToHexIndex = function (x, y) {
                    return this.hexBlock[x + y * 5000];
                };
                HexBoard.prototype.pathFind = function (start, finish) {
                    var myPathStart = new hexUtils_1.Node(null, start);
                    var myPathEnd = new hexUtils_1.Node(null, finish);
                    var aStar = [];
                    var open = [myPathStart];
                    var closed = [];
                    var result = [];
                    var neighbours;
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
                        if (node.x === myPathEnd.x && node.y === myPathEnd.y) {
                            path = closed[closed.push(node) - 1];
                            do {
                                result.push(path.item);
                            } while (path = path.parent);
                            aStar = closed = open = [];
                            result.reverse();
                        }
                        else {
                            neighbours = node.item.getNeighbors();
                            for (i = 0, j = neighbours.length; i < j; i++) {
                                var n = this.xyToHexIndex(neighbours[i].x, neighbours[i].y);
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
                return HexBoard;
            }());
            exports_8("HexBoard", HexBoard);
        }
    };
});
System.register("models/hexBoard", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var GameState, Terrain, GameEntity;
    return {
        setters: [],
        execute: function () {
            GameState = (function () {
                function GameState() {
                }
                return GameState;
            }());
            exports_9("GameState", GameState);
            Terrain = (function () {
                function Terrain() {
                }
                return Terrain;
            }());
            exports_9("Terrain", Terrain);
            GameEntity = (function () {
                function GameEntity() {
                }
                return GameEntity;
            }());
            exports_9("GameEntity", GameEntity);
        }
    };
});
///<reference path="../typings/path2d.d.ts"/>
System.register("hexLibraries/clientGridHexagon", ["hexLibraries/AssetManager", "utils/drawingUtilities", "gridHexagon", "hexLibraries/gridHexagonConstants"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var AssetManager_1, drawingUtilities_1, gridHexagon_1, gridHexagonConstants_3, ClientGridHexagon;
    return {
        setters: [
            function (AssetManager_1_1) {
                AssetManager_1 = AssetManager_1_1;
            },
            function (drawingUtilities_1_1) {
                drawingUtilities_1 = drawingUtilities_1_1;
            },
            function (gridHexagon_1_1) {
                gridHexagon_1 = gridHexagon_1_1;
            },
            function (gridHexagonConstants_3_1) {
                gridHexagonConstants_3 = gridHexagonConstants_3_1;
            }
        ],
        execute: function () {///<reference path="../typings/path2d.d.ts"/>
            ClientGridHexagon = (function (_super) {
                __extends(ClientGridHexagon, _super);
                function ClientGridHexagon() {
                    var _this = _super.apply(this, arguments) || this;
                    _this.icon = null;
                    _this.highlightColor = null;
                    _this.hexColor = null;
                    _this.topPath = null;
                    _this.leftDepthPath = null;
                    _this.bottomDepthPath = null;
                    _this.rightDepthPath = null;
                    _this.drawCache = null;
                    _this.factionColors = ["#FFFFFF", "#4953FF", "#FF4F66", "#3DFF53"];
                    return _this;
                }
                ClientGridHexagon.prototype.setIcon = function (name) {
                    if (name) {
                        this.icon = AssetManager_1.AssetManager.assets[name];
                    }
                    else {
                        this.icon = null;
                    }
                    this.invalidate();
                };
                ClientGridHexagon.prototype.setColor = function (hexColor) {
                    if (this.hexColor != hexColor) {
                        this.hexColor = hexColor;
                        this.invalidate();
                    }
                };
                ClientGridHexagon.prototype.setHighlight = function (hexColor) {
                    if (this.highlightColor != hexColor) {
                        this.highlightColor = hexColor;
                        this.invalidate();
                    }
                };
                ClientGridHexagon.prototype.setHeightOffset = function (heightOffset) {
                    if (this.heightOffset != heightOffset) {
                        this.heightOffset = heightOffset;
                        this.buildPaths();
                    }
                };
                ClientGridHexagon.prototype.buildPaths = function () {
                    var depthHeight = this.getDepthHeight();
                    this.topPath = ClientGridHexagon.buildPath(gridHexagonConstants_3.GridHexagonConstants.hexagonTopPolygon());
                    this.leftDepthPath = ClientGridHexagon.buildPath(gridHexagonConstants_3.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
                    this.bottomDepthPath = ClientGridHexagon.buildPath(gridHexagonConstants_3.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
                    this.rightDepthPath = ClientGridHexagon.buildPath(gridHexagonConstants_3.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
                };
                ClientGridHexagon.prototype.getDrawingColor = function () {
                    return this.highlightColor || this.hexColor;
                };
                ClientGridHexagon.prototype.drawLeftDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.leftDepthPath);
                        context.fillStyle = context.createPattern(AssetManager_1.AssetManager.assets['tile'].image, 'repeat');
                        context.fillRect(-gridHexagonConstants_3.GridHexagonConstants.width / 2, -gridHexagonConstants_3.GridHexagonConstants.height() / 2, gridHexagonConstants_3.GridHexagonConstants.width * 2, gridHexagonConstants_3.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark1, 0.75);
                        context.fill(this.leftDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 3;
                    context.strokeStyle = this.getDrawingColor().dark1;
                    context.stroke(this.leftDepthPath);
                    context.restore();
                };
                ClientGridHexagon.prototype.drawBottomDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.bottomDepthPath);
                        context.fillStyle = context.createPattern(AssetManager_1.AssetManager.assets['tile'].image, 'repeat');
                        context.fillRect(-gridHexagonConstants_3.GridHexagonConstants.width / 2, -gridHexagonConstants_3.GridHexagonConstants.height() / 2, gridHexagonConstants_3.GridHexagonConstants.width * 2, gridHexagonConstants_3.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark2, 0.75);
                        context.fill(this.bottomDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 3;
                    context.strokeStyle = this.getDrawingColor().dark2;
                    context.stroke(this.bottomDepthPath);
                    context.restore();
                };
                ClientGridHexagon.prototype.drawRightDepth = function (context) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.rightDepthPath);
                        context.fillStyle = context.createPattern(AssetManager_1.AssetManager.assets['tile'].image, 'repeat');
                        context.fillRect(-gridHexagonConstants_3.GridHexagonConstants.width / 2, -gridHexagonConstants_3.GridHexagonConstants.height() / 2, gridHexagonConstants_3.GridHexagonConstants.width * 2, gridHexagonConstants_3.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().dark3, 0.75);
                        context.fill(this.rightDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 3;
                    context.strokeStyle = this.getDrawingColor().dark3;
                    context.stroke(this.rightDepthPath);
                    context.restore();
                };
                ClientGridHexagon.prototype.drawTop = function (context) {
                    context.save();
                    {
                        context.save();
                        {
                            context.clip(this.topPath);
                            context.fillStyle = context.createPattern(AssetManager_1.AssetManager.assets['tile'].image, 'repeat');
                            context.fillRect(-gridHexagonConstants_3.GridHexagonConstants.width / 2, -gridHexagonConstants_3.GridHexagonConstants.height() / 2, gridHexagonConstants_3.GridHexagonConstants.width, gridHexagonConstants_3.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(this.getDrawingColor().color, 0.6);
                            context.fill(this.topPath);
                        }
                        context.restore();
                        context.lineWidth = 3;
                        context.strokeStyle = this.getDrawingColor().darkBorder;
                        context.stroke(this.topPath);
                    }
                    context.restore();
                };
                ClientGridHexagon.prototype.drawIcon = function (context) {
                    if (this.icon) {
                        context.save();
                        context.translate(-this.icon.base.x, -this.icon.base.y);
                        var width = this.icon.size.width;
                        var height = this.icon.size.height;
                        context.drawImage(this.icon.image, 0, 0, width, height);
                        context.restore();
                    }
                };
                ClientGridHexagon.prototype.invalidate = function () {
                    this.drawCache = null;
                };
                ClientGridHexagon.prototype.envelope = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_3.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_3.GridHexagonConstants.height();
                    if (this.icon) {
                        size.height = Math.max(size.height, this.icon.base.y + size.height / 2);
                    }
                    size.height += this.getDepthHeight();
                    size.width += 12;
                    size.height += 6;
                    return size;
                };
                ClientGridHexagon.prototype.hexCenter = function () {
                    var center = { x: 0, y: 0 };
                    center.y = gridHexagonConstants_3.GridHexagonConstants.height() / 2;
                    if (this.icon) {
                        center.y = Math.max(center.y, this.icon.base.y);
                    }
                    center.x = gridHexagonConstants_3.GridHexagonConstants.width / 2;
                    if (this.icon) {
                        center.x = center.x;
                    }
                    center.x += 6;
                    center.y += 6;
                    return center;
                };
                ClientGridHexagon.prototype.draw = function (context) {
                    var center = this.hexCenter();
                    if (this.drawCache) {
                        context.drawImage(this.drawCache, -center.x, -center.y);
                    }
                    else {
                        var c = ClientGridHexagon.getCacheImage(this.getDepthHeight(), this.icon, this.highlightColor || this.hexColor, this.factionColors[this.faction]);
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
                            this.drawIcon(ctx);
                            ctx.restore();
                            ClientGridHexagon.setCacheImage(this.getDepthHeight(), this.icon, this.highlightColor || this.hexColor, this.factionColors[this.faction], can);
                            /*       ctx.strokeStyle='black';
                             ctx.lineWidth=1;
                             ctx.strokeRect(0,0,can.width,can.height);*/
                            this.drawCache = can;
                        }
                        else {
                            this.drawCache = c;
                        }
                        this.draw(context);
                    }
                };
                ClientGridHexagon.prototype.getNeighbors = function () {
                    var neighbors = [];
                    if ((this.x % 2 === 0)) {
                        neighbors.push({ x: this.x - 1, y: this.z });
                        neighbors.push({ x: this.x, y: this.z - 1 });
                        neighbors.push({ x: this.x + 1, y: this.z });
                        neighbors.push({ x: this.x - 1, y: this.z + 1 });
                        neighbors.push({ x: this.x, y: this.z + 1 });
                        neighbors.push({ x: this.x + 1, y: this.z + 1 });
                    }
                    else {
                        neighbors.push({ x: this.x - 1, y: this.z - 1 });
                        neighbors.push({ x: this.x, y: this.z - 1 });
                        neighbors.push({ x: this.x + 1, y: this.z - 1 });
                        neighbors.push({ x: this.x - 1, y: this.z });
                        neighbors.push({ x: this.x, y: this.z + 1 });
                        neighbors.push({ x: this.x + 1, y: this.z });
                    }
                    return neighbors;
                };
                ClientGridHexagon.getCacheImage = function (height, icon, hexColor, tint) {
                    var c = (icon ? icon.name : '') + "-" + height + "-" + hexColor.color + "-" + tint;
                    return ClientGridHexagon.caches[c];
                };
                ClientGridHexagon.setCacheImage = function (height, icon, hexColor, tint, img) {
                    var c = (icon ? icon.name : '') + "-" + height + "-" + hexColor.color + "-" + tint;
                    ClientGridHexagon.caches[c] = img;
                };
                ClientGridHexagon.buildPath = function (path) {
                    var p2d = new Path2D();
                    for (var i = 0; i < path.length; i++) {
                        var point = path[i];
                        p2d.lineTo(point.x, point.y);
                    }
                    return p2d;
                };
                return ClientGridHexagon;
            }(gridHexagon_1.GridHexagon));
            ClientGridHexagon.caches = {};
            exports_10("ClientGridHexagon", ClientGridHexagon);
        }
    };
});
System.register("hexLibraries/clientHexBoard", ["hexLibraries/gridHexagonConstants", "utils/drawingUtilities", "hexBoard", "hexLibraries/clientGridHexagon", "clientSpriteManager"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var gridHexagonConstants_4, drawingUtilities_2, hexBoard_1, clientGridHexagon_1, clientSpriteManager_1, ClientHexBoard;
    return {
        setters: [
            function (gridHexagonConstants_4_1) {
                gridHexagonConstants_4 = gridHexagonConstants_4_1;
            },
            function (drawingUtilities_2_1) {
                drawingUtilities_2 = drawingUtilities_2_1;
            },
            function (hexBoard_1_1) {
                hexBoard_1 = hexBoard_1_1;
            },
            function (clientGridHexagon_1_1) {
                clientGridHexagon_1 = clientGridHexagon_1_1;
            },
            function (clientSpriteManager_1_1) {
                clientSpriteManager_1 = clientSpriteManager_1_1;
            }
        ],
        execute: function () {
            ClientHexBoard = (function (_super) {
                __extends(ClientHexBoard, _super);
                function ClientHexBoard() {
                    var _this = _super.call(this) || this;
                    _this.viewPort = { x: 0, y: 0, width: 400, height: 400, padding: gridHexagonConstants_4.GridHexagonConstants.width * 2 };
                    _this.clientSpriteManager = _this.spriteManager = new clientSpriteManager_1.ClientSpriteManager(_this);
                    return _this;
                }
                ClientHexBoard.prototype.resize = function (width, height) {
                    this.viewPort.width = width;
                    this.viewPort.height = height;
                };
                ClientHexBoard.prototype.offsetView = function (x, y) {
                    this.viewPort.x += x;
                    this.viewPort.y += y;
                    this.constrainViewPort();
                };
                ClientHexBoard.prototype.setView = function (x, y) {
                    this.viewPort.x = x;
                    this.viewPort.y = y;
                    this.constrainViewPort();
                };
                ClientHexBoard.prototype.constrainViewPort = function () {
                    this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
                    this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
                    var size = this.gameDimensions();
                    this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
                    this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height);
                };
                ClientHexBoard.prototype.initialize = function (state) {
                    var terrain = state.terrain;
                    var str = terrain.boardStr;
                    this.setSize(terrain.width, terrain.height);
                    var baseColor = new drawingUtilities_2.HexagonColor('#AFFFFF');
                    var otherColors = [];
                    for (var i = 0; i < 6; i++) {
                        otherColors[i] = new drawingUtilities_2.HexagonColor(drawingUtilities_2.DrawingUtils.colorLuminance('#AFF000', (i / 6)));
                    }
                    var ys = str.split('|');
                    for (var y = 0; y < terrain.height; y++) {
                        var yItem = ys[y].split('');
                        for (var x = 0; x < terrain.width; x++) {
                            var xItem = parseInt(yItem[x]);
                            var gridHexagon = new clientGridHexagon_1.ClientGridHexagon();
                            gridHexagon.x = x;
                            gridHexagon.y = 0;
                            gridHexagon.z = y;
                            gridHexagon.height = xItem === 0 ? 0 : xItem;
                            if (xItem === 0) {
                                gridHexagon.hexColor = baseColor;
                            }
                            else {
                                gridHexagon.hexColor = otherColors[xItem - 1];
                            }
                            gridHexagon.buildPaths();
                            this.addHexagon(gridHexagon);
                        }
                    }
                    var factionData = state.factionData;
                    var factionColors = ["#FFFFFF", "#4953FF", "#FF4F66", "#3DFF53"];
                    ys = factionData.split('|');
                    for (var y = 0; y < terrain.height; y++) {
                        var yItem = ys[y].split('');
                        for (var x = 0; x < terrain.width; x++) {
                            var faction = parseInt(yItem[x]);
                            var hex = this.getHexAtSpot(x, 0, y);
                            hex.faction = faction;
                            if (faction > 0) {
                                hex.hexColor = new drawingUtilities_2.HexagonColor(drawingUtilities_2.DrawingUtils.colorLuminance(factionColors[faction], (hex.height / 6)));
                            }
                        }
                    }
                    for (var i_1 = 0; i_1 < state.entities.length; i_1++) {
                        var entity = state.entities[i_1];
                        var gridHexagon = this.getHexAtSpot(entity.x, 0, entity.z);
                        switch (entity.entityType) {
                            case "MainBase": {
                                var sprite = new clientSpriteManager_1.ClientMainBaseSprite(this.clientSpriteManager);
                                sprite.setTile(gridHexagon);
                                sprite.setId(entity.id);
                                this.clientSpriteManager.addSprite(sprite);
                                this.centerOnHex(gridHexagon);
                                break;
                            }
                            case "Plane": {
                                var sprite = new clientSpriteManager_1.ClientHeliSprite(this.clientSpriteManager);
                                sprite.setTile(gridHexagon);
                                sprite.setId(entity.id);
                                this.clientSpriteManager.addSprite(sprite);
                                break;
                            }
                        }
                    }
                    this.reorderHexList();
                };
                ClientHexBoard.prototype.getHexAtSpot = function (x, y, z) {
                    for (var i = 0; i < this.hexList.length; i++) {
                        var gridHexagon = this.hexList[i];
                        if (gridHexagon.x === x && gridHexagon.y === y && gridHexagon.z === z) {
                            return gridHexagon;
                        }
                    }
                    return null;
                };
                ClientHexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
                    var lastClick = null;
                    clickX += this.viewPort.x;
                    clickY += this.viewPort.y;
                    for (var i = 0; i < this.hexList.length; i++) {
                        var gridHexagon = this.hexList[i];
                        var x = gridHexagonConstants_4.GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        var z = gridHexagon.z * gridHexagonConstants_4.GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_4.GridHexagonConstants.height() / 2) : 0);
                        z -= gridHexagon.getDepthHeight();
                        z += gridHexagon.y * gridHexagonConstants_4.GridHexagonConstants.depthHeight();
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                };
                ClientHexBoard.prototype.drawBoard = function (context) {
                    context.save();
                    context.translate(-this.viewPort.x, -this.viewPort.y);
                    context.lineWidth = 1;
                    for (var i = 0; i < this.hexList.length; i++) {
                        var gridHexagon = this.hexList[i];
                        if (this.shouldDraw(gridHexagon)) {
                            this.drawHexagon(context, gridHexagon);
                            var sprites = this.clientSpriteManager.spritesMap[gridHexagon.x + gridHexagon.z * 5000];
                            if (sprites) {
                                for (var j = 0; j < sprites.length; j++) {
                                    var sprite = sprites[j];
                                    sprite.draw(context);
                                }
                            }
                        }
                    }
                    this.clientSpriteManager.draw(context);
                    context.restore();
                };
                ClientHexBoard.prototype.shouldDraw = function (gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    return x > this.viewPort.x - this.viewPort.padding &&
                        x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
                        y > this.viewPort.y - this.viewPort.padding &&
                        y < this.viewPort.y + this.viewPort.height + this.viewPort.padding;
                };
                ClientHexBoard.prototype.drawHexagon = function (context, gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    context.save();
                    context.translate(x, y);
                    gridHexagon.draw(context);
                    context.restore();
                };
                ClientHexBoard.prototype.centerOnHex = function (gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealY();
                    this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
                };
                return ClientHexBoard;
            }(hexBoard_1.HexBoard));
            exports_11("ClientHexBoard", ClientHexBoard);
        }
    };
});
System.register("clientSpriteManager", ["spriteManager", "hexLibraries/AssetManager", "hexLibraries/gridHexagonConstants"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var spriteManager_1, assetManager_1, gridHexagonConstants_5, ClientSpriteManager, ClientBaseSprite, ClientSixDirectionSprite, ClientStationarySprite, ClientHeliSprite, ClientMainBaseSprite;
    return {
        setters: [
            function (spriteManager_1_1) {
                spriteManager_1 = spriteManager_1_1;
            },
            function (assetManager_1_1) {
                assetManager_1 = assetManager_1_1;
            },
            function (gridHexagonConstants_5_1) {
                gridHexagonConstants_5 = gridHexagonConstants_5_1;
            }
        ],
        execute: function () {
            ClientSpriteManager = (function (_super) {
                __extends(ClientSpriteManager, _super);
                function ClientSpriteManager(clientHexBoard) {
                    var _this = _super.call(this) || this;
                    _this.clientHexBoard = clientHexBoard;
                    return _this;
                }
                ClientSpriteManager.prototype.addSprite = function (sprite) {
                    _super.prototype.addSprite.call(this, sprite);
                    sprite.clientHexBoard = this.clientHexBoard;
                };
                ClientSpriteManager.prototype.draw = function (context) {
                    for (var i = 0; i < this.sprites.length; i++) {
                        var sprite = this.sprites[i];
                        if (sprite.tile == null && sprite.shouldDraw()) {
                            sprite.draw(context);
                        }
                    }
                };
                ClientSpriteManager.prototype.tick = function () {
                    _super.prototype.tick.call(this);
                };
                return ClientSpriteManager;
            }(spriteManager_1.SpriteManager));
            exports_12("ClientSpriteManager", ClientSpriteManager);
            ClientBaseSprite = (function (_super) {
                __extends(ClientBaseSprite, _super);
                function ClientBaseSprite(clientSpriteManager, totalFrames, animationSpeed) {
                    var _this = _super.call(this, clientSpriteManager) || this;
                    _this.animationFrame = 0;
                    _this._drawTickNumber = (Math.random() * 1000) | 0;
                    _this.animationSpeed = animationSpeed;
                    _this.totalFrames = totalFrames;
                    return _this;
                }
                ClientBaseSprite.prototype.draw = function (context) {
                    this._drawTickNumber++;
                    if (this._drawTickNumber % this.animationSpeed === 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
                    }
                };
                ClientBaseSprite.prototype.shouldDraw = function () {
                    var x = this.x;
                    var y = this.y;
                    var viewPort = this.clientHexBoard.viewPort;
                    return x > viewPort.x - viewPort.padding &&
                        x < viewPort.x + viewPort.width + viewPort.padding &&
                        y > viewPort.y - viewPort.padding &&
                        y < viewPort.y + viewPort.height + viewPort.padding;
                };
                return ClientBaseSprite;
            }(spriteManager_1.Sprite));
            exports_12("ClientBaseSprite", ClientBaseSprite);
            ClientSixDirectionSprite = (function (_super) {
                __extends(ClientSixDirectionSprite, _super);
                function ClientSixDirectionSprite() {
                    var _this = _super.apply(this, arguments) || this;
                    _this.currentDirection = (Math.random() * 6) | 0;
                    return _this;
                }
                ClientSixDirectionSprite.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.y);
                    var assetName = this.key + '.' + this.currentDirectionToSpriteName();
                    var asset = assetManager_1.AssetManager.assets[assetName];
                    var image = asset.images[this.animationFrame];
                    context.drawImage(image, -asset.base.x, -asset.base.y - this.hoverY() - gridHexagonConstants_5.GridHexagonConstants.depthHeight() / 2);
                    context.restore();
                };
                ClientSixDirectionSprite.prototype.currentDirectionToSpriteName = function () {
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
                ClientSixDirectionSprite.prototype.hoverY = function () {
                    return (Math.sin(this._drawTickNumber / 10)) * 12 - 6;
                };
                return ClientSixDirectionSprite;
            }(ClientBaseSprite));
            exports_12("ClientSixDirectionSprite", ClientSixDirectionSprite);
            ClientStationarySprite = (function (_super) {
                __extends(ClientStationarySprite, _super);
                function ClientStationarySprite() {
                    return _super.apply(this, arguments) || this;
                }
                ClientStationarySprite.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.y);
                    var assetName = this.key;
                    var asset = assetManager_1.AssetManager.assets[assetName];
                    var image = asset.image || asset.images[this.animationFrame];
                    context.drawImage(image, -asset.base.x, -asset.base.y - gridHexagonConstants_5.GridHexagonConstants.depthHeight() / 2);
                    context.restore();
                };
                return ClientStationarySprite;
            }(ClientBaseSprite));
            exports_12("ClientStationarySprite", ClientStationarySprite);
            ClientHeliSprite = (function (_super) {
                __extends(ClientHeliSprite, _super);
                function ClientHeliSprite(clientSpriteManager) {
                    var _this = _super.call(this, clientSpriteManager, 2, 10) || this;
                    _this.key = 'Heli';
                    return _this;
                }
                return ClientHeliSprite;
            }(ClientSixDirectionSprite));
            exports_12("ClientHeliSprite", ClientHeliSprite);
            ClientMainBaseSprite = (function (_super) {
                __extends(ClientMainBaseSprite, _super);
                function ClientMainBaseSprite(clientSpriteManager) {
                    var _this = _super.call(this, clientSpriteManager, 0, 0) || this;
                    _this.key = 'MainBase';
                    return _this;
                }
                return ClientMainBaseSprite;
            }(ClientStationarySprite));
            exports_12("ClientMainBaseSprite", ClientMainBaseSprite);
        }
    };
});
System.register("hexLibraries/menuManager", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
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
            exports_13("MenuManager", MenuManager);
        }
    };
});
System.register("clientGameManager", ["utils/drawingUtilities", "hexLibraries/menuManager", "hexLibraries/hexUtils", "hexLibraries/clientHexBoard"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var drawingUtilities_3, menuManager_1, hexUtils_2, clientHexBoard_1, ClientGameManager;
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
            function (clientHexBoard_1_1) {
                clientHexBoard_1 = clientHexBoard_1_1;
            }
        ],
        execute: function () {
            ClientGameManager = (function () {
                function ClientGameManager() {
                    var _this = this;
                    this.swipeVelocity = { x: 0, y: 0 };
                    this.tapStart = { x: 0, y: 0 };
                    this.drawIndex = 0;
                    this.fpsMeter = new window.FPSMeter(document.body, {
                        right: '5px',
                        left: 'auto',
                        heat: 1
                    });
                    this.hexBoard = new clientHexBoard_1.ClientHexBoard();
                    this.canvas = document.getElementById("hex");
                    this.context = this.canvas.getContext("2d");
                    var menu = document.getElementById("menu");
                    this.menuManager = new menuManager_1.MenuManager(menu);
                    var overlay = document.getElementById("overlay");
                    var mc = new Hammer.Manager(overlay);
                    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
                    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
                    mc.add(new Hammer.Tap());
                    overlay.onmousemove = function (ev) {
                        var x = ev.pageX;
                        var y = ev.pageY;
                        // this.tapHex(x, y);
                    };
                    window.onresize = function () {
                        _this.canvas.width = document.body.clientWidth;
                        _this.canvas.height = document.body.clientHeight;
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
                    fetch('http://localhost:3568/api/game/state', {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(function (response) {
                        response.json()
                            .then(function (data) {
                            debugger;
                            _this.hexBoard.initialize(data.data.state);
                        });
                    })
                        .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });
                }
                ClientGameManager.prototype.startAction = function (item) {
                    var radius = 5;
                    var spots = this.findAvailableSpots(radius, item);
                    for (var i = 0; i < spots.length; i++) {
                        var spot = spots[i];
                        var sprites = this.hexBoard.clientSpriteManager.spritesMap[spot.x + spot.z * 5000];
                        if (spot == item || (sprites && sprites.length > 0))
                            continue;
                        var path = this.hexBoard.pathFind(item, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            spot.setHighlight(ClientGameManager.moveHighlightColor);
                            spot.setHeightOffset(.25);
                        }
                    }
                };
                ClientGameManager.prototype.findAvailableSpots = function (radius, center) {
                    var items = [];
                    for (var q = 0; q < this.hexBoard.hexList.length; q++) {
                        var item = this.hexBoard.hexList[q];
                        if (hexUtils_2.HexUtils.distance(center, item) <= radius) {
                            items.push(item);
                        }
                    }
                    return items;
                };
                ClientGameManager.prototype.draw = function () {
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
                ClientGameManager.prototype.tick = function () {
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
                        this.hexBoard.offsetView(this.swipeVelocity.x, this.swipeVelocity.y);
                    }
                    this.hexBoard.clientSpriteManager.tick();
                };
                ClientGameManager.prototype.tapHex = function (x, y) {
                    var _this = this;
                    this.swipeVelocity.x = this.swipeVelocity.y = 0;
                    /* if (this.menuManager.tap(x, y)) {
                     return;
                     }
                     this.menuManager.closeMenu();*/
                    for (var i = 0; i < this.hexBoard.hexList.length; i++) {
                        var h = this.hexBoard.hexList[i];
                        h.setHighlight(null);
                        h.setHeightOffset(0);
                    }
                    var item = this.hexBoard.getHexAtPoint(x, y);
                    if (!item)
                        return;
                    if (this.selectedHex) {
                        var sprite_1 = this.hexBoard.clientSpriteManager.getSpritesAtTile(this.selectedHex)[0];
                        if (!sprite_1) {
                            this.selectedHex = null;
                            return;
                        }
                        debugger;
                        fetch('http://localhost:3568/api/game/vote', {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                unitId: sprite_1.id,
                                action: 'Move',
                                generation: 0,
                                x: item.x,
                                z: item.z
                            })
                        })
                            .then(function (response) {
                            response.text()
                                .then(function (data) {
                                console.log(JSON.parse(data));
                            });
                        })
                            .catch(function (err) {
                            console.log('Fetch Error :-S', err);
                        });
                        var path = this.hexBoard.pathFind(this.selectedHex, item);
                        var _loop_2 = function (i) {
                            var p = path[i];
                            var oldP = path[i - 1];
                            // var direction = HexUtils.getDirection(oldP,p);
                            // sprite.currentDirection = direction;
                            setTimeout(function () {
                                sprite_1.currentDirection = hexUtils_2.HexUtils.getDirection(oldP, p);
                                sprite_1.setTile(_this.hexBoard.getHexAtSpot(p.x, p.y, p.z));
                            }, i * 500);
                        };
                        for (var i = 1; i < path.length; i++) {
                            _loop_2(i);
                        }
                        this.selectedHex = null;
                        return;
                    }
                    this.selectedHex = item;
                    var sprites = this.hexBoard.clientSpriteManager.getSpritesAtTile(item);
                    if (sprites && sprites.length > 0) {
                        var sprite = sprites[0];
                        item.setHighlight(ClientGameManager.selectedHighlightColor);
                        item.setHeightOffset(.25);
                        this.startAction(item);
                    }
                    /*
                     this.menuManager.openMenu([
                     {image: AssetManager.instance.assets['Icon.Move'].image, action: 'Move'},
                     {image: AssetManager.instance.assets['Icon.Attack'].image, action: 'Attack'}
                     ],
                     new Point(x, y),
                     (selectedItem) => {
                     item.setHighlight(ClientGameManager.selectedHighlightColor);
                     this.menuManager.closeMenu();
                     this.startAction(item);
                     currentState = 'highlighting';
                     });
                     */
                };
                return ClientGameManager;
            }());
            ClientGameManager.baseColor = new drawingUtilities_3.HexagonColor('#FFFFFF');
            ClientGameManager.highlightColor = new drawingUtilities_3.HexagonColor('#00F9FF');
            ClientGameManager.selectedHighlightColor = new drawingUtilities_3.HexagonColor('#6B90FF');
            ClientGameManager.moveHighlightColor = new drawingUtilities_3.HexagonColor('#BE9EFF');
            ClientGameManager.attackHighlightColor = new drawingUtilities_3.HexagonColor('#91F9CF');
            exports_14("ClientGameManager", ClientGameManager);
        }
    };
});
/// <reference path="./typings/Compress.d.ts" />
/// <reference path="./node_modules/@types/core-js/index.d.ts" />
/// <reference path="./node_modules/@types/whatwg-fetch/index.d.ts" />
System.register("main", ["hexLibraries/AssetManager", "clientGameManager"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var AssetManager_2, clientGameManager_1, ClientMain;
    return {
        setters: [
            function (AssetManager_2_1) {
                AssetManager_2 = AssetManager_2_1;
            },
            function (clientGameManager_1_1) {
                clientGameManager_1 = clientGameManager_1_1;
            }
        ],
        execute: function () {/// <reference path="./typings/Compress.d.ts" />
            /// <reference path="./node_modules/@types/core-js/index.d.ts" />
            /// <reference path="./node_modules/@types/whatwg-fetch/index.d.ts" />
            ClientMain = (function () {
                function ClientMain() {
                }
                ClientMain.run = function () {
                    this.loadAssets(function () {
                        new clientGameManager_1.ClientGameManager();
                    });
                };
                ClientMain.loadAssets = function (onComplete) {
                    AssetManager_2.AssetManager.completed = onComplete;
                    var size = { width: 80, height: 80 };
                    var base = { x: 40, y: 55 };
                    AssetManager_2.AssetManager.addAsset('Infantry', 'images/tower_10.png', size, base);
                    AssetManager_2.AssetManager.addAsset('Tank', 'images/tower_40.png', size, base);
                    AssetManager_2.AssetManager.addAsset('Base', 'images/tower_42.png', size, base);
                    AssetManager_2.AssetManager.addAsset('MainBase', 'images/tower_42.png', size, base);
                    AssetManager_2.AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
                    AssetManager_2.AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);
                    AssetManager_2.AssetManager.addAsset('tile', 'images/tile.png', size, base);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.TopLeft', 0, 'images/heli/top_left_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.TopLeft', 1, 'images/heli/top_left_2.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.TopRight', 0, 'images/heli/top_right_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.TopRight', 1, 'images/heli/top_right_2.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.BottomLeft', 0, 'images/heli/bottom_left_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.BottomLeft', 1, 'images/heli/bottom_left_2.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.BottomRight', 0, 'images/heli/bottom_right_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.BottomRight', 1, 'images/heli/bottom_right_2.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.Bottom', 0, 'images/heli/down_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.Bottom', 1, 'images/heli/down_2.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.Top', 0, 'images/heli/up_1.png', null, null);
                    AssetManager_2.AssetManager.addAssetFrame('Heli.Top', 1, 'images/heli/up_2.png', null, null);
                    AssetManager_2.AssetManager.start();
                };
                return ClientMain;
            }());
            exports_15("ClientMain", ClientMain);
            ClientMain.run();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy9oZXhMaWJyYXJpZXMvQXNzZXRNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy50cyIsIi4uL2NvbXBvbmVudHMvaGV4TGlicmFyaWVzL2dyaWRIZXhhZ29uQ29uc3RhbnRzLnRzIiwiLi4vY29tcG9uZW50cy9ncmlkSGV4YWdvbi50cyIsIi4uL2NvbXBvbmVudHMvc3ByaXRlTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvZHJhd2luZ1V0aWxpdGllcy50cyIsIi4uL2NvbXBvbmVudHMvaGV4TGlicmFyaWVzL2hleFV0aWxzLnRzIiwiLi4vY29tcG9uZW50cy9oZXhCb2FyZC50cyIsIi4uL2NvbXBvbmVudHMvbW9kZWxzL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9oZXhMaWJyYXJpZXMvY2xpZW50R3JpZEhleGFnb24udHMiLCIuLi9jb21wb25lbnRzL2hleExpYnJhcmllcy9jbGllbnRIZXhCb2FyZC50cyIsIi4uL2NvbXBvbmVudHMvY2xpZW50U3ByaXRlTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvaGV4TGlicmFyaWVzL21lbnVNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9jbGllbnRHYW1lTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7WUFlQTtnQkFBQTtnQkFzRUEsQ0FBQztnQkE5RFUsa0JBQUssR0FBWjtvQkFBQSxpQkFhQzs0Q0FaYyxNQUFJO3dCQUNYLEVBQUUsQ0FBQyxDQUFDLE9BQUssVUFBVSxDQUFDLGNBQWMsQ0FBQyxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZDLElBQU0sS0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7NEJBRXhCLEtBQUcsQ0FBQyxNQUFNLEdBQUc7Z0NBQ1QsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFH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Q2hCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWhCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWhCLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7b0JBQ25CLElBQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELElBQUk7d0JBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDM0MsQ0FBQztnQkFFTSxnQkFBTyxHQUFkLFVBQWUsSUFBSSxFQUFFLFFBQVE7b0JBQ3pCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25DLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxDQUFD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QUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMvQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNuRCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFFL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFD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