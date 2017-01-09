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
System.register("game/AssetManager", [], function (exports_1, context_1) {
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
System.register("utils/utils", [], function (exports_2, context_2) {
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
System.register("utils/color", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("Color", Color);
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
            exports_4("ColorUtils", ColorUtils);
        }
    };
});
System.register("utils/hexagonColorUtils", ["utils/drawingUtilities", "utils/color"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var drawingUtilities_1, color_1, HexagonColorUtils;
    return {
        setters: [
            function (drawingUtilities_1_1) {
                drawingUtilities_1 = drawingUtilities_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            HexagonColorUtils = (function () {
                function HexagonColorUtils() {
                }
                HexagonColorUtils.setupColors = function () {
                    this.baseColors = [new drawingUtilities_1.HexagonColor('#AFFFFF')];
                    for (var i = 0; i < 6; i++) {
                        this.baseColors.push(new drawingUtilities_1.HexagonColor(drawingUtilities_1.DrawingUtils.colorLuminance('#AFF000', (i / 6))));
                    }
                    this.factionColors = ["#444EF0", "#D24257", "#009900"];
                    this.factionHexColors = [];
                    this.voteColor = [];
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#cffffd"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#7bfffd"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#13dfff"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#1bc1ff"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#63b2ff"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#a3a0ff"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#b66aff"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#ffb0ec"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#ffcd68"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#FF6638"));
                    this.voteColor.push(new drawingUtilities_1.HexagonColor("#FF0000"));
                    for (var f = 0; f < this.factionColors.length; f++) {
                        this.factionHexColors[f] = [];
                        for (var i = 0; i < this.baseColors.length; i++) {
                            this.factionHexColors[f].push(new drawingUtilities_1.HexagonColor(color_1.ColorUtils.blend_colors(this.baseColors[i].color, drawingUtilities_1.DrawingUtils.colorLuminance(this.factionColors[f], i == 0 ? 1 : ((i - 1) / 6)), 1)));
                        }
                    }
                };
                return HexagonColorUtils;
            }());
            HexagonColorUtils.entityHexColor = new drawingUtilities_1.HexagonColor("#FCFCFC");
            HexagonColorUtils.baseColor = new drawingUtilities_1.HexagonColor('#FFFFFF');
            HexagonColorUtils.highlightColor = new drawingUtilities_1.HexagonColor('#00F9FF');
            HexagonColorUtils.selectedHighlightColor = new drawingUtilities_1.HexagonColor('#6B90FF');
            HexagonColorUtils.moveHighlightColor = new drawingUtilities_1.HexagonColor('#BE9EFF');
            HexagonColorUtils.attackHighlightColor = new drawingUtilities_1.HexagonColor('#91F9CF');
            HexagonColorUtils.miniBaseColor = new drawingUtilities_1.HexagonColor('#DCDCDC');
            exports_5("HexagonColorUtils", HexagonColorUtils);
        }
    };
});
///<reference path="../typings/path2d.d.ts"/>
System.register("game/gridHexagon", ["utils/drawingUtilities", "game/gridHexagonConstants", "utils/hexagonColorUtils"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var drawingUtilities_2, gridHexagonConstants_1, hexagonColorUtils_1, GridHexagon;
    return {
        setters: [
            function (drawingUtilities_2_1) {
                drawingUtilities_2 = drawingUtilities_2_1;
            },
            function (gridHexagonConstants_1_1) {
                gridHexagonConstants_1 = gridHexagonConstants_1_1;
            },
            function (hexagonColorUtils_1_1) {
                hexagonColorUtils_1 = hexagonColorUtils_1_1;
            }
        ],
        execute: function () {///<reference path="../typings/path2d.d.ts"/>
            GridHexagon = (function () {
                function GridHexagon() {
                    this.topPath = null;
                    this.topPathInner = null;
                    this.leftDepthPath = null;
                    this.bottomDepthPath = null;
                    this.rightDepthPath = null;
                    this.topMiniPath = null;
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    this.height = 0;
                    this.heightOffset = 0;
                    this.faction = 0;
                    this.entities = [];
                    this.showVotes = true;
                    this._realX = undefined;
                    this._realZ = undefined;
                }
                GridHexagon.prototype.getRealX = function () {
                    if (this._realX !== undefined) {
                        return this._realX;
                    }
                    return this._realX = (gridHexagonConstants_1.GridHexagonConstants.width * 3 / 4 * this.x);
                };
                GridHexagon.prototype.getRealZ = function () {
                    if (this._realZ !== undefined) {
                        return this._realZ;
                    }
                    var height = gridHexagonConstants_1.GridHexagonConstants.height();
                    return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
                        - this.getDepthHeight(true)
                        + this.y * gridHexagonConstants_1.GridHexagonConstants.depthHeight();
                };
                GridHexagon.prototype.getRealMiniX = function () {
                    return (gridHexagonConstants_1.GridMiniHexagonConstants.width * 3 / 4 * this.x);
                };
                GridHexagon.prototype.getRealMiniZ = function () {
                    var height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
                    return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
                        + this.y * 0;
                };
                GridHexagon.prototype.getDepthHeight = function (position) {
                    if (position)
                        return Math.max(1, (this.height + this.heightOffset) * (gridHexagonConstants_1.GridHexagonConstants.depthHeight() - 2));
                    return gridHexagonConstants_1.GridHexagonConstants.depthHeight();
                };
                GridHexagon.prototype.getEntities = function () {
                    return this.entities;
                };
                GridHexagon.prototype.hasEntities = function () {
                    return this.entities && this.entities.length > 0;
                };
                GridHexagon.prototype.getEntityById = function (id) {
                    return this.entities.filter(function (a) { return a.id == id; })[0];
                };
                GridHexagon.prototype.addEntity = function (entity) {
                    this.entities.push(entity);
                    this.invalidateColor();
                };
                GridHexagon.prototype.removeEntity = function (entity) {
                    this.entities.splice(this.entities.indexOf(entity), 1);
                    this.invalidateColor();
                };
                GridHexagon.prototype.setBaseColor = function (baseColor) {
                    this.baseColor = baseColor;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setFaction = function (faction) {
                    this.faction = faction;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setHighlightColor = function (highlightColor) {
                    this.highlightColor = highlightColor;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setVoteColor = function (voteColor) {
                    this.voteColor = voteColor;
                    this.invalidateColor();
                };
                GridHexagon.prototype.clearVoteColor = function () {
                    this.voteColor = null;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setSecondaryVoteColor = function (voteColor) {
                    this.secondaryVoteColor = voteColor;
                    this.invalidateColor();
                };
                GridHexagon.prototype.clearSecondaryVoteColor = function () {
                    this.secondaryVoteColor = null;
                    this.invalidateColor();
                };
                GridHexagon.prototype.clearHighlightColor = function () {
                    this.highlightColor = null;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setTexture = function (textureTop, textureLeft, textureBottom, textureRight) {
                    this.textureTop = textureTop;
                    this.textureLeft = textureLeft;
                    this.textureBottom = textureBottom;
                    this.textureRight = textureRight;
                    this.invalidateColor();
                };
                GridHexagon.prototype.setHeightOffset = function (heightOffset) {
                    if (this.heightOffset != heightOffset) {
                        this.heightOffset = heightOffset;
                        this.buildPaths();
                        this.buildMiniPaths();
                    }
                };
                GridHexagon.prototype.buildPaths = function () {
                    var depthHeight = this.getDepthHeight(false);
                    this.topPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                    this.leftDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
                    this.bottomDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
                    this.rightDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
                };
                GridHexagon.prototype.buildMiniPaths = function () {
                    this.topMiniPath = GridHexagon.buildPath(gridHexagonConstants_1.GridMiniHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                };
                GridHexagon.prototype.invalidateColor = function () {
                    var entityColor = (this.entities.length > 0 && hexagonColorUtils_1.HexagonColorUtils.entityHexColor);
                    var voteColor = this.voteColor;
                    var secondaryVoteColor = this.secondaryVoteColor;
                    var highlightColor = this.highlightColor;
                    var factionColor = (this.faction > 0 && hexagonColorUtils_1.HexagonColorUtils.factionHexColors[this.faction - 1][this.height]);
                    var baseColor = (this.baseColor && this.baseColor[this.height]);
                    this.currentDrawColorNoVote = factionColor || baseColor;
                    this.currentDrawColor = voteColor || secondaryVoteColor || entityColor || highlightColor || factionColor || baseColor;
                    this.currentFactionColor = factionColor || baseColor;
                    this.currentMiniColor = voteColor || entityColor || factionColor || baseColor;
                    if (this.currentDrawColor && this.textureTop) {
                        this.drawCache = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                        this.drawCacheNoVote = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColorNoVote, this.textureTop.name);
                        this.drawMiniCache = GridHexagon.getMiniCacheImage(this.currentMiniColor);
                    }
                };
                GridHexagon.prototype.drawLeftDepth = function (context, color) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.leftDepthPath);
                        context.fillStyle = context.createPattern(this.textureLeft.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_2.DrawingUtils.makeTransparent(color.dark1, .75);
                        context.fill(this.leftDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = color.dark1;
                    context.stroke(this.leftDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawBottomDepth = function (context, color) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.bottomDepthPath);
                        context.fillStyle = context.createPattern(this.textureBottom.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_2.DrawingUtils.makeTransparent(color.dark2, .75);
                        context.fill(this.bottomDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = color.dark2;
                    context.stroke(this.bottomDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawRightDepth = function (context, color) {
                    context.save();
                    context.save();
                    {
                        context.clip(this.rightDepthPath);
                        context.fillStyle = context.createPattern(this.textureRight.image, 'repeat');
                        context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width * 2, gridHexagonConstants_1.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_2.DrawingUtils.makeTransparent(color.dark3, .75);
                        context.fill(this.rightDepthPath);
                    }
                    context.restore();
                    context.lineWidth = 1;
                    context.strokeStyle = color.dark3;
                    context.stroke(this.rightDepthPath);
                    context.restore();
                };
                GridHexagon.prototype.drawTop = function (context, color) {
                    context.save();
                    {
                        context.save();
                        {
                            context.clip(this.topPath);
                            context.fillStyle = context.createPattern(this.textureTop.image, 'repeat');
                            context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width, gridHexagonConstants_1.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_2.DrawingUtils.makeTransparent(color.color, 0.6);
                            context.fill(this.topPath);
                        }
                        context.restore();
                        context.strokeStyle = color.darkBorder;
                        context.stroke(this.topPath);
                    }
                    context.restore();
                };
                GridHexagon.prototype.drawTopMini = function (context) {
                    var color = this.currentMiniColor.color;
                    context.fillStyle = color;
                    context.fill(this.topMiniPath);
                    /*        context.lineWidth = 3;
                     context.strokeStyle = color;
                     context.stroke(this.topMiniPath);*/
                };
                GridHexagon.prototype.envelope = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_1.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_1.GridHexagonConstants.height();
                    size.height += this.getDepthHeight(false);
                    size.width += 12;
                    size.height += 6;
                    return size;
                };
                GridHexagon.prototype.envelopeMini = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_1.GridMiniHexagonConstants.width;
                    size.height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
                    size.width += 20;
                    size.height += 20;
                    return size;
                };
                GridHexagon.prototype.draw = function (context, offsetX, offsetY) {
                    if (this.showVotes) {
                        if (this.drawCache) {
                            context.drawImage(this.drawCache, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
                        }
                        else {
                            var cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                            if (cacheImage) {
                                this.drawCache = cacheImage;
                            }
                            else {
                                this.drawCache = this.prepDraw(this.currentDrawColor);
                            }
                            this.draw(context, offsetX, offsetY);
                        }
                    }
                    else {
                        if (this.drawCacheNoVote) {
                            context.drawImage(this.drawCacheNoVote, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
                        }
                        else {
                            var cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                            if (cacheImage) {
                                this.drawCacheNoVote = cacheImage;
                            }
                            else {
                                this.drawCacheNoVote = this.prepDraw(this.currentDrawColorNoVote);
                            }
                            this.draw(context, offsetX, offsetY);
                        }
                    }
                };
                GridHexagon.prototype.drawMini = function (context, offsetX, offsetY) {
                    if (this.drawMiniCache) {
                        context.drawImage(this.drawMiniCache, offsetX - GridHexagon.hexCenterMini.x, offsetY - GridHexagon.hexCenterMini.y);
                    }
                    else {
                        var miniCacheImage = GridHexagon.getMiniCacheImage(this.currentMiniColor);
                        if (miniCacheImage) {
                            this.drawMiniCache = miniCacheImage;
                        }
                        else {
                            this.prepMiniDraw();
                        }
                        this.drawMini(context, offsetX, offsetY);
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
                GridHexagon.getMiniCacheImage = function (hexColor) {
                    var c = "m" + hexColor.color;
                    return GridHexagon.caches[c];
                };
                GridHexagon.setMiniCacheImage = function (hexColor, img) {
                    var c = "m" + hexColor.color;
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
                GridHexagon.prototype.prepDraw = function (color) {
                    var can = document.createElement('canvas');
                    var ctx = can.getContext('2d');
                    var size = this.envelope();
                    can.width = size.width;
                    can.height = size.height;
                    ctx.save();
                    ctx.translate(GridHexagon.hexCenter.x, GridHexagon.hexCenter.y);
                    if (this.getDepthHeight(false) > 1) {
                        this.drawLeftDepth(ctx, color);
                        this.drawBottomDepth(ctx, color);
                        this.drawRightDepth(ctx, color);
                    }
                    ctx.save();
                    ctx.lineWidth = 1;
                    //ctx.lineCap = "round";
                    //ctx.lineJoin = "round";
                    this.drawTop(ctx, color);
                    ctx.restore();
                    ctx.restore();
                    GridHexagon.setCacheImage(this.getDepthHeight(false), color, this.textureTop.name, can);
                    return can;
                };
                GridHexagon.prototype.prepMiniDraw = function () {
                    var can = document.createElement('canvas');
                    var ctx = can.getContext('2d');
                    var size = this.envelopeMini();
                    can.width = size.width;
                    can.height = size.height;
                    ctx.save();
                    ctx.translate(GridHexagon.hexCenterMini.x, GridHexagon.hexCenterMini.y);
                    this.drawTopMini(ctx);
                    ctx.restore();
                    GridHexagon.setMiniCacheImage(this.currentMiniColor, can);
                    this.drawMiniCache = can;
                    /*       ctx.strokeStyle='black';
                     ctx.lineWidth=1;
                     ctx.strokeRect(0,0,can.width,can.height);*/
                    return can;
                };
                GridHexagon.prototype.shouldDraw = function (viewPort) {
                    var x = this.getRealX();
                    var y = this.getRealZ();
                    var x2 = viewPort.x;
                    var padding = viewPort.padding;
                    var y2 = viewPort.y;
                    var width = viewPort.width;
                    return x > x2 - padding &&
                        x < x2 + width + padding &&
                        y > y2 - padding &&
                        y < y2 + viewPort.height + padding;
                };
                GridHexagon.prototype.setShowVotes = function (showVotes) {
                    this.showVotes = showVotes;
                };
                return GridHexagon;
            }());
            GridHexagon.hexCenter = { x: (gridHexagonConstants_1.GridHexagonConstants.width / 2 + 6), y: (gridHexagonConstants_1.GridHexagonConstants.height() / 2 + 6) };
            GridHexagon.hexCenterMini = {
                x: (gridHexagonConstants_1.GridMiniHexagonConstants.width / 2 + 6),
                y: (gridHexagonConstants_1.GridMiniHexagonConstants.height() / 2 + 6)
            };
            GridHexagon.caches = {};
            exports_6("GridHexagon", GridHexagon);
        }
    };
});
System.register("game/gridHexagonConstants", ["utils/utils"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var utils_1, GridHexagonConstants, GridMiniHexagonConstants;
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
                    return Math.sqrt(3) / 2 * this.width * this.heightSkew;
                };
                GridHexagonConstants.depthHeight = function () {
                    return this.height() * this.depthHeightSkew;
                };
                ;
                GridHexagonConstants.hexagonTopPolygon = function () {
                    return [new utils_1.Point(-this.width / 2, 0), new utils_1.Point(-this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 2, 0), new utils_1.Point(this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 2, 0)];
                };
                ;
                GridHexagonConstants.hexagonDepthLeftPolygon = function (depthHeight) {
                    return [new utils_1.Point(-this.width / 2, 0), new utils_1.Point(-this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight), new utils_1.Point(-this.width / 2, depthHeight), new utils_1.Point(-this.width / 2, 0)];
                };
                ;
                GridHexagonConstants.hexagonDepthBottomPolygon = function (depthHeight) {
                    return [new utils_1.Point(-this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2)];
                };
                ;
                GridHexagonConstants.hexagonDepthRightPolygon = function (depthHeight) {
                    return [new utils_1.Point(this.width / 4, this.height() / 2), new utils_1.Point(this.width / 2, 0), new utils_1.Point(this.width / 2, depthHeight), new utils_1.Point(this.width / 4, depthHeight + this.height() / 2), new utils_1.Point(this.width / 4, this.height() / 2)];
                };
                ;
                return GridHexagonConstants;
            }());
            GridHexagonConstants.width = 50;
            GridHexagonConstants.heightSkew = .7;
            GridHexagonConstants.depthHeightSkew = .3;
            exports_7("GridHexagonConstants", GridHexagonConstants);
            GridMiniHexagonConstants = (function () {
                function GridMiniHexagonConstants() {
                }
                GridMiniHexagonConstants.height = function () {
                    return Math.sqrt(3) / 2 * this.width * this.heightSkew;
                };
                GridMiniHexagonConstants.hexagonTopPolygon = function () {
                    return [new utils_1.Point(-this.width / 2, 0), new utils_1.Point(-this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 2, 0), new utils_1.Point(this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 2, 0)];
                };
                ;
                return GridMiniHexagonConstants;
            }());
            GridMiniHexagonConstants.width = 10;
            GridMiniHexagonConstants.heightSkew = 0.7;
            exports_7("GridMiniHexagonConstants", GridMiniHexagonConstants);
            /*
            setTimeout(() => {
            
                document.getElementById('ranger').oninput = () => {
                    var ranger = document.getElementById('ranger');
                    this.width = ranger.value;
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
        this.width = ranger.value;
        GridHexagon.caches = {};
        for (var i = 0; i < Main.gameManager.hexBoard.hexList.length; i++) {
            var hex = Main.gameManager.hexBoard.hexList[i];
            hex. buildPaths();
            hex.drawCache = null;
        }
    };
}, 100)*/
System.register("game/hexUtils", [], function (exports_8, context_8) {
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
                Direction[Direction["Top"] = 0] = "Top";
                Direction[Direction["TopRight"] = 1] = "TopRight";
                Direction[Direction["BottomRight"] = 2] = "BottomRight";
                Direction[Direction["Bottom"] = 3] = "Bottom";
                Direction[Direction["BottomLeft"] = 4] = "BottomLeft";
                Direction[Direction["TopLeft"] = 5] = "TopLeft";
            })(Direction || (Direction = {}));
            exports_8("Direction", Direction);
        }
    };
});
System.register("models/hexBoard", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("game/hexBoard", ["game/gridHexagonConstants", "game/gridHexagon", "entities/entityManager", "game/hexUtils", "game/AssetManager", "utils/hexagonColorUtils"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var gridHexagonConstants_2, gridHexagon_1, entityManager_1, hexUtils_1, assetManager_1, hexagonColorUtils_2, HexBoard;
    return {
        setters: [
            function (gridHexagonConstants_2_1) {
                gridHexagonConstants_2 = gridHexagonConstants_2_1;
            },
            function (gridHexagon_1_1) {
                gridHexagon_1 = gridHexagon_1_1;
            },
            function (entityManager_1_1) {
                entityManager_1 = entityManager_1_1;
            },
            function (hexUtils_1_1) {
                hexUtils_1 = hexUtils_1_1;
            },
            function (assetManager_1_1) {
                assetManager_1 = assetManager_1_1;
            },
            function (hexagonColorUtils_2_1) {
                hexagonColorUtils_2 = hexagonColorUtils_2_1;
            }
        ],
        execute: function () {
            HexBoard = (function () {
                function HexBoard() {
                    this.hexList = [];
                    this.hexBlock = {};
                    this.boardSize = { width: 0, height: 0 };
                    this.generation = -1;
                    this.entityManager = new entityManager_1.EntityManager(this);
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
                HexBoard.prototype.gameDimensionsMini = function () {
                    var size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_2.GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_2.GridMiniHexagonConstants.height() * this.boardSize.height;
                    return size;
                };
                HexBoard.prototype.addHexagon = function (hexagon) {
                    this.hexList.push(hexagon);
                    this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
                };
                HexBoard.prototype.reorderHexList = function () {
                    var hx = this.hexList.sort(function (a, b) { return a.height - b.height; });
                    var curHeight = 0;
                    var hx_h = [];
                    var c_h = [];
                    for (var t = 0; t < hx.length; t++) {
                        var hex = this.hexList[t];
                        if (hex.height != curHeight) {
                            curHeight = hex.height;
                            hx_h.push(c_h);
                            c_h = [];
                        }
                        c_h.push(hex);
                    }
                    hx_h.push(c_h);
                    for (var i = 0; i < hx_h.length; i++) {
                        hx_h[i] = hexUtils_1.HexUtils.orderBy(hx_h[i], function (m) { return (m.z) * 1000 + (m.x % 2) * -200; });
                    }
                    console.log('----');
                    this.hexList = [];
                    this.hexListHeightMap = [];
                    for (var i = 0; i < hx_h.length; i++) {
                        var h = hx_h[i];
                        console.log(h.length);
                        this.hexListHeightMap[i] = h;
                        (_a = this.hexList).push.apply(_a, h);
                    }
                    var _a;
                    // this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200 + m.height);
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
                HexBoard.prototype.initialize = function (state) {
                    this.generation = state.generation;
                    var terrain = state.terrain;
                    var str = terrain.boardStr;
                    this.setSize(terrain.width, terrain.height);
                    var stoneTop = assetManager_1.AssetManager.assets['Stone.Top'];
                    var stoneLeft = assetManager_1.AssetManager.assets['Stone.Left'];
                    var stoneBottom = assetManager_1.AssetManager.assets['Stone.Bottom'];
                    var stoneRight = assetManager_1.AssetManager.assets['Stone.Right'];
                    var grassTop = assetManager_1.AssetManager.assets['Grass.Top'];
                    var grassLeft = assetManager_1.AssetManager.assets['Grass.Left'];
                    var grassBottom = assetManager_1.AssetManager.assets['Grass.Bottom'];
                    var grassRight = assetManager_1.AssetManager.assets['Grass.Right'];
                    var waterTop = assetManager_1.AssetManager.assets['Water.Top'];
                    var waterLeft = assetManager_1.AssetManager.assets['Water.Left'];
                    var waterBottom = assetManager_1.AssetManager.assets['Water.Bottom'];
                    var waterRight = assetManager_1.AssetManager.assets['Water.Right'];
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
                            if (result == 0) {
                                gridHexagon.setTexture(waterTop, waterLeft, waterBottom, waterRight);
                            }
                            else if (result > 0 && result < 3) {
                                gridHexagon.setTexture(grassTop, grassLeft, grassBottom, grassRight);
                            }
                            else {
                                gridHexagon.setTexture(stoneTop, stoneLeft, stoneBottom, stoneRight);
                            }
                            gridHexagon.setBaseColor(hexagonColorUtils_2.HexagonColorUtils.baseColors);
                            gridHexagon.buildPaths();
                            gridHexagon.buildMiniPaths();
                            this.addHexagon(gridHexagon);
                        }
                    }
                    this.entityManager.empty();
                    this.reorderHexList();
                    this.updateFactionEntities(state);
                };
                HexBoard.prototype.updateFactionEntities = function (state) {
                    this.generation = state.generation;
                    var factionData = state.factionData;
                    var ys = factionData.split('|');
                    for (var z = 0; z < state.terrain.height; z++) {
                        var yItem = ys[z].split('');
                        for (var x = 0; x < state.terrain.width; x++) {
                            var faction = parseInt(yItem[x]);
                            var hex = this.getHexAtSpot(x, z);
                            hex.setFaction(faction);
                        }
                    }
                    /*
                     state.entities = [];
                     for (var i = 0; i < state.terrain.width - 10; i += 1) {
                     state.entities.push({
                     factionId: i % 3 + 1, health: 10,
                     x: 10 + i, z: state.terrain.height/4,
                     id: 'foo' + i,
                     entityType: "Plane"
                     });
                     }*/
                    for (var i = 0; i < state.entities.length; i++) {
                        var stateEntity = state.entities[i];
                        var entity = this.entityManager.getEntityById(stateEntity.id);
                        var gridHexagon = this.getHexAtSpot(stateEntity.x, stateEntity.z);
                        if (entity == null) {
                            switch (stateEntity.entityType) {
                                case "MainBase": {
                                    entity = new entityManager_1.MainBaseEntity(this.entityManager, stateEntity);
                                    break;
                                }
                                case "Base": {
                                    entity = new entityManager_1.RegularBaseEntity(this.entityManager, stateEntity);
                                    break;
                                }
                                case "Plane": {
                                    entity = new entityManager_1.HeliEntity(this.entityManager, stateEntity);
                                    entity.setDirection(stateEntity.direction);
                                    break;
                                }
                                case "Infantry": {
                                    entity = new entityManager_1.InfantryEntity(this.entityManager, stateEntity);
                                    entity.setDirection(stateEntity.direction);
                                    break;
                                }
                                case "Tank": {
                                    entity = new entityManager_1.TankEntity(this.entityManager, stateEntity);
                                    entity.setDirection(stateEntity.direction);
                                    break;
                                }
                            }
                            gridHexagon.setFaction(stateEntity.factionId);
                            entity.setId(stateEntity.id);
                            entity.setHealth(stateEntity.health);
                            entity.setTile(gridHexagon);
                            this.entityManager.addEntity(entity);
                        }
                        else {
                            entity.setHealth(stateEntity.health);
                            entity.setTile(gridHexagon);
                        }
                    }
                };
                HexBoard.prototype.drawBoard = function (context, viewPort) {
                    context.lineWidth = 1;
                    for (var j = 0; j < this.visibleHexListHeightMap.length; j++) {
                        var hexList = this.visibleHexListHeightMap[j];
                        var entList = this.visibleEntityHeightMap[j];
                        for (var i = 0; i < hexList.length; i++) {
                            var gridHexagon = hexList[i];
                            gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
                        }
                        for (var j_1 = 0; j_1 < entList.length; j_1++) {
                            entList[j_1].draw(context);
                        }
                    }
                };
                HexBoard.prototype.resetVisibleHexList = function (viewPort) {
                    var visibleHexList = new Array(10);
                    var visibleEntity = new Array(10);
                    for (var i = 0; i < 10; i++) {
                        visibleHexList[i] = [];
                        visibleEntity[i] = [];
                    }
                    for (var j = 0; j < this.hexListHeightMap.length; j++) {
                        var hexList = this.hexListHeightMap[j];
                        for (var i = 0; i < hexList.length; i++) {
                            var gridHexagon = hexList[i];
                            if (gridHexagon.shouldDraw(viewPort)) {
                                visibleHexList[j].push(gridHexagon);
                                var entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                                if (entities) {
                                    for (var c = 0; c < entities.length; c++) {
                                        visibleEntity[j + entities[c].getYOffset()].push(entities[c]);
                                    }
                                }
                            }
                        }
                    }
                    this.visibleHexListHeightMap = visibleHexList;
                    this.visibleEntityHeightMap = visibleEntity;
                };
                return HexBoard;
            }());
            exports_10("HexBoard", HexBoard);
        }
    };
});
System.register("animationManager", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var AnimationManager, AnimationFrameType;
    return {
        setters: [],
        execute: function () {
            AnimationManager = (function () {
                function AnimationManager(hexBoard) {
                    this.hexBoard = hexBoard;
                    this.frameIndex = 0;
                    this.isRunning = false;
                }
                AnimationManager.prototype.reset = function () {
                    this.frames = [];
                    this.frameIndex = 0;
                    this.isRunning = false;
                };
                AnimationManager.prototype.setVotes = function (votes) {
                    var allFrames = [];
                    var maxLength = 0;
                    for (var i = 0; i < votes.length; i++) {
                        var vote = votes[i];
                        var action = vote.action;
                        var entity = this.hexBoard.entityManager.getEntityById(action.entityId);
                        if (!entity) {
                            //idk
                            debugger;
                            continue;
                        }
                        var actionFrames = entity.getActionFrames(action, this.hexBoard);
                        if (actionFrames.length > maxLength) {
                            maxLength = actionFrames.length;
                        }
                        allFrames.push(actionFrames);
                    }
                    this.frames = [];
                    for (var c = 0; c < maxLength; c++) {
                        var frameCollection = [];
                        for (var i = 0; i < allFrames.length; i++) {
                            if (allFrames[i][c]) {
                                frameCollection.push(allFrames[i][c]);
                            }
                        }
                        this.frames.push(frameCollection);
                    }
                };
                AnimationManager.prototype.start = function () {
                    var _this = this;
                    this.isRunning = true;
                    var duration = 400;
                    var frames = this.frames[this.frameIndex++];
                    if (!frames) {
                        this.isRunning = false;
                        this.complete();
                        return;
                    }
                    for (var i = 0; i < frames.length; i++) {
                        var frame = frames[i];
                        frame.entity.onAnimationStart(frame);
                        frame.entity.executeFrame(this.hexBoard, frame, duration);
                    }
                    setTimeout(function () {
                        for (var i = 0; i < frames.length; i++) {
                            var frame = frames[i];
                            frame.entity.onAnimationComplete(frame);
                        }
                        _this.start();
                    }, duration);
                };
                AnimationManager.prototype.onComplete = function (callback) {
                    this.complete = callback;
                };
                return AnimationManager;
            }());
            exports_11("AnimationManager", AnimationManager);
            (function (AnimationFrameType) {
                AnimationFrameType[AnimationFrameType["Start"] = 0] = "Start";
                AnimationFrameType[AnimationFrameType["Move"] = 1] = "Move";
                AnimationFrameType[AnimationFrameType["Stop"] = 2] = "Stop";
                AnimationFrameType[AnimationFrameType["Attack"] = 3] = "Attack";
            })(AnimationFrameType || (AnimationFrameType = {}));
            exports_11("AnimationFrameType", AnimationFrameType);
        }
    };
});
System.register("utils/help", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Help;
    return {
        setters: [],
        execute: function () {
            Help = (function () {
                function Help() {
                }
                Help.lerp = function (start, end, amt) {
                    return start + (end - start) * amt;
                };
                Help.mod = function (j, n) {
                    return ((j % n) + n) % n;
                };
                Help.getBase64Image = function (data) {
                    var canvas = document.createElement("canvas");
                    canvas.width = data.width;
                    canvas.height = data.height;
                    var ctx = canvas.getContext("2d");
                    ctx.putImageData(data, 0, 0);
                    var dataURL = canvas.toDataURL("image/png");
                    return dataURL;
                };
                Help.getImageData = function (image) {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    var data = ctx.getImageData(0, 0, image.width, image.height);
                    return data;
                };
                Help.isLoaded = function (element) {
                    return element.getAttribute("loaded") == "true";
                };
                Help.loaded = function (element, set) {
                    element.setAttribute("loaded", set ? "true" : "false");
                };
                Help.loadSprite = function (src, complete) {
                    var image = new Image();
                    image.addEventListener("load", function (e) {
                        Help.loaded(image, true);
                        if (complete)
                            complete(image);
                    }, false);
                    image.src = src;
                    return image;
                };
                Help.degToRad = function (angle) {
                    return angle * Math.PI / 180;
                };
                Help.sign = function (m) {
                    return m == 0 ? 0 : (m < 0 ? -1 : 1);
                };
                Help.floor = function (spinDashSpeed) {
                    if (spinDashSpeed > 0)
                        return ~~spinDashSpeed;
                    return Math.floor(spinDashSpeed) | 0;
                };
                Help.max = function (f1, f2) {
                    return f1 < f2 ? f2 : f1;
                };
                Help.min = function (f1, f2) {
                    return f1 > f2 ? f2 : f1;
                };
                Help.getQueryString = function () {
                    var result = {};
                    var queryString = window.location.search.substring(1);
                    var re = new RegExp("/([^&=]+)=([^&]*)/g");
                    var m;
                    while ((m = re.exec(queryString)) != null) {
                        result[window.decodeURIComponent(m[1])] = window.decodeURIComponent(m[2]);
                    }
                    return result;
                };
                Help.merge = function (base, update) {
                    for (var i in update) {
                        base[i] = update[i];
                    }
                    return base;
                };
                return Help;
            }());
            exports_12("Help", Help);
        }
    };
});
System.register("entities/entityManager", ["game/AssetManager", "game/gridHexagonConstants", "game/hexUtils", "animationManager", "utils/help", "utils/hexagonColorUtils"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var assetManager_2, gridHexagonConstants_3, hexUtils_2, animationManager_1, help_1, hexagonColorUtils_3, EntityManager, BaseEntity, SixDirectionEntity, StationaryEntity, HeliEntity, TankEntity, InfantryEntity, MainBaseEntity, RegularBaseEntity, EntityDetail, EntityDetails;
    return {
        setters: [
            function (assetManager_2_1) {
                assetManager_2 = assetManager_2_1;
            },
            function (gridHexagonConstants_3_1) {
                gridHexagonConstants_3 = gridHexagonConstants_3_1;
            },
            function (hexUtils_2_1) {
                hexUtils_2 = hexUtils_2_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (help_1_1) {
                help_1 = help_1_1;
            },
            function (hexagonColorUtils_3_1) {
                hexagonColorUtils_3 = hexagonColorUtils_3_1;
            }
        ],
        execute: function () {
            EntityManager = (function () {
                function EntityManager(hexBoard) {
                    this.hexBoard = hexBoard;
                    this.entities = [];
                    this.entityKeys = {};
                    this.entitiesMap = {};
                }
                EntityManager.prototype.tick = function () {
                    for (var i = 0; i < this.entities.length; i++) {
                        var entity = this.entities[i];
                        entity.tick();
                    }
                };
                EntityManager.prototype.getEntitiesAtTile = function (item) {
                    return this.entitiesMap[item.x + item.z * 5000];
                };
                EntityManager.prototype.addEntity = function (entity) {
                    this.entities.push(entity);
                    this.entityKeys[entity.id] = entity;
                };
                EntityManager.prototype.empty = function () {
                    this.entities.length = 0;
                    this.entitiesMap = {};
                    this.entityKeys = {};
                };
                EntityManager.prototype.getEntityById = function (id) {
                    return this.entityKeys[id];
                };
                EntityManager.prototype.removeEntityFromTile = function (tile, entity) {
                    var entities = this.entitiesMap[tile.x + tile.z * 5000];
                    entities.splice(entities.indexOf(entity), 1);
                    this.entitiesMap[tile.x + tile.z * 5000] = entities;
                };
                EntityManager.prototype.addEntityToTile = function (tile, entity) {
                    if (!this.entitiesMap[tile.x + tile.z * 5000]) {
                        this.entitiesMap[tile.x + tile.z * 5000] = [];
                    }
                    this.entitiesMap[tile.x + tile.z * 5000].push(entity);
                };
                return EntityManager;
            }());
            exports_13("EntityManager", EntityManager);
            BaseEntity = (function () {
                function BaseEntity(entityManager, entity, totalFrames, animationSpeed) {
                    this.entityManager = entityManager;
                    this.totalFrames = totalFrames;
                    this.animationSpeed = animationSpeed;
                    this.animationFrame = 0;
                    this._drawTickNumber = (Math.random() * 1000) | 0;
                    this.animateFromHex = null;
                    this.animateToHex = null;
                    this.durationTicks = -1;
                    this.currentTick = -1;
                    this.currentVotes = [];
                    this.faction = entity.factionId;
                    this.setHealth(entity.health);
                }
                BaseEntity.prototype.setId = function (id) {
                    this.id = id;
                };
                BaseEntity.prototype.setHealth = function (health) {
                    this.health = health;
                };
                BaseEntity.prototype.setTile = function (tile) {
                    if (this.tile) {
                        this.entityManager.removeEntityFromTile(this.tile, this);
                        this.tile.removeEntity(this);
                    }
                    this.tile = tile;
                    if (tile) {
                        this.tile.addEntity(this);
                        this.x = this.tile.getRealX();
                        this.z = this.tile.getRealZ();
                        this.entityManager.addEntityToTile(tile, this);
                    }
                };
                BaseEntity.prototype.getTile = function () {
                    return this.tile;
                };
                BaseEntity.prototype.draw = function (context) {
                    this._drawTickNumber++;
                    if (this._drawTickNumber % this.animationSpeed === 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
                    }
                    if (this.currentTick != -1) {
                        var percent = this.currentTick / this.durationTicks;
                        if (percent < 1) {
                            this.x = help_1.Help.lerp(this.animateFromHex.getRealX(), this.animateToHex.getRealX(), percent);
                            this.z = help_1.Help.lerp(this.animateFromHex.getRealZ(), this.animateToHex.getRealZ(), percent);
                            this.currentTick++;
                        }
                    }
                };
                BaseEntity.prototype.tick = function () {
                };
                BaseEntity.prototype.onAnimationComplete = function (frame) {
                    if (frame.type == animationManager_1.AnimationFrameType.Stop) {
                        this.currentTick = -1;
                        this.durationTicks = -1;
                        this.animateToHex = null;
                        this.animateFromHex = null;
                        return;
                    }
                    var tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                    var neighbors = tile.getNeighbors();
                    tile.setFaction(this.faction);
                    for (var j = 0; j < neighbors.length; j++) {
                        var ne = neighbors[j];
                        var tile_1 = this.entityManager.hexBoard.getHexAtSpot(ne.x, ne.z);
                        if (!tile_1)
                            continue;
                        tile_1.setFaction(this.faction);
                    }
                    this.x = tile.getRealX();
                    this.z = tile.getRealZ();
                    this.setTile(tile);
                };
                BaseEntity.prototype.onAnimationStart = function (frame) {
                    if (frame.type == animationManager_1.AnimationFrameType.Start) {
                        this.currentTick = -1;
                        this.durationTicks = -1;
                        this.animateToHex = null;
                        this.animateFromHex = null;
                        return;
                    }
                };
                BaseEntity.prototype.resetVotes = function () {
                    this.currentVotes.length = 0;
                    this.totalVoteCount = 0;
                    this.getTile().clearVoteColor();
                    this.getTile().clearSecondaryVoteColor();
                };
                BaseEntity.prototype.pushVote = function (vote) {
                    this.currentVotes.push(vote);
                    var votes = 0;
                    for (var i = 0; i < this.currentVotes.length; i++) {
                        votes += this.currentVotes[i].votes;
                    }
                    this.totalVoteCount = votes;
                    this.getTile().setVoteColor(hexagonColorUtils_3.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
                };
                BaseEntity.prototype.setSecondaryVoteColor = function (spot) {
                    var votes = 0;
                    for (var i = 0; i < this.currentVotes.length; i++) {
                        var currentVote = this.currentVotes[i];
                        switch (currentVote.action.actionType) {
                            case "Move":
                                var moveAction = currentVote.action;
                                if (moveAction.x == spot.x && moveAction.z == spot.z) {
                                    votes += currentVote.votes;
                                }
                                break;
                        }
                    }
                    if (votes > 0) {
                        spot.setSecondaryVoteColor(hexagonColorUtils_3.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
                    }
                };
                return BaseEntity;
            }());
            exports_13("BaseEntity", BaseEntity);
            SixDirectionEntity = (function (_super) {
                __extends(SixDirectionEntity, _super);
                function SixDirectionEntity() {
                    var _this = _super.apply(this, arguments) || this;
                    _this.currentDirection = hexUtils_2.Direction.Bottom;
                    return _this;
                }
                SixDirectionEntity.prototype.setDirection = function (direction) {
                    this.currentDirection = direction;
                };
                SixDirectionEntity.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.z);
                    var asset = assetManager_2.AssetManager.assets[this.key];
                    var image = asset.images[this.animationFrame];
                    var ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width) / 2;
                    var width = gridHexagonConstants_3.GridHexagonConstants.width / 2;
                    var height = asset.size.height * ratio;
                    context.rotate(this.directionToRadians());
                    context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
                    context.restore();
                };
                SixDirectionEntity.prototype.getActionFrames = function (action, hexBoard) {
                    var frames = [];
                    switch (action.actionType) {
                        case "Move":
                            var moveAction = action;
                            var tile = this.getTile();
                            var path = hexBoard.pathFind(hexBoard.getHexAtSpot(tile.x, tile.z), hexBoard.getHexAtSpot(moveAction.x, moveAction.z));
                            frames.push({
                                type: animationManager_1.AnimationFrameType.Start,
                                startX: path[0].x,
                                startZ: path[0].z,
                                entity: this
                            });
                            for (var i = 1; i < path.length; i++) {
                                var p = path[i];
                                var oldP = path[i - 1];
                                frames.push({
                                    type: animationManager_1.AnimationFrameType.Move,
                                    startX: oldP.x,
                                    startZ: oldP.z,
                                    endX: p.x,
                                    endZ: p.z,
                                    entity: this
                                });
                            }
                            frames.push({
                                type: animationManager_1.AnimationFrameType.Stop,
                                startX: path[path.length - 1].x,
                                startZ: path[path.length - 1].z,
                                entity: this
                            });
                            break;
                    }
                    return frames;
                };
                SixDirectionEntity.prototype.executeFrame = function (hexBoard, frame, duration) {
                    switch (frame.type) {
                        case animationManager_1.AnimationFrameType.Move:
                            var fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                            var toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                            this.currentDirection = hexUtils_2.HexUtils.getDirection(fromHex, toHex);
                            this.animateFromHex = fromHex;
                            this.animateToHex = toHex;
                            this.durationTicks = Math.floor(duration / 16);
                            this.currentTick = 0;
                            break;
                    }
                };
                SixDirectionEntity.prototype.directionToRadians = function () {
                    var degrees = 0;
                    switch (this.currentDirection) {
                        case hexUtils_2.Direction.TopLeft:
                            degrees = -45;
                            break;
                        case hexUtils_2.Direction.Top:
                            degrees = 0;
                            break;
                        case hexUtils_2.Direction.TopRight:
                            degrees = 45;
                            break;
                        case hexUtils_2.Direction.BottomRight:
                            degrees = 45 + 90;
                            break;
                        case hexUtils_2.Direction.Bottom:
                            degrees = 180;
                            break;
                        case hexUtils_2.Direction.BottomLeft:
                            degrees = -45 - 90;
                            break;
                    }
                    return degrees * 0.0174533;
                };
                return SixDirectionEntity;
            }(BaseEntity));
            exports_13("SixDirectionEntity", SixDirectionEntity);
            StationaryEntity = (function (_super) {
                __extends(StationaryEntity, _super);
                function StationaryEntity() {
                    return _super.apply(this, arguments) || this;
                }
                StationaryEntity.prototype.getActionFrames = function (action, hexBoard) {
                    return [];
                };
                StationaryEntity.prototype.draw = function (context) {
                    _super.prototype.draw.call(this, context);
                    context.save();
                    context.translate(this.x, this.z);
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
                StationaryEntity.prototype.executeFrame = function (hexBoard, frame, duration) {
                };
                return StationaryEntity;
            }(BaseEntity));
            exports_13("StationaryEntity", StationaryEntity);
            HeliEntity = (function (_super) {
                __extends(HeliEntity, _super);
                function HeliEntity(entityManager, entity) {
                    var _this = _super.call(this, entityManager, entity, 2, 10) || this;
                    _this.key = 'Heli';
                    return _this;
                }
                HeliEntity.prototype.realYOffset = function () {
                    var offset = gridHexagonConstants_3.GridHexagonConstants.depthHeight();
                    return -(Math.sin(this._drawTickNumber / 10)) * offset + offset * 1;
                };
                HeliEntity.prototype.realXOffset = function () {
                    return 0;
                };
                HeliEntity.prototype.getYOffset = function () {
                    return 1;
                };
                return HeliEntity;
            }(SixDirectionEntity));
            exports_13("HeliEntity", HeliEntity);
            TankEntity = (function (_super) {
                __extends(TankEntity, _super);
                function TankEntity(entityManager, entity) {
                    var _this = _super.call(this, entityManager, entity, 2, 10) || this;
                    _this.key = 'Tank';
                    return _this;
                }
                TankEntity.prototype.realYOffset = function () {
                    return 0;
                };
                TankEntity.prototype.realXOffset = function () {
                    return 0;
                };
                TankEntity.prototype.getYOffset = function () {
                    return 0;
                };
                return TankEntity;
            }(SixDirectionEntity));
            exports_13("TankEntity", TankEntity);
            InfantryEntity = (function (_super) {
                __extends(InfantryEntity, _super);
                function InfantryEntity(entityManager, entity) {
                    var _this = _super.call(this, entityManager, entity, 2, 10) || this;
                    _this.key = 'Infantry';
                    return _this;
                }
                InfantryEntity.prototype.realYOffset = function () {
                    return 0;
                };
                InfantryEntity.prototype.realXOffset = function () {
                    return 0;
                };
                InfantryEntity.prototype.getYOffset = function () {
                    return 0;
                };
                return InfantryEntity;
            }(SixDirectionEntity));
            exports_13("InfantryEntity", InfantryEntity);
            MainBaseEntity = (function (_super) {
                __extends(MainBaseEntity, _super);
                function MainBaseEntity(entityManager, entity) {
                    var _this = _super.call(this, entityManager, entity, 0, 0) || this;
                    _this.key = 'MainBase';
                    return _this;
                }
                MainBaseEntity.prototype.realYOffset = function () {
                    return 0;
                };
                MainBaseEntity.prototype.realXOffset = function () {
                    return 0;
                };
                MainBaseEntity.prototype.getYOffset = function () {
                    return 0;
                };
                return MainBaseEntity;
            }(StationaryEntity));
            exports_13("MainBaseEntity", MainBaseEntity);
            RegularBaseEntity = (function (_super) {
                __extends(RegularBaseEntity, _super);
                function RegularBaseEntity(entityManager, entity) {
                    var _this = _super.call(this, entityManager, entity, 0, 0) || this;
                    _this.key = 'Base';
                    return _this;
                }
                RegularBaseEntity.prototype.realYOffset = function () {
                    return 0;
                };
                RegularBaseEntity.prototype.realXOffset = function () {
                    return 0;
                };
                RegularBaseEntity.prototype.getYOffset = function () {
                    return 0;
                };
                return RegularBaseEntity;
            }(StationaryEntity));
            exports_13("RegularBaseEntity", RegularBaseEntity);
            EntityDetail = (function () {
                function EntityDetail() {
                }
                return EntityDetail;
            }());
            exports_13("EntityDetail", EntityDetail);
            EntityDetails = (function () {
                function EntityDetails() {
                    this.details = {};
                    this.details["Base"] = new EntityDetail();
                    this.details["Base"].moveRadius = 0;
                    this.details["Base"].health = 10;
                    this.details["Base"].attackRadius = 0;
                    this.details["Base"].attackPower = 0;
                    this.details["Base"].ticksToSpawn = 5;
                    this.details["Base"].healthRegenRate = 1;
                    this.details["Base"].solid = true;
                    this.details["Base"].spawnRadius = 3;
                    this.details["MainBase"] = new EntityDetail();
                    this.details["MainBase"].moveRadius = 0;
                    this.details["MainBase"].health = 30;
                    this.details["MainBase"].attackRadius = 0;
                    this.details["MainBase"].attackPower = 0;
                    this.details["MainBase"].ticksToSpawn = 0;
                    this.details["MainBase"].healthRegenRate = 0;
                    this.details["MainBase"].solid = true;
                    this.details["MainBase"].spawnRadius = 4;
                    this.details["Tank"] = new EntityDetail();
                    this.details["Tank"].moveRadius = 4;
                    this.details["Tank"].health = 4;
                    this.details["Tank"].attackRadius = 8;
                    this.details["Tank"].attackPower = 3;
                    this.details["Tank"].ticksToSpawn = 3;
                    this.details["Tank"].healthRegenRate = 1;
                    this.details["Tank"].solid = false;
                    this.details["Tank"].spawnRadius = 0;
                    this.details["Plane"] = new EntityDetail();
                    this.details["Plane"].moveRadius = 10;
                    this.details["Plane"].health = 1;
                    this.details["Plane"].attackRadius = 3;
                    this.details["Plane"].attackPower = 3;
                    this.details["Plane"].ticksToSpawn = 4;
                    this.details["Plane"].healthRegenRate = 1;
                    this.details["Plane"].solid = false;
                    this.details["Plane"].spawnRadius = 0;
                    this.details["Infantry"] = new EntityDetail();
                    this.details["Infantry"].moveRadius = 8;
                    this.details["Infantry"].health = 2;
                    this.details["Infantry"].attackRadius = 3;
                    this.details["Infantry"].attackPower = 1;
                    this.details["Infantry"].ticksToSpawn = 2;
                    this.details["Infantry"].healthRegenRate = 1;
                    this.details["Infantry"].solid = false;
                    this.details["Infantry"].spawnRadius = 2;
                }
                return EntityDetails;
            }());
            EntityDetails.instance = new EntityDetails();
            exports_13("EntityDetails", EntityDetails);
        }
    };
});
System.register("dataServices", [], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var rawDeflateWorker, WorkerService, DataService;
    return {
        setters: [],
        execute: function () {
            rawDeflateWorker = new Worker("/libs/RawDeflate.js");
            WorkerService = (function () {
                function WorkerService() {
                }
                WorkerService.start = function () {
                    rawDeflateWorker.onmessage = function (ev) {
                        var p = WorkerService.payloads[ev.data.key];
                        delete WorkerService.payloads[ev.data.key];
                        if (p)
                            p(ev.data.payload);
                    };
                };
                WorkerService.deflate = function (data) {
                    return new Promise(function (resolve, reject) {
                        var key = (Math.random() * 1000000).toFixed(0);
                        WorkerService.payloads[key] = resolve;
                        rawDeflateWorker.postMessage({ key: key, payload: data });
                    });
                };
                return WorkerService;
            }());
            WorkerService.payloads = {};
            exports_14("WorkerService", WorkerService);
            WorkerService.start();
            DataService = (function () {
                function DataService() {
                }
                // private static voteServer: string = 'http://localhost:3568/';
                DataService.getGameMetrics = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, m, ex_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
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
                                    return [4 /*yield*/, WorkerService.deflate(json.data)];
                                case 3:
                                    m = _a.sent();
                                    m.metrics.nextGenerationDate = new Date(m.metrics.nextGeneration);
                                    return [2 /*return*/, m.metrics];
                                case 4:
                                    ex_1 = _a.sent();
                                    console.error('Fetch Error :-S', ex_1);
                                    return [2 /*return*/, ex_1];
                                case 5: return [2 /*return*/];
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
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    json = _a.sent();
                                    if (json.meta.errors) {
                                        console.error(json.meta.errors);
                                        return [2 /*return*/, null];
                                    }
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
                        var response, json, m, ex_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
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
                                    return [4 /*yield*/, WorkerService.deflate(json.data)];
                                case 3:
                                    m = _a.sent();
                                    return [2 /*return*/, m.state];
                                case 4:
                                    ex_3 = _a.sent();
                                    console.error('Fetch Error :-S', ex_3);
                                    return [2 /*return*/, ex_3];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                DataService.getGenerationResult = function (generation) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, json, m, ex_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
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
                                    return [4 /*yield*/, WorkerService.deflate(json.data)];
                                case 3:
                                    m = _a.sent();
                                    return [2 /*return*/, m.metrics];
                                case 4:
                                    ex_4 = _a.sent();
                                    console.error('Fetch Error :-S', ex_4);
                                    return [2 /*return*/, ex_4];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                return DataService;
            }());
            DataService.voteServer = 'https://vote.socialwargames.com/';
            DataService.compressor = new Compressor();
            exports_14("DataService", DataService);
        }
    };
});
System.register("ui/gameService", [], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var GameService;
    return {
        setters: [],
        execute: function () {
            GameService = (function () {
                function GameService() {
                }
                GameService.setGameManager = function (gameManager) {
                    this.gameManager = gameManager;
                };
                ;
                return GameService;
            }());
            exports_15("GameService", GameService);
        }
    };
});
System.register("game/gameManager", ["utils/drawingUtilities", "game/hexUtils", "game/hexBoard", "dataServices", "animationManager", "game/gridHexagonConstants", "utils/hexagonColorUtils", "ui/gameService"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var drawingUtilities_3, hexUtils_3, hexBoard_1, dataServices_1, animationManager_2, gridHexagonConstants_4, hexagonColorUtils_4, gameService_1, GameManager, ViewPort;
    return {
        setters: [
            function (drawingUtilities_3_1) {
                drawingUtilities_3 = drawingUtilities_3_1;
            },
            function (hexUtils_3_1) {
                hexUtils_3 = hexUtils_3_1;
            },
            function (hexBoard_1_1) {
                hexBoard_1 = hexBoard_1_1;
            },
            function (dataServices_1_1) {
                dataServices_1 = dataServices_1_1;
            },
            function (animationManager_2_1) {
                animationManager_2 = animationManager_2_1;
            },
            function (gridHexagonConstants_4_1) {
                gridHexagonConstants_4 = gridHexagonConstants_4_1;
            },
            function (hexagonColorUtils_4_1) {
                hexagonColorUtils_4 = hexagonColorUtils_4_1;
            },
            function (gameService_1_1) {
                gameService_1 = gameService_1_1;
            }
        ],
        execute: function () {
            GameManager = (function () {
                function GameManager() {
                    this.viewPort = new ViewPort();
                    gameService_1.GameService.setGameManager(this);
                }
                GameManager.prototype.init = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var state, lx, ly;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    hexagonColorUtils_4.HexagonColorUtils.setupColors();
                                    this.hexBoard = new hexBoard_1.HexBoard();
                                    this.animationManager = new animationManager_2.AnimationManager(this.hexBoard);
                                    return [4 /*yield*/, dataServices_1.DataService.getGameState()];
                                case 1:
                                    state = _a.sent();
                                    gameService_1.GameService.secondsPerGeneration = state.tickIntervalSeconds;
                                    this.hexBoard.initialize(state);
                                    this.createMiniCanvas();
                                    this.rebuildMiniBoard(false);
                                    return [4 /*yield*/, this.checkState()];
                                case 2:
                                    _a.sent();
                                    gameService_1.GameService.hasData && gameService_1.GameService.hasData();
                                    lx = localStorage.getItem("lastX");
                                    ly = localStorage.getItem("lastY");
                                    if (lx && ly) {
                                        this.setView(parseInt(lx), parseInt(ly));
                                    }
                                    setTimeout(function () {
                                        _this.randomTap();
                                    }, 1000);
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.checkState()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 5 * 1000);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.createMiniCanvas = function () {
                    var _this = this;
                    var size = this.hexBoard.gameDimensionsMini();
                    var canvas = document.createElement("canvas");
                    canvas.width = size.width + 20;
                    canvas.height = size.height + 20;
                    var context = canvas.getContext("2d");
                    this.miniCanvas = canvas;
                    this.miniContext = context;
                    var leftBubble = document.getElementById('leftBubble');
                    leftBubble.appendChild(this.miniCanvas);
                    var mc = new Hammer.Manager(leftBubble);
                    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
                    mc.add(new Hammer.Tap());
                    var tapStart = { x: 0, y: 0 };
                    mc.on('panstart', function (ev) {
                        tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
                        tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
                        tapStart.x = tapStart.x || 0;
                        tapStart.y = tapStart.y || 0;
                        return true;
                    });
                    mc.on('panmove', function (ev) {
                        var width = leftBubble.clientWidth;
                        var height = leftBubble.clientHeight;
                        var rx = (tapStart.x + ev.deltaX);
                        var ry = (tapStart.y + ev.deltaY);
                        if (rx < width * 2 / 5 && rx > -size.width + width * 2 / 5) {
                            canvas.style.marginLeft = rx + "px";
                        }
                        if (ry < height * 2 / 5 && ry > -size.height + height * 2 / 5) {
                            canvas.style.marginTop = ry + "px";
                        }
                    });
                    mc.on('tap', function (ev) {
                        var rect = leftBubble.getBoundingClientRect();
                        tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
                        tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
                        tapStart.x = tapStart.x || 0;
                        tapStart.y = tapStart.y || 0;
                        var x = ev.center.x - tapStart.x - rect.left - 15;
                        var y = ev.center.y - tapStart.y - rect.top - 15;
                        var item = _this.getMiniHexAtPoint(x, y);
                        if (item) {
                            _this.centerOnHex(item);
                        }
                    });
                };
                GameManager.prototype.getMiniHexAtPoint = function (clickX, clickY) {
                    var lastClick = null;
                    for (var i = 0; i < this.hexBoard.hexList.length; i++) {
                        var gridHexagon = this.hexBoard.hexList[i];
                        var x = gridHexagonConstants_4.GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        var z = gridHexagon.z * gridHexagonConstants_4.GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_4.GridMiniHexagonConstants.height() / 2) : 0);
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridMiniHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                };
                GameManager.prototype.rebuildMiniBoard = function (justEntities, entity) {
                    var size = this.hexBoard.gameDimensionsMini();
                    this.miniContext.save();
                    if (!justEntities)
                        this.miniContext.clearRect(0, 0, size.width + 20, size.height + 20);
                    this.miniContext.translate(10, 10);
                    for (var i = 0; i < this.hexBoard.hexList.length; i++) {
                        var gridHexagon = this.hexBoard.hexList[i];
                        if (justEntities) {
                            if (gridHexagon.hasEntities()) {
                                if (entity) {
                                    if (!gridHexagon.getEntityById(entity.id)) {
                                        continue;
                                    }
                                }
                                gridHexagon.drawMini(this.miniContext, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ());
                            }
                        }
                        else {
                            gridHexagon.drawMini(this.miniContext, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ());
                        }
                    }
                    this.miniContext.restore();
                };
                GameManager.prototype.draw = function (context) {
                    context.save();
                    context.translate(-this.viewPort.x, -this.viewPort.y);
                    this.hexBoard.drawBoard(context, this.viewPort);
                    context.restore();
                };
                GameManager.prototype.tick = function () {
                    this.hexBoard.entityManager.tick();
                };
                GameManager.prototype.cantAct = function () {
                    return this.checking || !this.hexBoard || this.hexBoard.generation == -1 || this.animationManager.isRunning;
                };
                GameManager.prototype.checkState = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var metrics, seconds, i, ent, result, i, hex, i, vote, action, entity;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.cantAct())
                                        return [2 /*return*/];
                                    console.log('checking generation');
                                    this.checking = true;
                                    return [4 /*yield*/, dataServices_1.DataService.getGameMetrics()];
                                case 1:
                                    metrics = _a.sent();
                                    console.log('got generation');
                                    seconds = (+metrics.nextGenerationDate - +new Date()) / 1000;
                                    gameService_1.GameService.setSecondsToNextGeneration(seconds);
                                    for (i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
                                        ent = this.hexBoard.entityManager.entities[i];
                                        ent.resetVotes();
                                    }
                                    if (!(this.hexBoard.generation != metrics.generation))
                                        return [3 /*break*/, 3];
                                    console.log("Gen - old: " + this.hexBoard.generation + " new " + metrics.generation);
                                    return [4 /*yield*/, dataServices_1.DataService.getGenerationResult(this.hexBoard.generation)];
                                case 2:
                                    result = _a.sent();
                                    for (i = 0; i < this.hexBoard.hexList.length; i++) {
                                        hex = this.hexBoard.hexList[i];
                                        hex.clearSecondaryVoteColor();
                                        hex.clearHighlightColor();
                                        hex.clearVoteColor();
                                        hex.setShowVotes(true);
                                    }
                                    if (!result) {
                                        console.log('getting new game state 1');
                                        dataServices_1.DataService.getGameState().then(function (state) {
                                            console.log('game updated3 ');
                                            _this.hexBoard.updateFactionEntities(state);
                                            _this.rebuildMiniBoard(false);
                                            _this.checking = false;
                                        });
                                        return [2 /*return*/];
                                    }
                                    this.animationManager.reset();
                                    this.animationManager.setVotes(result.votes);
                                    this.animationManager.onComplete(function () {
                                        console.log('getting new game state 2');
                                        dataServices_1.DataService.getGameState().then(function (state) {
                                            console.log('game updated4 ');
                                            _this.hexBoard.updateFactionEntities(state);
                                            _this.rebuildMiniBoard(false);
                                            _this.checking = false;
                                        });
                                    });
                                    this.animationManager.start();
                                    return [3 /*break*/, 4];
                                case 3:
                                    for (i = 0; i < metrics.votes.length; i++) {
                                        vote = metrics.votes[i];
                                        action = vote.action;
                                        entity = this.hexBoard.entityManager.getEntityById(action.entityId);
                                        entity.pushVote(vote);
                                    }
                                    this.rebuildMiniBoard(true);
                                    _a.label = 4;
                                case 4:
                                    this.checking = false;
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.checkState()];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 1000 * (seconds + 2 > 5 ? 5 : seconds + 2));
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.startAction = function (tile) {
                    var entities = this.hexBoard.entityManager.getEntitiesAtTile(tile);
                    if (!entities || !entities[0]) {
                        return;
                    }
                    this.selectedHex = tile;
                    gameService_1.GameService.setSelectedEntity(entities[0]);
                    for (var i = 0; i < this.hexBoard.hexList.length; i++) {
                        var h = this.hexBoard.hexList[i];
                        h.setShowVotes(false);
                    }
                    var radius = 5;
                    var spots = this.findAvailableSpots(radius, tile);
                    var ent = entities[0];
                    tile.setShowVotes(true);
                    for (var i = 0; i < spots.length; i++) {
                        var spot = spots[i];
                        var entities_1 = this.hexBoard.entityManager.getEntitiesAtTile(spot);
                        if (spot == tile || (entities_1 && entities_1.length > 0))
                            continue;
                        var path = this.hexBoard.pathFind(tile, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            spot.setHighlightColor(hexagonColorUtils_4.HexagonColorUtils.moveHighlightColor);
                            spot.setShowVotes(true);
                            ent.setSecondaryVoteColor(spot);
                        }
                    }
                };
                GameManager.prototype.findAvailableSpots = function (radius, center) {
                    var items = [];
                    for (var q = 0; q < this.hexBoard.hexList.length; q++) {
                        var item = this.hexBoard.hexList[q];
                        if (hexUtils_3.HexUtils.distance(center, item) <= radius) {
                            items.push(item);
                        }
                    }
                    return items;
                };
                GameManager.prototype.randomTap = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var ent, px, pz, p, tile;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.cantAct()) {
                                        setTimeout(function () {
                                            _this.randomTap();
                                        }, Math.random() * 1000 + 100);
                                        return [2 /*return*/];
                                    }
                                    while (true) {
                                        p = Math.round(this.hexBoard.entityManager.entities.length * Math.random());
                                        ent = this.hexBoard.entityManager.entities[p];
                                        if (!ent)
                                            continue;
                                        tile = ent.getTile();
                                        px = Math.round(tile.x + Math.random() * 10 - 5);
                                        pz = Math.round(tile.z + Math.random() * 10 - 5);
                                        if (px == 0 && pz == 0)
                                            continue;
                                        if (hexUtils_3.HexUtils.distance({ x: px, z: pz }, { x: tile.x, z: tile.z }) <= 5) {
                                            break;
                                        }
                                    }
                                    return [4 /*yield*/, this.vote(ent, 'Move', px, pz)];
                                case 1:
                                    _a.sent();
                                    setTimeout(function () {
                                        _this.randomTap();
                                    }, Math.random() * 1000 + 100);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.vote = function (entity, action, px, pz) {
                    return __awaiter(this, void 0, void 0, function () {
                        var result, i, vote;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, dataServices_1.DataService.vote({
                                        entityId: entity.id,
                                        action: action,
                                        userId: 'foo',
                                        generation: this.hexBoard.generation,
                                        x: px,
                                        z: pz
                                    })];
                                case 1:
                                    result = _a.sent();
                                    if (!result)
                                        return [3 /*break*/, 4];
                                    if (!result.generationMismatch)
                                        return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.checkState()];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    if (result.issueVoting) {
                                        console.log('issue voting');
                                    }
                                    else {
                                        entity.resetVotes();
                                        for (i = 0; i < result.votes.length; i++) {
                                            vote = result.votes[i];
                                            entity.pushVote(vote);
                                        }
                                        this.rebuildMiniBoard(true, entity);
                                    }
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.tapHex = function (x, y) {
                    return __awaiter(this, void 0, void 0, function () {
                        var i, h, item, distance, entities, entity;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.cantAct()) {
                                        return [2 /*return*/];
                                    }
                                    /* if (this.menuManager.tap(x, y)) {
                                     return;
                                     }
                                     this.menuManager.closeMenu();*/
                                    gameService_1.GameService.setSelectedEntity(null);
                                    for (i = 0; i < this.hexBoard.hexList.length; i++) {
                                        h = this.hexBoard.hexList[i];
                                        h.setShowVotes(true);
                                        h.clearHighlightColor();
                                        h.clearSecondaryVoteColor();
                                    }
                                    item = this.getHexAtPoint(x, y);
                                    if (!item) {
                                        this.selectedHex = null;
                                        return [2 /*return*/];
                                    }
                                    if (!this.selectedHex)
                                        return [3 /*break*/, 2];
                                    distance = hexUtils_3.HexUtils.distance(this.selectedHex, item);
                                    if (distance > 5 || distance == 0) {
                                        this.startAction(item);
                                        return [2 /*return*/];
                                    }
                                    entities = this.hexBoard.entityManager.getEntitiesAtTile(this.selectedHex);
                                    if (!entities || entities.length == 0) {
                                        this.startAction(item);
                                        return [2 /*return*/];
                                    }
                                    entity = entities[0];
                                    return [4 /*yield*/, this.vote(entity, 'Move', item.x, item.z)];
                                case 1:
                                    _a.sent();
                                    this.selectedHex = null;
                                    return [3 /*break*/, 3];
                                case 2:
                                    this.startAction(item);
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                GameManager.prototype.resize = function (width, height) {
                    this.viewPort.width = width;
                    this.viewPort.height = height;
                    this.constrainViewPort();
                };
                GameManager.prototype.offsetView = function (x, y) {
                    this.setView(this.viewPort.x + x, this.viewPort.y + y);
                };
                GameManager.prototype.setView = function (x, y) {
                    this.viewPort.x = x;
                    this.viewPort.y = y;
                    this.constrainViewPort();
                    localStorage.setItem("lastX", this.viewPort.x.toString());
                    localStorage.setItem("lastY", this.viewPort.y.toString());
                };
                GameManager.prototype.constrainViewPort = function () {
                    this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
                    this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
                    var size = this.hexBoard.gameDimensions();
                    this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
                    this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height);
                    this.hexBoard.resetVisibleHexList(this.viewPort);
                };
                GameManager.prototype.getHexAtPoint = function (clickX, clickY) {
                    var lastClick = null;
                    clickX += this.viewPort.x;
                    clickY += this.viewPort.y;
                    for (var i = 0; i < this.hexBoard.hexList.length; i++) {
                        var gridHexagon = this.hexBoard.hexList[i];
                        var x = gridHexagonConstants_4.GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        var z = gridHexagon.z * gridHexagonConstants_4.GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_4.GridHexagonConstants.height() / 2) : 0);
                        z -= gridHexagon.getDepthHeight(true);
                        z += gridHexagon.y * gridHexagonConstants_4.GridHexagonConstants.depthHeight();
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * gridHexagonConstants_4.GridHexagonConstants.depthHeight()))) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                };
                GameManager.prototype.centerOnHex = function (gridHexagon) {
                    var x = gridHexagon.getRealX();
                    var y = gridHexagon.getRealZ();
                    this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
                };
                return GameManager;
            }());
            exports_16("GameManager", GameManager);
            ViewPort = (function () {
                function ViewPort() {
                    this.x = 0;
                    this.y = 0;
                    this.width = 400;
                    this.height = 400;
                    this.padding = gridHexagonConstants_4.GridHexagonConstants.width * 2;
                }
                return ViewPort;
            }());
            exports_16("ViewPort", ViewPort);
        }
    };
});
System.register("game/menuManager", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
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
            exports_17("MenuManager", MenuManager);
        }
    };
});
System.register("pageManager", ["game/menuManager", "game/hexUtils", "game/gameManager", "utils/hexagonColorUtils"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var menuManager_1, hexUtils_4, gameManager_1, hexagonColorUtils_5, PageManager;
    return {
        setters: [
            function (menuManager_1_1) {
                menuManager_1 = menuManager_1_1;
            },
            function (hexUtils_4_1) {
                hexUtils_4 = hexUtils_4_1;
            },
            function (gameManager_1_1) {
                gameManager_1 = gameManager_1_1;
            },
            function (hexagonColorUtils_5_1) {
                hexagonColorUtils_5 = hexagonColorUtils_5_1;
            }
        ],
        execute: function () {
            PageManager = (function () {
                function PageManager() {
                    this.swipeVelocity = { x: 0, y: 0 };
                    this.tapStart = { x: 0, y: 0 };
                }
                PageManager.prototype.init = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        var menu, overlay, mc;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.gameManager = new gameManager_1.GameManager();
                                    return [4 /*yield*/, this.gameManager.init()];
                                case 1:
                                    _a.sent();
                                    this.fpsMeter = new window.FPSMeter(document.body, {
                                        right: '5px',
                                        left: 'auto',
                                        heat: 1
                                    });
                                    hexagonColorUtils_5.HexagonColorUtils.setupColors();
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
                                        _this.gameManager.resize(_this.canvas.width, _this.canvas.height);
                                    };
                                    this.canvas.width = document.body.clientWidth;
                                    this.canvas.height = document.body.clientHeight;
                                    overlay.style.width = '100vw';
                                    overlay.style.height = '100vh';
                                    this.gameManager.resize(this.canvas.width, this.canvas.height);
                                    mc.on('panstart', function (ev) {
                                        if (_this.menuManager.isOpen) {
                                            return false;
                                        }
                                        _this.menuManager.closeMenu();
                                        _this.swipeVelocity.x = _this.swipeVelocity.y = 0;
                                        _this.tapStart.x = _this.gameManager.viewPort.x;
                                        _this.tapStart.y = _this.gameManager.viewPort.y;
                                        _this.gameManager.setView(_this.tapStart.x - ev.deltaX, _this.tapStart.y - ev.deltaY);
                                        return true;
                                    });
                                    mc.on('panmove', function (ev) {
                                        if (_this.menuManager.isOpen) {
                                            return false;
                                        }
                                        _this.gameManager.setView(_this.tapStart.x - ev.deltaX, _this.tapStart.y - ev.deltaY);
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
                                        _this.swipeVelocity.x = _this.swipeVelocity.y = 0;
                                        _this.gameManager.tapHex(x, y);
                                    });
                                    this.draw();
                                    setInterval(function () {
                                        _this.tick();
                                    }, 1000 / 16);
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                PageManager.prototype.draw = function () {
                    var _this = this;
                    requestAnimationFrame(function () {
                        _this.draw();
                    });
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.gameManager.draw(this.context);
                    this.menuManager.draw();
                    this.fpsMeter.tick();
                };
                PageManager.prototype.tick = function () {
                    if (Math.abs(this.swipeVelocity.x) > 0) {
                        var sign = hexUtils_4.HexUtils.mathSign(this.swipeVelocity.x);
                        this.swipeVelocity.x += 0.7 * -sign;
                        if (hexUtils_4.HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                            this.swipeVelocity.x = 0;
                        }
                    }
                    if (Math.abs(this.swipeVelocity.y) > 0) {
                        var sign = hexUtils_4.HexUtils.mathSign(this.swipeVelocity.y);
                        this.swipeVelocity.y += 0.7 * -sign;
                        if (hexUtils_4.HexUtils.mathSign(this.swipeVelocity.y) != sign) {
                            this.swipeVelocity.y = 0;
                        }
                    }
                    // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
                    {
                        this.gameManager.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
                    }
                    this.gameManager.tick();
                };
                return PageManager;
            }());
            exports_18("PageManager", PageManager);
        }
    };
});
System.register("ui/gameController", ["ui/gameService"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var gameService_2, GameController;
    return {
        setters: [
            function (gameService_2_1) {
                gameService_2 = gameService_2_1;
            }
        ],
        execute: function () {
            GameController = (function () {
                function GameController($scope, $interval) {
                    this.$scope = $scope;
                    this.$interval = $interval;
                    $scope.name = 'foo';
                    $scope.timerPercent = 0;
                    var secondsTick = 0;
                    $scope.loading = true;
                    gameService_2.GameService.setSelectedEntity = function (entity) {
                        $scope.selectedEntity = entity;
                        $scope.$apply();
                    };
                    gameService_2.GameService.hasData = function () {
                        $scope.loading = false;
                        $scope.$apply();
                    };
                    gameService_2.GameService.setSecondsToNextGeneration = function (seconds) {
                        secondsTick = 100 / (10 * gameService_2.GameService.secondsPerGeneration);
                        $scope.timerPercent = Math.min(100 - (seconds / gameService_2.GameService.secondsPerGeneration * 100), 100);
                        $scope.$apply();
                    };
                    $interval(function () {
                        if ($scope.timerPercent < 100) {
                            $scope.timerPercent += secondsTick;
                        }
                        $scope.timerPercent = Math.min($scope.timerPercent, 100);
                    }, 100);
                }
                return GameController;
            }());
            GameController.$inject = ['$scope', '$interval'];
            exports_19("GameController", GameController);
        }
    };
});
/// <reference path="./typings/index.d.ts" />
System.register("main", ["game/AssetManager", "pageManager", "ui/gameController"], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var AssetManager_1, pageManager_1, gameController_1, Main;
    return {
        setters: [
            function (AssetManager_1_1) {
                AssetManager_1 = AssetManager_1_1;
            },
            function (pageManager_1_1) {
                pageManager_1 = pageManager_1_1;
            },
            function (gameController_1_1) {
                gameController_1 = gameController_1_1;
            }
        ],
        execute: function () {/// <reference path="./typings/index.d.ts" />
            Main = (function () {
                function Main() {
                }
                Main.run = function () {
                    var _this = this;
                    this.loadAssets(function () {
                        _this.pageManager = new pageManager_1.PageManager();
                        _this.pageManager.init();
                    });
                };
                Main.loadAssets = function (onComplete) {
                    AssetManager_1.AssetManager.completed = onComplete;
                    var size = { width: 80, height: 80 };
                    var base = { x: 40, y: 55 };
                    AssetManager_1.AssetManager.addAsset('MainBase', 'images/MainBase/down_1.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);
                    AssetManager_1.AssetManager.addAsset('Stone.Top', 'images/tile.png');
                    AssetManager_1.AssetManager.addAsset('Stone.Left', 'images/tile.png');
                    AssetManager_1.AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
                    AssetManager_1.AssetManager.addAsset('Stone.Right', 'images/tile.png');
                    AssetManager_1.AssetManager.addAsset('Grass.Top', 'images/grass.png');
                    AssetManager_1.AssetManager.addAsset('Grass.Left', 'images/grass.png');
                    AssetManager_1.AssetManager.addAsset('Grass.Bottom', 'images/grass.png');
                    AssetManager_1.AssetManager.addAsset('Grass.Right', 'images/grass.png');
                    AssetManager_1.AssetManager.addAsset('Water.Top', 'images/water.png');
                    AssetManager_1.AssetManager.addAsset('Water.Left', 'images/water.png');
                    AssetManager_1.AssetManager.addAsset('Water.Bottom', 'images/water.png');
                    AssetManager_1.AssetManager.addAsset('Water.Right', 'images/water.png');
                    /*
                            AssetManager.addAsset('Stone.Top', 'images/tile.png');
                            AssetManager.addAsset('Stone.Left', 'images/tile.png');
                            AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
                            AssetManager.addAsset('Stone.Right', 'images/tile.png');
                    */
                    AssetManager_1.AssetManager.addAssetFrame('Heli', 0, 'images/Heli/up_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Heli', 1, 'images/Heli/up_2.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Tank', 0, 'images/Tank/up_1.png', null, null);
                    AssetManager_1.AssetManager.addAssetFrame('Tank', 1, 'images/Tank/up_1.png', null, null);
                    AssetManager_1.AssetManager.start();
                };
                return Main;
            }());
            exports_20("Main", Main);
            Main.run();
            angular.module('swg', []).controller('GameController', gameController_1.GameController);
            angular.element(function () {
                angular.bootstrap(document.getElementById('game-ui'), ['swg']);
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy9nYW1lL0Fzc2V0TWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvdXRpbHMudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2RyYXdpbmdVdGlsaXRpZXMudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2NvbG9yLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9oZXhhZ29uQ29sb3JVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9ncmlkSGV4YWdvbi50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9ncmlkSGV4YWdvbkNvbnN0YW50cy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9oZXhVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvbW9kZWxzL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9hbmltYXRpb25NYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9oZWxwLnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9lbnRpdHlNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9kYXRhU2VydmljZXMudHMiLCIuLi9jb21wb25lbnRzL3VpL2dhbWVTZXJ2aWNlLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL2dhbWVNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL21lbnVNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9wYWdlTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdWkvZ2FtZUNvbnRyb2xsZXIudHMiLCIuLi9jb21wb25lbnRzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFlQTtnQkFBQTtnQkFzRUEsQ0FBQztnQkE5RFUsa0JBQUssR0FBWjtvQkFBQSxpQkFhQzs0Q0FaYyxNQUFJO3dCQUNY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TSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRixJQUFJO3dCQUNBLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUdqQyxnREFBZ0Q7b0JBQ2hELE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pILE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBR3pILFdBQVc7b0JBQ1gsSUFBSSxNQUFNLEdBQUc7d0JBQ1QsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNyRCxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3JE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