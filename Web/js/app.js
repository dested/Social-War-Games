System.register("game/AssetManager", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AssetManager;
    return {
        setters: [],
        execute: function () {
            AssetManager = class AssetManager {
                static start() {
                    for (const name in this.assetQueue) {
                        if (this.assetQueue.hasOwnProperty(name)) {
                            const img = new Image();
                            img.onload = () => {
                                this.imageLoaded(img, name);
                            };
                            img.src = this.assetQueue[name].url;
                        }
                    }
                }
                static addAsset(name, url, size, base) {
                    this.assetQueue[name] = { base, size, url, realName: name };
                    this.$assetsRequested++;
                }
                static addAssetFrame(name, frameIndex, url, size, base) {
                    this.assetQueue[name + frameIndex] = { base, size, url, frameIndex: frameIndex, realName: name };
                    this.$assetsRequested++;
                }
                static imageLoaded(img, name) {
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
                        setTimeout(() => {
                            this.completed();
                        }, 100);
                    }
                }
            };
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
            Point = class Point {
                get x() {
                    return this._x | 0;
                }
                set x(val) {
                    this._x = val | 0;
                }
                get y() {
                    return this._y | 0;
                }
                set y(val) {
                    this._y = val | 0;
                }
                static Create(pos) {
                    return new Point(pos.x, pos.y);
                }
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
                offset(windowLocation) {
                    return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
                }
                negatePoint(windowLocation) {
                    return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
                }
                negate(x, y) {
                    return new Point(this.x - (x | 0), this.y - (y | 0));
                }
                set(x, y) {
                    this.x = x;
                    this.y = y;
                }
            };
            exports_2("Point", Point);
            DoublePoint = class DoublePoint {
                static create(pos) {
                    return new DoublePoint(pos.x, pos.y);
                }
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
                offset(windowLocation) {
                    return new DoublePoint(this.x + windowLocation.x, this.y + windowLocation.y);
                }
                negatePoint(windowLocation) {
                    return new DoublePoint(this.x - windowLocation.x, this.y - windowLocation.y);
                }
                negate(x, y) {
                    return new DoublePoint(this.x - (x | 0), this.y - (y | 0));
                }
                set(x, y) {
                    this.x = x;
                    this.y = y;
                }
            };
            exports_2("DoublePoint", DoublePoint);
            IntersectingRectangle = class IntersectingRectangle extends Point {
                constructor(x, y, width, height) {
                    super(x, y);
                    this.width = width;
                    this.height = height;
                }
                intersects(p) {
                    return this.x < p.x && this.x + this.width > p.x && this.y < p.y && this.y + this.height > p.y;
                }
                static intersectsRect(r, p) {
                    return r.x < p.x && r.x + r.width > p.x && r.y < p.y && r.y + r.height > p.y;
                }
                static intersectRect(r1, r2) {
                    return !(r2.x > r1.x + r1.width || r2.x + 0 < r1.x || r2.y > r1.y + r1.height || r2.y + 0 < r1.y);
                }
            };
            exports_2("IntersectingRectangle", IntersectingRectangle);
            Rectangle = class Rectangle extends Point {
                constructor(x = 0, y = 0, width = 0, height = 0) {
                    super(x, y);
                    this.width = width;
                    this.height = height;
                }
            };
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
            HexagonColor = class HexagonColor {
                constructor(color) {
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
            };
            exports_3("HexagonColor", HexagonColor);
            DrawingUtils = class DrawingUtils {
                static drawCircle(context) {
                    context.beginPath();
                    context.arc(0, 0, 5, 0, 2 * Math.PI, false);
                    context.fillStyle = 'black';
                    context.fill();
                    context.lineWidth = 5;
                    context.stroke();
                }
                ;
                static colorLuminance(hex, lum) {
                    // validate hex string
                    hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
                    // convert to decimal and change luminosity
                    let rgb = '#';
                    for (let i = 0; i < 3; i++) {
                        const c = parseInt(hex.substr(i * 2, 2), 16);
                        const cs = (Math.round(Math.min(Math.max(0, c + c * lum), 255)) | 0).toString(16);
                        rgb += (`00${cs}`).substr(cs.length);
                    }
                    return rgb;
                }
                ;
                static makeTransparent(hex, opacitiy) {
                    // validate hex string
                    hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
                    // convert to decimal and change luminosity
                    let rgb = 'rgba(';
                    for (let i = 0; i < 3; i++) {
                        const c = parseInt(hex.substr(i * 2, 2), 16);
                        rgb += c + ',';
                    }
                    rgb += opacitiy + ")";
                    return rgb;
                }
                ;
                static pointInPolygon(pointX, pointY, polygon) {
                    let isInside = false;
                    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                        if (polygon[i].y > pointY !== polygon[j].y > pointY &&
                            pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                            isInside = !isInside;
                        }
                    }
                    return isInside;
                }
                ;
            };
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
            Color = class Color {
                constructor(r, g, b, a = 1) {
                    this.R = r;
                    this.G = g;
                    this.B = b;
                    this.A = a;
                }
            };
            exports_4("Color", Color);
            ColorUtils = class ColorUtils {
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
                static blend_colors(color1, color2, percentage) {
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
                    let color3 = [
                        (1 - percentage) * color1[0] + percentage * color2[0],
                        (1 - percentage) * color1[1] + percentage * color2[1],
                        (1 - percentage) * color1[2] + percentage * color2[2]
                    ];
                    // 5: convert to hex
                    // return hex
                    return '#' + ColorUtils.int_to_hex(color3[0]) + ColorUtils.int_to_hex(color3[1]) + ColorUtils.int_to_hex(color3[2]);
                }
                static int_to_hex(num) {
                    let hex = Math.round(num).toString(16);
                    if (hex.length == 1)
                        hex = '0' + hex;
                    return hex;
                }
            };
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
            HexagonColorUtils = class HexagonColorUtils {
                static setupColors() {
                    this.baseColors = [new drawingUtilities_1.HexagonColor('#AFFFFF')];
                    for (let i = 0; i < 6; i++) {
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
                    for (let f = 0; f < this.factionColors.length; f++) {
                        this.factionHexColors[f] = [];
                        for (let i = 0; i < this.baseColors.length; i++) {
                            this.factionHexColors[f].push(new drawingUtilities_1.HexagonColor(color_1.ColorUtils.blend_colors(this.baseColors[i].color, drawingUtilities_1.DrawingUtils.colorLuminance(this.factionColors[f], i == 0 ? 1 : ((i - 1) / 6)), 1)));
                        }
                    }
                }
            };
            HexagonColorUtils.entityHexColor = new drawingUtilities_1.HexagonColor("#FCFCFC");
            HexagonColorUtils.baseColor = new drawingUtilities_1.HexagonColor('#FFFFFF');
            HexagonColorUtils.highlightColor = new drawingUtilities_1.HexagonColor('#00F9FF');
            HexagonColorUtils.selectedHighlightColor = new drawingUtilities_1.HexagonColor('#6B90FF');
            HexagonColorUtils.moveHighlightColor = new drawingUtilities_1.HexagonColor('#BE9EFF');
            HexagonColorUtils.attackHighlightColor = new drawingUtilities_1.HexagonColor('#f9a5b1');
            HexagonColorUtils.spawnHighlightColor = new drawingUtilities_1.HexagonColor('#f7f966');
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
            GridHexagon = class GridHexagon {
                constructor() {
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
                getRealX() {
                    if (this._realX !== undefined) {
                        return this._realX;
                    }
                    return this._realX = (gridHexagonConstants_1.GridHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealZ() {
                    if (this._realZ !== undefined) {
                        return this._realZ;
                    }
                    let height = gridHexagonConstants_1.GridHexagonConstants.height();
                    return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
                        - this.getDepthHeight(true)
                        + this.y * gridHexagonConstants_1.GridHexagonConstants.depthHeight();
                }
                getRealMiniX() {
                    return (gridHexagonConstants_1.GridMiniHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealMiniZ() {
                    let height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
                    return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
                        + this.y * 0;
                }
                getDepthHeight(position) {
                    if (position)
                        return Math.max(1, (this.height + this.heightOffset) * (gridHexagonConstants_1.GridHexagonConstants.depthHeight() - 2));
                    return gridHexagonConstants_1.GridHexagonConstants.depthHeight();
                }
                getEntities() {
                    return this.entities;
                }
                hasEntities() {
                    return this.entities && this.entities.length > 0;
                }
                getEntityById(id) {
                    return this.entities.filter(a => a.id == id)[0];
                }
                addEntity(entity) {
                    this.entities.push(entity);
                    this.invalidateColor();
                }
                removeEntity(entity) {
                    this.entities.splice(this.entities.indexOf(entity), 1);
                    this.invalidateColor();
                }
                setBaseColor(baseColor) {
                    if (this.baseColor !== baseColor) {
                        this.baseColor = baseColor;
                        this.invalidateColor();
                    }
                }
                setFaction(faction) {
                    if (this.faction !== faction) {
                        this.faction = faction;
                        this.invalidateColor();
                    }
                }
                setHighlightColor(highlightColor) {
                    if (this.highlightColor !== highlightColor) {
                        this.highlightColor = highlightColor;
                        this.invalidateColor();
                    }
                }
                setVoteColor(voteColor) {
                    if (this.voteColor !== voteColor) {
                        this.voteColor = voteColor;
                        this.invalidateColor();
                    }
                }
                clearVoteColor() {
                    if (this.voteColor !== null) {
                        this.voteColor = null;
                        this.invalidateColor();
                    }
                }
                setSecondaryVoteColor(voteColor) {
                    if (this.secondaryVoteColor !== voteColor) {
                        this.secondaryVoteColor = voteColor;
                        this.invalidateColor();
                    }
                }
                clearSecondaryVoteColor() {
                    if (this.secondaryVoteColor !== null) {
                        this.secondaryVoteColor = null;
                        this.invalidateColor();
                    }
                }
                clearHighlightColor() {
                    if (this.highlightColor !== null) {
                        this.highlightColor = null;
                        this.invalidateColor();
                    }
                }
                setTexture(textureTop, textureLeft, textureBottom, textureRight) {
                    this.textureTop = textureTop;
                    this.textureLeft = textureLeft;
                    this.textureBottom = textureBottom;
                    this.textureRight = textureRight;
                    this.invalidateColor();
                }
                setHeightOffset(heightOffset) {
                    if (this.heightOffset != heightOffset) {
                        this.heightOffset = heightOffset;
                        this.buildPaths();
                        this.buildMiniPaths();
                    }
                }
                buildPaths() {
                    const depthHeight = this.getDepthHeight(false);
                    this.topPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                    this.leftDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
                    this.bottomDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
                    this.rightDepthPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
                }
                buildMiniPaths() {
                    this.topMiniPath = GridHexagon.buildPath(gridHexagonConstants_1.GridMiniHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                }
                invalidateColor() {
                    let entityColor = (this.entities.length > 0 && hexagonColorUtils_1.HexagonColorUtils.entityHexColor);
                    let voteColor = this.voteColor;
                    let secondaryVoteColor = this.secondaryVoteColor;
                    let highlightColor = this.highlightColor;
                    let factionColor = (this.faction > 0 && hexagonColorUtils_1.HexagonColorUtils.factionHexColors[this.faction - 1][this.height]);
                    let baseColor = (this.baseColor && this.baseColor[this.height]);
                    this.currentDrawColorNoVote = factionColor || baseColor;
                    this.currentDrawColor = voteColor || secondaryVoteColor || highlightColor || entityColor || factionColor || baseColor;
                    this.currentFactionColor = factionColor || baseColor;
                    this.currentMiniColor = voteColor || entityColor || factionColor || baseColor;
                    if (this.currentDrawColor && this.textureTop) {
                        this.drawCache = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                        this.drawCacheNoVote = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColorNoVote, this.textureTop.name);
                        this.drawMiniCache = GridHexagon.getMiniCacheImage(this.currentMiniColor);
                    }
                }
                drawLeftDepth(context, color) {
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
                }
                drawBottomDepth(context, color) {
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
                }
                drawRightDepth(context, color) {
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
                }
                drawTop(context, color) {
                    context.save();
                    {
                        context.save();
                        {
                            context.clip(this.topPath);
                            context.fillStyle = context.createPattern(this.textureTop.image, 'repeat');
                            context.fillRect(-gridHexagonConstants_1.GridHexagonConstants.width / 2, -gridHexagonConstants_1.GridHexagonConstants.height() / 2, gridHexagonConstants_1.GridHexagonConstants.width, gridHexagonConstants_1.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_2.DrawingUtils.makeTransparent(color.color, 0.6);
                            context.fill(this.topPath);
                            /*  if (this.currentDrawColorVote !== this.currentDrawColor) {
                             context.save();
                             context.scale(0.4, 0.4);
                             context.clip(this.topPath);
                             context.fillStyle = DrawingUtils.makeTransparent(this.currentDrawColorVote.color, 0.6);
                             context.fill(this.topPath);
                             context.restore();
                             }*/
                        }
                        context.restore();
                        context.strokeStyle = color.darkBorder;
                        context.stroke(this.topPath);
                    }
                    context.restore();
                }
                drawTopMini(context) {
                    var color = this.currentMiniColor.color;
                    context.fillStyle = color;
                    context.fill(this.topMiniPath);
                    /*        context.lineWidth = 3;
                     context.strokeStyle = color;
                     context.stroke(this.topMiniPath);*/
                }
                envelope() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_1.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_1.GridHexagonConstants.height();
                    size.height += this.getDepthHeight(false);
                    size.width += 12;
                    size.height += 6;
                    return size;
                }
                envelopeMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_1.GridMiniHexagonConstants.width;
                    size.height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
                    size.width += 20;
                    size.height += 20;
                    return size;
                }
                draw(context, offsetX, offsetY) {
                    if (this.showVotes) {
                        if (this.drawCache) {
                            context.drawImage(this.drawCache, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
                            /*
                                            context.fillStyle='black';
                                            context.font='11px bold san-serif';
                                            context.fillText(this.x+","+this.z,offsetX -10,offsetY +5)
                            */
                        }
                        else {
                            let cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
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
                            let cacheImage = GridHexagon.getCacheImage(this.getDepthHeight(false), this.currentDrawColor, this.textureTop.name);
                            if (cacheImage) {
                                this.drawCacheNoVote = cacheImage;
                            }
                            else {
                                this.drawCacheNoVote = this.prepDraw(this.currentDrawColorNoVote);
                            }
                            this.draw(context, offsetX, offsetY);
                        }
                    }
                }
                drawMini(context, offsetX, offsetY) {
                    if (this.drawMiniCache) {
                        context.drawImage(this.drawMiniCache, offsetX - GridHexagon.hexCenterMini.x, offsetY - GridHexagon.hexCenterMini.y);
                    }
                    else {
                        let miniCacheImage = GridHexagon.getMiniCacheImage(this.currentMiniColor);
                        if (miniCacheImage) {
                            this.drawMiniCache = miniCacheImage;
                        }
                        else {
                            this.prepMiniDraw();
                        }
                        this.drawMini(context, offsetX, offsetY);
                    }
                }
                getNeighbors() {
                    const neighbors = [];
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
                }
                static getCacheImage(height, hexColor, texture) {
                    const c = `${height}-${hexColor.color}-${texture}`;
                    return GridHexagon.caches[c];
                }
                static setCacheImage(height, hexColor, texture, img) {
                    const c = `${height}-${hexColor.color}-${texture}`;
                    GridHexagon.caches[c] = img;
                }
                static getMiniCacheImage(hexColor) {
                    const c = `m${hexColor.color}`;
                    return GridHexagon.caches[c];
                }
                static setMiniCacheImage(hexColor, img) {
                    const c = `m${hexColor.color}`;
                    GridHexagon.caches[c] = img;
                }
                static buildPath(path) {
                    const p2d = new Path2D();
                    for (let i = 0; i < path.length; i++) {
                        const point = path[i];
                        p2d.lineTo(point.x, point.y);
                    }
                    return p2d;
                }
                prepDraw(color) {
                    const can = document.createElement('canvas');
                    const ctx = can.getContext('2d');
                    const size = this.envelope();
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
                }
                prepMiniDraw() {
                    const can = document.createElement('canvas');
                    const ctx = can.getContext('2d');
                    const size = this.envelopeMini();
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
                }
                shouldDraw(viewPort) {
                    const x = this.getRealX();
                    const y = this.getRealZ();
                    let x2 = viewPort.x;
                    let padding = viewPort.padding;
                    let y2 = viewPort.y;
                    let width = viewPort.width;
                    return x > x2 - padding &&
                        x < x2 + width + padding &&
                        y > y2 - padding &&
                        y < y2 + viewPort.height + padding;
                }
                setShowVotes(showVotes) {
                    this.showVotes = showVotes;
                }
            };
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
            GridHexagonConstants = class GridHexagonConstants {
                static height() {
                    return this._height;
                }
                static depthHeight() {
                    return this._depthHeight;
                }
                ;
                static hexagonTopPolygon() {
                    return this._topPolygon;
                }
                ;
                static hexagonDepthLeftPolygon(depthHeight) {
                    return [new utils_1.Point(-this.width / 2, 0), new utils_1.Point(-this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight), new utils_1.Point(-this.width / 2, depthHeight), new utils_1.Point(-this.width / 2, 0)];
                }
                ;
                static hexagonDepthBottomPolygon(depthHeight) {
                    return [new utils_1.Point(-this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2)];
                }
                ;
                static hexagonDepthRightPolygon(depthHeight) {
                    return [new utils_1.Point(this.width / 4, this.height() / 2), new utils_1.Point(this.width / 2, 0), new utils_1.Point(this.width / 2, depthHeight), new utils_1.Point(this.width / 4, depthHeight + this.height() / 2), new utils_1.Point(this.width / 4, this.height() / 2)];
                }
                ;
            };
            GridHexagonConstants.width = 50;
            GridHexagonConstants.heightSkew = .7;
            GridHexagonConstants.depthHeightSkew = .3;
            GridHexagonConstants._height = Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
            GridHexagonConstants._depthHeight = GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
            GridHexagonConstants._topPolygon = [
                new utils_1.Point(-GridHexagonConstants.width / 2, 0),
                new utils_1.Point(-GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
                new utils_1.Point(GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
                new utils_1.Point(GridHexagonConstants.width / 2, 0),
                new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
                new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
                new utils_1.Point(-GridHexagonConstants.width / 2, 0)
            ];
            exports_7("GridHexagonConstants", GridHexagonConstants);
            GridMiniHexagonConstants = class GridMiniHexagonConstants {
                static height() {
                    return Math.sqrt(3) / 2 * this.width * this.heightSkew;
                }
                static hexagonTopPolygon() {
                    return [new utils_1.Point(-this.width / 2, 0), new utils_1.Point(-this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 4, -this.height() / 2), new utils_1.Point(this.width / 2, 0), new utils_1.Point(this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 4, this.height() / 2), new utils_1.Point(-this.width / 2, 0)];
                }
                ;
            };
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
System.register("game/hexUtils", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Node, HexUtils, Direction;
    return {
        setters: [],
        execute: function () {
            Node = class Node {
                constructor(parent, piece) {
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
                value() {
                    return this.x + (this.z * 5000);
                }
            };
            exports_8("Node", Node);
            HexUtils = class HexUtils {
                static distance(p1, p2) {
                    const x1 = p1.x;
                    const y1 = p1.z;
                    const x2 = p2.x;
                    const y2 = p2.z;
                    const du = x2 - x1;
                    const dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
                    if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
                        return Math.max(Math.abs(du), Math.abs(dv));
                    else
                        return Math.abs(du) + Math.abs(dv);
                }
                static orderBy(list, callback) {
                    const itms = [];
                    for (var i = 0; i < list.length; i++) {
                        const obj = list[i];
                        itms.push({ item: obj, val: callback(obj) });
                    }
                    itms.sort((a, b) => (a.val - b.val));
                    list = [];
                    for (var i = 0; i < itms.length; i++) {
                        const obj1 = itms[i];
                        list.push(obj1.item);
                    }
                    return list;
                }
                static mathSign(f) {
                    if (f < 0)
                        return -1;
                    else if (f > 0)
                        return 1;
                    return 0;
                }
                static getDirection(p1, p2) {
                    // console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
                    var upDown;
                    var leftRight;
                    if (p1.x % 2 == 0) {
                        if (p1.z === p2.z) {
                            upDown = 'up';
                        }
                        else if (p1.z < p2.z) {
                            upDown = 'down';
                        }
                        else if (p1.z > p2.z) {
                            upDown = 'up';
                        }
                    }
                    else {
                        if (p1.z === p2.z) {
                            upDown = 'down';
                        }
                        else if (p1.z < p2.z) {
                            upDown = 'down';
                        }
                        else if (p1.z > p2.z) {
                            upDown = 'up';
                        }
                    }
                    if (p1.x < p2.x) {
                        leftRight = "right";
                    }
                    else if (p1.x > p2.x) {
                        leftRight = "left";
                    }
                    else {
                        leftRight = "neither";
                    }
                    switch (leftRight) {
                        case "left":
                            switch (upDown) {
                                case "up":
                                    return Direction.TopLeft;
                                case "down":
                                    return Direction.BottomLeft;
                            }
                            break;
                        case "right":
                            switch (upDown) {
                                case "up":
                                    return Direction.TopRight;
                                case "down":
                                    return Direction.BottomRight;
                            }
                            break;
                        case "neither":
                            switch (upDown) {
                                case "up":
                                    return Direction.Top;
                                case "down":
                                    return Direction.Bottom;
                            }
                            break;
                    }
                }
            };
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
            HexBoard = class HexBoard {
                constructor() {
                    this.hexList = [];
                    this.hexBlock = {};
                    this.boardSize = { width: 0, height: 0 };
                    this.generation = -1;
                    this.entityManager = new entityManager_1.EntityManager(this);
                }
                setSize(width, height) {
                    this.boardSize.width = width;
                    this.boardSize.height = height;
                }
                gameDimensions() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_2.GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_2.GridHexagonConstants.height() * this.boardSize.height;
                    return size;
                }
                gameDimensionsMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_2.GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_2.GridMiniHexagonConstants.height() * this.boardSize.height;
                    return size;
                }
                addHexagon(hexagon) {
                    this.hexList.push(hexagon);
                    this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
                }
                reorderHexList() {
                    let hx = this.hexList.sort((a, b) => a.height - b.height);
                    let curHeight = 0;
                    let hx_h = [];
                    let c_h = [];
                    for (let t = 0; t < hx.length; t++) {
                        let hex = this.hexList[t];
                        if (hex.height != curHeight) {
                            curHeight = hex.height;
                            hx_h.push(c_h);
                            c_h = [];
                        }
                        c_h.push(hex);
                    }
                    hx_h.push(c_h);
                    for (let i = 0; i < hx_h.length; i++) {
                        hx_h[i] = hexUtils_1.HexUtils.orderBy(hx_h[i], m => (m.z) * 1000 + (m.x % 2) * -200);
                    }
                    console.log('----');
                    this.hexList = [];
                    this.hexListHeightMap = [];
                    for (let i = 0; i < hx_h.length; i++) {
                        let h = hx_h[i];
                        console.log(h.length);
                        this.hexListHeightMap[i] = h;
                        this.hexList.push(...h);
                    }
                    // this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200 + m.height);
                }
                getHexAtSpot(x, z) {
                    return this.hexBlock[x + z * 5000];
                }
                getHexAtSpotDirection(x, z, direction) {
                    switch (direction) {
                        case hexUtils_1.Direction.Top:
                            z -= 1;
                            break;
                        case hexUtils_1.Direction.Bottom:
                            z += 1;
                            break;
                        case hexUtils_1.Direction.TopLeft:
                            if (x % 2 === 1) {
                                z -= 1;
                            }
                            x -= 1;
                            break;
                        case hexUtils_1.Direction.BottomLeft:
                            if (x % 2 === 0) {
                                z += 1;
                            }
                            x -= 1;
                            break;
                        case hexUtils_1.Direction.TopRight:
                            if (x % 2 === 1) {
                                z -= 1;
                            }
                            x += 1;
                            break;
                        case hexUtils_1.Direction.BottomRight:
                            if (x % 2 === 0) {
                                z += 1;
                            }
                            x += 1;
                            break;
                    }
                    return this.hexBlock[x + z * 5000];
                }
                pathFind(start, finish) {
                    const myPathStart = new hexUtils_1.Node(null, start);
                    const myPathEnd = new hexUtils_1.Node(null, finish);
                    let aStar = [];
                    let open = [myPathStart];
                    let closed = [];
                    const result = [];
                    let neighbors;
                    let node;
                    let path;
                    let length, max, min, i, j;
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
                                const n = this.getHexAtSpot(neighbors[i].x, neighbors[i].z);
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
                }
                initialize(state) {
                    this.generation = state.generation;
                    let terrain = state.terrain;
                    const str = terrain.boardStr;
                    this.setSize(terrain.width, terrain.height);
                    let stoneTop = assetManager_1.AssetManager.assets['Stone.Top'];
                    let stoneLeft = assetManager_1.AssetManager.assets['Stone.Left'];
                    let stoneBottom = assetManager_1.AssetManager.assets['Stone.Bottom'];
                    let stoneRight = assetManager_1.AssetManager.assets['Stone.Right'];
                    let grassTop = assetManager_1.AssetManager.assets['Grass.Top'];
                    let grassLeft = assetManager_1.AssetManager.assets['Grass.Left'];
                    let grassBottom = assetManager_1.AssetManager.assets['Grass.Bottom'];
                    let grassRight = assetManager_1.AssetManager.assets['Grass.Right'];
                    let waterTop = assetManager_1.AssetManager.assets['Water.Top'];
                    let waterLeft = assetManager_1.AssetManager.assets['Water.Left'];
                    let waterBottom = assetManager_1.AssetManager.assets['Water.Bottom'];
                    let waterRight = assetManager_1.AssetManager.assets['Water.Right'];
                    let ys = str.split('|');
                    for (let z = 0; z < terrain.height; z++) {
                        const yItem = ys[z].split('');
                        for (let x = 0; x < terrain.width; x++) {
                            const result = parseInt(yItem[x]);
                            let gridHexagon = new gridHexagon_1.GridHexagon();
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
                }
                updateFactionEntities(state) {
                    this.generation = state.generation;
                    let factionData = state.factionData;
                    let ys = factionData.split('|');
                    for (let z = 0; z < state.terrain.height; z++) {
                        const yItem = ys[z].split('');
                        for (let x = 0; x < state.terrain.width; x++) {
                            const faction = parseInt(yItem[x]);
                            let hex = this.getHexAtSpot(x, z);
                            hex.setFaction(faction);
                        }
                    }
                    for (let i = 0; i < state.entities.length; i++) {
                        let stateEntity = state.entities[i];
                        let entity = this.entityManager.getEntityById(stateEntity.id);
                        let gridHexagon = this.getHexAtSpot(stateEntity.x, stateEntity.z);
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
                                case "Heli": {
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
                            entity.markAlive();
                            this.entityManager.addEntity(entity);
                        }
                        else {
                            entity.setHealth(stateEntity.health);
                            entity.markAlive();
                            entity.setTile(gridHexagon);
                        }
                    }
                    for (let i = this.entityManager.entities.length - 1; i >= 0; i--) {
                        let entity = this.entityManager.entities[i];
                        if (!entity.stillAlive) {
                            this.entityManager.killEntity(entity);
                        }
                        else {
                            entity.stillAlive = false;
                        }
                    }
                }
                drawBoard(context, viewPort) {
                    context.lineWidth = 1;
                    for (let j = 0; j < this.visibleHexListHeightMap.length; j++) {
                        let hexList = this.visibleHexListHeightMap[j];
                        let entList = this.visibleEntityHeightMap[j];
                        for (let i = 0; i < hexList.length; i++) {
                            const gridHexagon = hexList[i];
                            gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
                        }
                        for (let j = 0; j < entList.length; j++) {
                            entList[j].draw(context);
                        }
                    }
                }
                resetVisibleHexList(viewPort) {
                    let visibleHexList = new Array(10);
                    let visibleEntity = new Array(10);
                    for (let i = 0; i < 10; i++) {
                        visibleHexList[i] = [];
                        visibleEntity[i] = [];
                    }
                    for (let j = 0; j < this.hexListHeightMap.length; j++) {
                        let hexList = this.hexListHeightMap[j];
                        for (let i = 0; i < hexList.length; i++) {
                            const gridHexagon = hexList[i];
                            if (gridHexagon.shouldDraw(viewPort)) {
                                visibleHexList[j].push(gridHexagon);
                                let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                                if (entities.length) {
                                    let aboveMe = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_1.Direction.Top);
                                    let localYOffset = 0;
                                    if (aboveMe && aboveMe.height > gridHexagon.height) {
                                        localYOffset = 1;
                                    }
                                    else {
                                        let topLeft = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_1.Direction.TopLeft);
                                        if (topLeft && topLeft.height > gridHexagon.height) {
                                            localYOffset = 1;
                                        }
                                        else {
                                            let topRight = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_1.Direction.TopRight);
                                            if (topRight && topRight.height > gridHexagon.height) {
                                                localYOffset = 1;
                                            }
                                        }
                                    }
                                    for (let c = 0; c < entities.length; c++) {
                                        visibleEntity[j + entities[c].getYOffset() + localYOffset].push(entities[c]);
                                    }
                                }
                            }
                        }
                    }
                    this.visibleHexListHeightMap = visibleHexList;
                    this.visibleEntityHeightMap = visibleEntity;
                }
            };
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
            AnimationManager = class AnimationManager {
                constructor(hexBoard) {
                    this.hexBoard = hexBoard;
                    this.frameIndex = 0;
                    this.isRunning = false;
                }
                reset() {
                    this.frames = [];
                    this.frameIndex = 0;
                    this.isRunning = false;
                }
                setVotes(votes) {
                    let allFrames = [];
                    let maxLength = 0;
                    for (let i = 0; i < votes.length; i++) {
                        let vote = votes[i];
                        let action = vote.action;
                        let entity = this.hexBoard.entityManager.getEntityById(action.entityId);
                        if (!entity) {
                            //idk
                            debugger;
                            continue;
                        }
                        let actionFrames = entity.getActionFrames(action, this.hexBoard);
                        if (actionFrames.length > maxLength) {
                            maxLength = actionFrames.length;
                        }
                        allFrames.push(actionFrames);
                    }
                    this.frames = [];
                    for (let c = 0; c < maxLength; c++) {
                        let frameCollection = [];
                        for (let i = 0; i < allFrames.length; i++) {
                            if (allFrames[i][c]) {
                                frameCollection.push(allFrames[i][c]);
                            }
                        }
                        this.frames.push(frameCollection);
                    }
                }
                start() {
                    this.isRunning = true;
                    let duration = 400;
                    let frames = this.frames[this.frameIndex++];
                    if (!frames) {
                        this.isRunning = false;
                        this.complete();
                        return;
                    }
                    for (let i = 0; i < frames.length; i++) {
                        let frame = frames[i];
                        frame.entity.onAnimationStart(frame);
                        frame.entity.executeFrame(this.hexBoard, frame, duration);
                    }
                    setTimeout(() => {
                        for (let i = 0; i < frames.length; i++) {
                            let frame = frames[i];
                            frame.entity.onAnimationComplete(frame);
                        }
                        this.start();
                    }, duration);
                }
                onComplete(callback) {
                    this.complete = callback;
                }
            };
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
            Help = class Help {
                static lerp(start, end, amt) {
                    return start + (end - start) * amt;
                }
                static mod(j, n) {
                    return ((j % n) + n) % n;
                }
                static getBase64Image(data) {
                    let canvas = document.createElement("canvas");
                    canvas.width = data.width;
                    canvas.height = data.height;
                    let ctx = canvas.getContext("2d");
                    ctx.putImageData(data, 0, 0);
                    let dataURL = canvas.toDataURL("image/png");
                    return dataURL;
                }
                static getImageData(image) {
                    let canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    let data = ctx.getImageData(0, 0, image.width, image.height);
                    return data;
                }
                static isLoaded(element) {
                    return element.getAttribute("loaded") == "true";
                }
                static loaded(element, set) {
                    element.setAttribute("loaded", set ? "true" : "false");
                }
                static loadSprite(src, complete) {
                    let image = new Image();
                    image.addEventListener("load", e => {
                        Help.loaded(image, true);
                        if (complete)
                            complete(image);
                    }, false);
                    image.src = src;
                    return image;
                }
                static degToRad(angle) {
                    return angle * Math.PI / 180;
                }
                static sign(m) {
                    return m == 0 ? 0 : (m < 0 ? -1 : 1);
                }
                static floor(spinDashSpeed) {
                    if (spinDashSpeed > 0)
                        return ~~spinDashSpeed;
                    return Math.floor(spinDashSpeed) | 0;
                }
                static max(f1, f2) {
                    return f1 < f2 ? f2 : f1;
                }
                static min(f1, f2) {
                    return f1 > f2 ? f2 : f1;
                }
                static getQueryString() {
                    let result = {};
                    let queryString = window.location.search.substring(1);
                    let re = new RegExp("/([^&=]+)=([^&]*)/g");
                    let m;
                    while ((m = re.exec(queryString)) != null) {
                        result[window.decodeURIComponent(m[1])] = window.decodeURIComponent(m[2]);
                    }
                    return result;
                }
                static merge(base, update) {
                    for (let i in update) {
                        base[i] = update[i];
                    }
                    return base;
                }
            };
            exports_12("Help", Help);
        }
    };
});
System.register("ui/gameService", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var GameService;
    return {
        setters: [],
        execute: function () {
            GameService = class GameService {
                static setSelectedEntity(entity) {
                    this.selectedEntity = entity;
                    this.onSetSelectedEntity(entity);
                }
                static resetSelection() {
                    this.selectedEntity = null;
                    this.selectedHex = null;
                    this.selectedAction = null;
                    this.onSetSelectedEntity(null);
                }
                static setGameManager(gameManager) {
                    this.gameManager = gameManager;
                }
                ;
                static getGameManager() {
                    return this.gameManager;
                }
                ;
            };
            exports_13("GameService", GameService);
        }
    };
});
System.register("entities/entityManager", ["game/AssetManager", "game/gridHexagonConstants", "game/hexUtils", "animationManager", "utils/help", "utils/hexagonColorUtils"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
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
            EntityManager = class EntityManager {
                constructor(hexBoard) {
                    this.hexBoard = hexBoard;
                    this.entities = [];
                    this.entityKeys = {};
                    this.entitiesMap = {};
                }
                tick() {
                    for (let i = 0; i < this.entities.length; i++) {
                        let entity = this.entities[i];
                        entity.tick();
                    }
                }
                getEntitiesAtTile(item) {
                    return this.entitiesMap[item.x + item.z * 5000] || [];
                }
                addEntity(entity) {
                    this.entities.push(entity);
                    this.entityKeys[entity.id] = entity;
                }
                empty() {
                    this.entities.length = 0;
                    this.entitiesMap = {};
                    this.entityKeys = {};
                }
                getEntityById(id) {
                    return this.entityKeys[id];
                }
                removeEntityFromTile(tile, entity) {
                    let entities = this.entitiesMap[tile.x + tile.z * 5000];
                    entities.splice(entities.indexOf(entity), 1);
                    this.entitiesMap[tile.x + tile.z * 5000] = entities;
                }
                killEntity(entity) {
                    var tile = entity.getTile();
                    let entities = this.entitiesMap[tile.x + tile.z * 5000];
                    entities.splice(entities.indexOf(entity), 1);
                    this.entitiesMap[tile.x + tile.z * 5000] = entities;
                    this.entities.splice(this.entities.indexOf(entity), 1);
                }
                addEntityToTile(tile, entity) {
                    if (!this.entitiesMap[tile.x + tile.z * 5000]) {
                        this.entitiesMap[tile.x + tile.z * 5000] = [];
                    }
                    this.entitiesMap[tile.x + tile.z * 5000].push(entity);
                }
            };
            exports_14("EntityManager", EntityManager);
            BaseEntity = class BaseEntity {
                constructor(entityManager, entity, totalFrames, animationSpeed) {
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
                    this.stillAlive = false;
                    this.faction = entity.factionId;
                    this.setHealth(entity.health);
                }
                setId(id) {
                    this.id = id;
                }
                setHealth(health) {
                    this.health = health;
                }
                setTile(tile) {
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
                }
                getTile() {
                    return this.tile;
                }
                draw(context) {
                    this._drawTickNumber++;
                    if (this._drawTickNumber % this.animationSpeed === 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
                    }
                    if (this.currentTick != -1) {
                        let percent = this.currentTick / this.durationTicks;
                        if (percent < 1) {
                            this.x = help_1.Help.lerp(this.animateFromHex.getRealX(), this.animateToHex.getRealX(), percent);
                            this.z = help_1.Help.lerp(this.animateFromHex.getRealZ(), this.animateToHex.getRealZ(), percent);
                            this.currentTick++;
                        }
                    }
                }
                tick() {
                }
                onAnimationComplete(frame) {
                    if (frame.type == animationManager_1.AnimationFrameType.Stop) {
                        this.currentTick = -1;
                        this.durationTicks = -1;
                        this.animateToHex = null;
                        this.animateFromHex = null;
                        return;
                    }
                    let tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                    let neighbors = tile.getNeighbors();
                    tile.setFaction(this.faction);
                    for (let j = 0; j < neighbors.length; j++) {
                        let ne = neighbors[j];
                        let tile = this.entityManager.hexBoard.getHexAtSpot(ne.x, ne.z);
                        if (!tile)
                            continue;
                        tile.setFaction(this.faction);
                    }
                    this.x = tile.getRealX();
                    this.z = tile.getRealZ();
                    this.setTile(tile);
                }
                onAnimationStart(frame) {
                    if (frame.type == animationManager_1.AnimationFrameType.Start) {
                        this.currentTick = -1;
                        this.durationTicks = -1;
                        this.animateToHex = null;
                        this.animateFromHex = null;
                        return;
                    }
                }
                resetVotes() {
                    this.currentVotes.length = 0;
                    this.totalVoteCount = 0;
                    this.getTile().clearVoteColor();
                    this.getTile().clearSecondaryVoteColor();
                }
                pushVote(vote) {
                    this.currentVotes.push(vote);
                    let votes = 0;
                    for (let i = 0; i < this.currentVotes.length; i++) {
                        votes += this.currentVotes[i].votes;
                    }
                    this.totalVoteCount = votes;
                    this.getTile().setVoteColor(hexagonColorUtils_3.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
                }
                setSecondaryVoteColor(spot) {
                    let votes = 0;
                    for (let i = 0; i < this.currentVotes.length; i++) {
                        let currentVote = this.currentVotes[i];
                        switch (currentVote.action.actionType) {
                            case "Move":
                                let moveAction = currentVote.action;
                                if (moveAction.x == spot.x && moveAction.z == spot.z) {
                                    votes += currentVote.votes;
                                }
                                break;
                            case "Attack":
                                let attackAction = currentVote.action;
                                if (attackAction.x == spot.x && attackAction.z == spot.z) {
                                    votes += currentVote.votes;
                                }
                                break;
                            case "Spawn":
                                let spawnAction = currentVote.action;
                                if (spawnAction.x == spot.x && spawnAction.z == spot.z) {
                                    votes += currentVote.votes;
                                }
                                break;
                        }
                    }
                    if (votes > 0) {
                        spot.setSecondaryVoteColor(hexagonColorUtils_3.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
                    }
                }
                markAlive() {
                    this.stillAlive = true;
                }
            };
            exports_14("BaseEntity", BaseEntity);
            SixDirectionEntity = class SixDirectionEntity extends BaseEntity {
                constructor() {
                    super(...arguments);
                    this.currentDirection = hexUtils_2.Direction.Bottom;
                }
                setDirection(direction) {
                    switch (direction) {
                        case "Bottom":
                            this.currentDirection = hexUtils_2.Direction.Bottom;
                            break;
                        case "Top":
                            this.currentDirection = hexUtils_2.Direction.Top;
                            break;
                        case "BottomLeft":
                            this.currentDirection = hexUtils_2.Direction.BottomLeft;
                            break;
                        case "BottomRight":
                            this.currentDirection = hexUtils_2.Direction.BottomRight;
                            break;
                        case "TopLeft":
                            this.currentDirection = hexUtils_2.Direction.TopLeft;
                            break;
                        case "TopRight":
                            this.currentDirection = hexUtils_2.Direction.TopRight;
                            break;
                    }
                }
                draw(context) {
                    super.draw(context);
                    context.save();
                    context.translate(this.x, this.z);
                    let asset = assetManager_2.AssetManager.assets[this.entityType];
                    let image = asset.images[this.animationFrame];
                    let ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width) / 2;
                    let width = gridHexagonConstants_3.GridHexagonConstants.width / 2;
                    let height = asset.size.height * ratio;
                    context.rotate(this.directionToRadians());
                    context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
                    context.restore();
                }
                getActionFrames(action, hexBoard) {
                    let frames = [];
                    switch (action.actionType) {
                        case "Move":
                            let moveAction = action;
                            let tile = this.getTile();
                            let path = hexBoard.pathFind(hexBoard.getHexAtSpot(tile.x, tile.z), hexBoard.getHexAtSpot(moveAction.x, moveAction.z));
                            frames.push({
                                type: animationManager_1.AnimationFrameType.Start,
                                startX: path[0].x,
                                startZ: path[0].z,
                                entity: this
                            });
                            for (let i = 1; i < path.length; i++) {
                                let p = path[i];
                                let oldP = path[i - 1];
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
                }
                executeFrame(hexBoard, frame, duration) {
                    switch (frame.type) {
                        case animationManager_1.AnimationFrameType.Move:
                            let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                            let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                            this.currentDirection = hexUtils_2.HexUtils.getDirection(fromHex, toHex);
                            this.animateFromHex = fromHex;
                            this.animateToHex = toHex;
                            this.durationTicks = Math.floor(duration / 16);
                            this.currentTick = 0;
                            break;
                    }
                }
                directionToRadians() {
                    let degrees = 0;
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
                }
            };
            exports_14("SixDirectionEntity", SixDirectionEntity);
            StationaryEntity = class StationaryEntity extends BaseEntity {
                getActionFrames(action, hexBoard) {
                    return [];
                }
                draw(context) {
                    super.draw(context);
                    context.save();
                    context.translate(this.x, this.z);
                    let assetName = this.entityType;
                    let asset = assetManager_2.AssetManager.assets[assetName];
                    let image = asset.image || asset.images[this.animationFrame];
                    let ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width);
                    let shrink = .75;
                    let width = gridHexagonConstants_3.GridHexagonConstants.width * shrink;
                    let height = asset.size.height * ratio * shrink;
                    context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
                    context.restore();
                }
                executeFrame(hexBoard, frame, duration) {
                }
            };
            exports_14("StationaryEntity", StationaryEntity);
            HeliEntity = class HeliEntity extends SixDirectionEntity {
                realYOffset() {
                    let offset = gridHexagonConstants_3.GridHexagonConstants.depthHeight();
                    return -(Math.sin(this._drawTickNumber / 10)) * offset + offset * 1;
                }
                realXOffset() {
                    return 0;
                }
                constructor(entityManager, entity) {
                    super(entityManager, entity, 2, 10);
                    this.entityType = 'Heli';
                }
                getYOffset() {
                    return 1;
                }
            };
            exports_14("HeliEntity", HeliEntity);
            TankEntity = class TankEntity extends SixDirectionEntity {
                constructor(entityManager, entity) {
                    super(entityManager, entity, 2, 10);
                    this.entityType = 'Tank';
                }
                realYOffset() {
                    return 0;
                }
                realXOffset() {
                    return 0;
                }
                getYOffset() {
                    return 0;
                }
            };
            exports_14("TankEntity", TankEntity);
            InfantryEntity = class InfantryEntity extends SixDirectionEntity {
                constructor(entityManager, entity) {
                    super(entityManager, entity, 2, 10);
                    this.entityType = 'Infantry';
                }
                realYOffset() {
                    return 0;
                }
                realXOffset() {
                    return 0;
                }
                getYOffset() {
                    return 0;
                }
            };
            exports_14("InfantryEntity", InfantryEntity);
            MainBaseEntity = class MainBaseEntity extends StationaryEntity {
                constructor(entityManager, entity) {
                    super(entityManager, entity, 0, 0);
                    this.entityType = 'MainBase';
                }
                realYOffset() {
                    return 0;
                }
                realXOffset() {
                    return 0;
                }
                getYOffset() {
                    return 0;
                }
            };
            exports_14("MainBaseEntity", MainBaseEntity);
            RegularBaseEntity = class RegularBaseEntity extends StationaryEntity {
                constructor(entityManager, entity) {
                    super(entityManager, entity, 0, 0);
                    this.entityType = 'Base';
                }
                realYOffset() {
                    return 0;
                }
                realXOffset() {
                    return 0;
                }
                getYOffset() {
                    return 0;
                }
            };
            exports_14("RegularBaseEntity", RegularBaseEntity);
            EntityDetail = class EntityDetail {
            };
            exports_14("EntityDetail", EntityDetail);
            EntityDetails = class EntityDetails {
                constructor() {
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
                    this.details["Base"].defaultAction = 'spawn';
                    this.details["MainBase"] = new EntityDetail();
                    this.details["MainBase"].moveRadius = 0;
                    this.details["MainBase"].health = 30;
                    this.details["MainBase"].attackRadius = 0;
                    this.details["MainBase"].attackPower = 0;
                    this.details["MainBase"].ticksToSpawn = 0;
                    this.details["MainBase"].healthRegenRate = 0;
                    this.details["MainBase"].solid = true;
                    this.details["MainBase"].spawnRadius = 4;
                    this.details["MainBase"].defaultAction = 'spawn';
                    this.details["Tank"] = new EntityDetail();
                    this.details["Tank"].moveRadius = 4;
                    this.details["Tank"].health = 8;
                    this.details["Tank"].attackRadius = 8;
                    this.details["Tank"].attackPower = 3;
                    this.details["Tank"].ticksToSpawn = 3;
                    this.details["Tank"].healthRegenRate = 1;
                    this.details["Tank"].solid = false;
                    this.details["Tank"].spawnRadius = 0;
                    this.details["Tank"].defaultAction = 'move';
                    this.details["Heli"] = new EntityDetail();
                    this.details["Heli"].moveRadius = 10;
                    this.details["Heli"].health = 2;
                    this.details["Heli"].attackRadius = 3;
                    this.details["Heli"].attackPower = 3;
                    this.details["Heli"].ticksToSpawn = 4;
                    this.details["Heli"].healthRegenRate = 1;
                    this.details["Heli"].solid = false;
                    this.details["Heli"].spawnRadius = 0;
                    this.details["Heli"].defaultAction = 'move';
                    this.details["Infantry"] = new EntityDetail();
                    this.details["Infantry"].moveRadius = 8;
                    this.details["Infantry"].health = 4;
                    this.details["Infantry"].attackRadius = 3;
                    this.details["Infantry"].attackPower = 1;
                    this.details["Infantry"].ticksToSpawn = 2;
                    this.details["Infantry"].healthRegenRate = 1;
                    this.details["Infantry"].solid = false;
                    this.details["Infantry"].spawnRadius = 2;
                    this.details["Infantry"].defaultAction = 'move';
                }
            };
            EntityDetails.instance = new EntityDetails();
            exports_14("EntityDetails", EntityDetails);
        }
    };
});
System.register("dataServices", [], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var rawDeflateWorker, WorkerService, DataService;
    return {
        setters: [],
        execute: function () {
            rawDeflateWorker = new Worker("/libs/RawDeflate.js");
            WorkerService = class WorkerService {
                static start() {
                    rawDeflateWorker.onmessage = (ev) => {
                        let p = WorkerService.payloads[ev.data.key];
                        delete WorkerService.payloads[ev.data.key];
                        if (p)
                            p(ev.data.payload);
                    };
                }
                static deflate(data) {
                    return new Promise((resolve, reject) => {
                        let key = (Math.random() * 1000000).toFixed(0);
                        WorkerService.payloads[key] = resolve;
                        rawDeflateWorker.postMessage({ key: key, payload: data });
                    });
                }
            };
            WorkerService.payloads = {};
            exports_15("WorkerService", WorkerService);
            WorkerService.start();
            DataService = class DataService {
                static async getGameMetrics() {
                    try {
                        let response = await fetch(this.voteServer + 'api/game/metrics', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        });
                        if (!response.ok)
                            throw new Error(response.statusText);
                        let json = await response.json();
                        var m = await WorkerService.deflate(json.data);
                        m.metrics.nextGenerationDate = new Date(m.metrics.nextGeneration);
                        return m.metrics;
                    }
                    catch (ex) {
                        console.error('Fetch Error :-S', ex);
                        return ex;
                    }
                }
                static async vote(vote) {
                    try {
                        let response = await fetch(this.voteServer + 'api/game/vote', {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(vote)
                        });
                        let json = await response.json();
                        if (json.meta.errors) {
                            console.error(json.meta.errors);
                            return null;
                        }
                        return json.data;
                    }
                    catch (ex) {
                        console.error(ex);
                        return ex;
                    }
                }
                static async getGameState() {
                    try {
                        let response = await fetch(this.voteServer + 'api/game/state', {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        });
                        if (!response.ok)
                            throw new Error(response.statusText);
                        let json = await response.json();
                        var m = await WorkerService.deflate(json.data);
                        return m.state;
                    }
                    catch (ex) {
                        console.error('Fetch Error :-S', ex);
                        return ex;
                    }
                }
                static async getGenerationResult(generation) {
                    try {
                        let response = await fetch(this.voteServer + 'api/game/result?generation=' + generation, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        });
                        if (!response.ok)
                            throw new Error(response.statusText);
                        let json = await response.json();
                        var m = await WorkerService.deflate(json.data);
                        return m.metrics;
                    }
                    catch (ex) {
                        console.error('Fetch Error :-S', ex);
                        return ex;
                    }
                }
            };
            // private static voteServer: string = 'https://vote.socialwargames.com/';
            DataService.voteServer = 'http://localhost:3568/';
            DataService.compressor = new Compressor();
            exports_15("DataService", DataService);
        }
    };
});
System.register("game/gameManager", ["entities/entityManager", "utils/drawingUtilities", "game/hexUtils", "game/hexBoard", "dataServices", "animationManager", "game/gridHexagonConstants", "utils/hexagonColorUtils", "ui/gameService"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var entityManager_2, drawingUtilities_3, hexUtils_3, hexBoard_1, dataServices_1, animationManager_2, gridHexagonConstants_4, hexagonColorUtils_4, gameService_1, GameManager, ViewPort;
    return {
        setters: [
            function (entityManager_2_1) {
                entityManager_2 = entityManager_2_1;
            },
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
            GameManager = class GameManager {
                constructor() {
                    this.viewPort = new ViewPort();
                    gameService_1.GameService.setGameManager(this);
                }
                async init() {
                    hexagonColorUtils_4.HexagonColorUtils.setupColors();
                    this.hexBoard = new hexBoard_1.HexBoard();
                    this.animationManager = new animationManager_2.AnimationManager(this.hexBoard);
                    let state = await dataServices_1.DataService.getGameState();
                    gameService_1.GameService.secondsPerGeneration = state.tickIntervalSeconds;
                    this.hexBoard.initialize(state);
                    this.createMiniCanvas();
                    this.rebuildMiniBoard(false);
                    await this.checkState();
                    gameService_1.GameService.hasData && gameService_1.GameService.hasData();
                    let lx = localStorage.getItem("lastX");
                    let ly = localStorage.getItem("lastY");
                    if (lx && ly) {
                        this.setView(parseInt(lx), parseInt(ly));
                    }
                    /*        setTimeout(() => {
                     this.randomTap();
                     }, 1000);*/
                    setTimeout(async () => {
                        await this.checkState();
                    }, 4 * 1000);
                }
                createMiniCanvas() {
                    let size = this.hexBoard.gameDimensionsMini();
                    let canvas = document.createElement("canvas");
                    canvas.width = size.width + 20;
                    canvas.height = size.height + 20;
                    let context = canvas.getContext("2d");
                    this.miniCanvas = canvas;
                    this.miniContext = context;
                    let leftBubble = document.getElementById('leftBubble');
                    leftBubble.appendChild(this.miniCanvas);
                    let mc = new Hammer.Manager(leftBubble);
                    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
                    mc.add(new Hammer.Tap());
                    let tapStart = { x: 0, y: 0 };
                    mc.on('panstart', (ev) => {
                        tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
                        tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
                        tapStart.x = tapStart.x || 0;
                        tapStart.y = tapStart.y || 0;
                        return true;
                    });
                    mc.on('panmove', (ev) => {
                        let width = leftBubble.clientWidth;
                        let height = leftBubble.clientHeight;
                        let rx = (tapStart.x + ev.deltaX);
                        let ry = (tapStart.y + ev.deltaY);
                        if (rx < width * 2 / 5 && rx > -size.width + width * 2 / 5) {
                            canvas.style.marginLeft = rx + "px";
                        }
                        if (ry < height * 2 / 5 && ry > -size.height + height * 2 / 5) {
                            canvas.style.marginTop = ry + "px";
                        }
                    });
                    mc.on('tap', (ev) => {
                        let rect = leftBubble.getBoundingClientRect();
                        tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
                        tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
                        tapStart.x = tapStart.x || 0;
                        tapStart.y = tapStart.y || 0;
                        let x = ev.center.x - tapStart.x - rect.left - 15;
                        let y = ev.center.y - tapStart.y - rect.top - 15;
                        let item = this.getMiniHexAtPoint(x, y);
                        if (item) {
                            this.centerOnHex(item);
                        }
                    });
                }
                getMiniHexAtPoint(clickX, clickY) {
                    let lastClick = null;
                    for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
                        const x = gridHexagonConstants_4.GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        let z = gridHexagon.z * gridHexagonConstants_4.GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_4.GridMiniHexagonConstants.height() / 2) : 0);
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_4.GridMiniHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                }
                rebuildMiniBoard(justEntities, entity) {
                    let size = this.hexBoard.gameDimensionsMini();
                    this.miniContext.save();
                    if (!justEntities)
                        this.miniContext.clearRect(0, 0, size.width + 20, size.height + 20);
                    this.miniContext.translate(10, 10);
                    for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
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
                }
                draw(context) {
                    context.save();
                    context.translate(-this.viewPort.x, -this.viewPort.y);
                    this.hexBoard.drawBoard(context, this.viewPort);
                    context.restore();
                }
                tick() {
                    this.hexBoard.entityManager.tick();
                }
                cantAct() {
                    return this.checking || !this.hexBoard || this.hexBoard.generation == -1 || this.animationManager.isRunning;
                }
                async checkState() {
                    if (this.cantAct())
                        return;
                    this.checking = true;
                    let metrics = await dataServices_1.DataService.getGameMetrics();
                    let seconds = (+metrics.nextGenerationDate - +new Date()) / 1000;
                    gameService_1.GameService.setSecondsToNextGeneration(seconds);
                    for (let i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
                        let ent = this.hexBoard.entityManager.entities[i];
                        ent.resetVotes();
                    }
                    if (this.hexBoard.generation != metrics.generation) {
                        console.log(`Gen - old: ${this.hexBoard.generation} new ${metrics.generation}`);
                        let result = await dataServices_1.DataService.getGenerationResult(this.hexBoard.generation);
                        for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                            let hex = this.hexBoard.hexList[i];
                            hex.clearSecondaryVoteColor();
                            hex.clearHighlightColor();
                            hex.clearVoteColor();
                            hex.setShowVotes(true);
                        }
                        if (!result) {
                            console.log('getting new game state 1');
                            dataServices_1.DataService.getGameState().then((state) => {
                                console.log('game updated3 ');
                                this.hexBoard.updateFactionEntities(state);
                                this.rebuildMiniBoard(false);
                                this.checking = false;
                            });
                            return;
                        }
                        this.animationManager.reset();
                        this.animationManager.setVotes(result.votes);
                        this.animationManager.onComplete(() => {
                            console.log('getting new game state 2');
                            dataServices_1.DataService.getGameState().then((state) => {
                                console.log('game updated4 ');
                                this.hexBoard.updateFactionEntities(state);
                                this.rebuildMiniBoard(false);
                                this.checking = false;
                            });
                        });
                        this.animationManager.start();
                    }
                    else {
                        for (let i = 0; i < metrics.votes.length; i++) {
                            let vote = metrics.votes[i];
                            let action = vote.action;
                            let entity = this.hexBoard.entityManager.getEntityById(action.entityId);
                            entity.pushVote(vote);
                        }
                        this.rebuildMiniBoard(true);
                    }
                    this.checking = false;
                    setTimeout(async () => {
                        await this.checkState();
                    }, 1000 * (seconds + 2 > 5 ? 5 : seconds + 2));
                }
                startAction() {
                    this.resetBoardColors();
                    let entities = this.hexBoard.entityManager.getEntitiesAtTile(gameService_1.GameService.selectedHex);
                    let selectedEntity = entities[0];
                    if (!selectedEntity) {
                        gameService_1.GameService.resetSelection();
                        return;
                    }
                    for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                        let h = this.hexBoard.hexList[i];
                        h.setShowVotes(false);
                    }
                    let radius = 0;
                    let entityDetail = entityManager_2.EntityDetails.instance.details[selectedEntity.entityType];
                    if (!gameService_1.GameService.selectedAction) {
                        gameService_1.GameService.selectedAction = entityDetail.defaultAction;
                    }
                    gameService_1.GameService.setSelectedEntity(selectedEntity);
                    let selectedAction = gameService_1.GameService.selectedAction;
                    switch (selectedAction) {
                        case "move":
                            radius = entityDetail.moveRadius;
                            break;
                        case "attack":
                            radius = entityDetail.attackRadius;
                            break;
                        case "spawn":
                            radius = entityDetail.spawnRadius;
                            break;
                    }
                    let spots = this.findAvailableSpots(radius, gameService_1.GameService.selectedHex);
                    gameService_1.GameService.selectedHex.setShowVotes(true);
                    for (let i = 0; i < spots.length; i++) {
                        let spot = spots[i];
                        if (spot == gameService_1.GameService.selectedHex)
                            continue;
                        let entities = this.hexBoard.entityManager.getEntitiesAtTile(spot);
                        switch (selectedAction) {
                            case "move":
                                {
                                    if (entities.length > 0)
                                        continue;
                                    let path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        spot.setHighlightColor(hexagonColorUtils_4.HexagonColorUtils.moveHighlightColor);
                                        spot.setShowVotes(true);
                                        selectedEntity.setSecondaryVoteColor(spot);
                                        // spot.setHeightOffset(.25);
                                    }
                                }
                                break;
                            case "attack":
                                {
                                    if (entities[0] && entities[0].faction == gameService_1.GameService.selectedEntity.faction)
                                        continue;
                                    let path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        if (entities.length == 0) {
                                            spot.setHighlightColor(hexagonColorUtils_4.HexagonColorUtils.moveHighlightColor);
                                            spot.setShowVotes(true);
                                            selectedEntity.setSecondaryVoteColor(spot);
                                            // spot.setHeightOffset(.25);
                                        }
                                        else {
                                            spot.setHighlightColor(hexagonColorUtils_4.HexagonColorUtils.attackHighlightColor);
                                            spot.setShowVotes(true);
                                            selectedEntity.setSecondaryVoteColor(spot);
                                            // spot.setHeightOffset(.25);
                                        }
                                    }
                                }
                                break;
                            case "spawn":
                                {
                                    if (entities.length > 0)
                                        continue;
                                    let path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        spot.setHighlightColor(hexagonColorUtils_4.HexagonColorUtils.spawnHighlightColor);
                                        spot.setShowVotes(true);
                                        selectedEntity.setSecondaryVoteColor(spot);
                                        // spot.setHeightOffset(.25);
                                    }
                                }
                                break;
                        }
                    }
                }
                async processAction(hex) {
                    let entityDetail = entityManager_2.EntityDetails.instance.details[gameService_1.GameService.selectedEntity.entityType];
                    this.resetBoardColors();
                    let distance = hexUtils_3.HexUtils.distance(gameService_1.GameService.selectedHex, hex);
                    if (distance == 0) {
                        gameService_1.GameService.resetSelection();
                        return;
                    }
                    let radius = 0;
                    switch (gameService_1.GameService.selectedAction) {
                        case "move":
                            radius = entityDetail.moveRadius;
                            break;
                        case "attack":
                            radius = entityDetail.attackRadius;
                            break;
                        case "spawn":
                            radius = entityDetail.spawnRadius;
                            break;
                    }
                    if (distance > radius) {
                        gameService_1.GameService.resetSelection();
                        gameService_1.GameService.selectedHex = hex;
                        this.startAction();
                        return;
                    }
                    switch (gameService_1.GameService.selectedAction) {
                        case "move":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length > 0) {
                                    gameService_1.GameService.selectedHex = hex;
                                    gameService_1.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                        case "attack":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length == 0) {
                                    gameService_1.GameService.selectedHex = hex;
                                    gameService_1.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                        case "spawn":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length > 0) {
                                    gameService_1.GameService.selectedHex = hex;
                                    gameService_1.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                    }
                    await this.vote(gameService_1.GameService.selectedEntity, gameService_1.GameService.selectedAction, hex.x, hex.z);
                    gameService_1.GameService.resetSelection();
                }
                findAvailableSpots(radius, center) {
                    let items = [];
                    for (let q = 0; q < this.hexBoard.hexList.length; q++) {
                        let item = this.hexBoard.hexList[q];
                        if (hexUtils_3.HexUtils.distance(center, item) <= radius) {
                            items.push(item);
                        }
                    }
                    return items;
                }
                async randomTap() {
                    if (this.cantAct()) {
                        setTimeout(() => {
                            this.randomTap();
                        }, Math.random() * 1000 + 100);
                        return;
                    }
                    let ent;
                    let px;
                    let pz;
                    while (true) {
                        let p = Math.round(this.hexBoard.entityManager.entities.length * Math.random());
                        ent = this.hexBoard.entityManager.entities[p];
                        if (!ent)
                            continue;
                        var tile = ent.getTile();
                        px = Math.round(tile.x + Math.random() * 10 - 5);
                        pz = Math.round(tile.z + Math.random() * 10 - 5);
                        if (px == 0 && pz == 0)
                            continue;
                        if (hexUtils_3.HexUtils.distance({ x: px, z: pz }, { x: tile.x, z: tile.z }) <= 5) {
                            break;
                        }
                    }
                    await this.vote(ent, 'move', px, pz);
                    setTimeout(() => {
                        this.randomTap();
                    }, Math.random() * 1000 + 100);
                }
                async vote(entity, action, px, pz) {
                    let result = await dataServices_1.DataService.vote({
                        entityId: entity.id,
                        action: action,
                        userId: 'foo',
                        generation: this.hexBoard.generation,
                        x: px,
                        z: pz
                    });
                    if (result) {
                        if (result.generationMismatch) {
                            await this.checkState();
                        }
                        else if (result.issueVoting) {
                            console.log('issue voting');
                        }
                        else {
                            entity.resetVotes();
                            for (let i = 0; i < result.votes.length; i++) {
                                let vote = result.votes[i];
                                entity.pushVote(vote);
                            }
                            this.rebuildMiniBoard(true, entity);
                        }
                    }
                }
                async tapHex(x, y) {
                    if (this.cantAct()) {
                        return;
                    }
                    let hex = this.getHexAtPoint(x, y);
                    if (!hex) {
                        gameService_1.GameService.selectedHex = null;
                        return;
                    }
                    if (!gameService_1.GameService.selectedHex) {
                        gameService_1.GameService.selectedHex = hex;
                        this.startAction();
                    }
                    else {
                        await this.processAction(hex);
                    }
                }
                resize(width, height) {
                    this.viewPort.width = width;
                    this.viewPort.height = height;
                    this.constrainViewPort();
                }
                offsetView(x, y) {
                    this.setView(this.viewPort.x + x, this.viewPort.y + y);
                }
                setView(x, y) {
                    this.viewPort.x = x;
                    this.viewPort.y = y;
                    this.constrainViewPort();
                    localStorage.setItem("lastX", this.viewPort.x.toString());
                    localStorage.setItem("lastY", this.viewPort.y.toString());
                }
                constrainViewPort() {
                    this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
                    this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
                    const size = this.hexBoard.gameDimensions();
                    this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
                    this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height);
                    this.hexBoard.resetVisibleHexList(this.viewPort);
                }
                getHexAtPoint(clickX, clickY) {
                    let lastClick = null;
                    clickX += this.viewPort.x;
                    clickY += this.viewPort.y;
                    let hexWidth = gridHexagonConstants_4.GridHexagonConstants.width * 3 / 4;
                    let gridHeight = gridHexagonConstants_4.GridHexagonConstants.height();
                    for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
                        const x = hexWidth * gridHexagon.x;
                        let z = gridHexagon.z * gridHeight + ((gridHexagon.x % 2 === 1) ? (-gridHeight / 2) : 0);
                        z -= gridHexagon.getDepthHeight(true);
                        z += gridHexagon.y * gridHexagonConstants_4.GridHexagonConstants.depthHeight();
                        let depthHeight = gridHexagon.getDepthHeight(false);
                        let offClickX = clickX - x;
                        let offClickY = clickY - z;
                        if (drawingUtilities_3.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_4.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_3.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_3.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_3.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_4.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                }
                centerOnHex(gridHexagon) {
                    const x = gridHexagon.getRealX();
                    const y = gridHexagon.getRealZ();
                    this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
                }
                resetBoardColors() {
                    for (let i = 0; i < this.hexBoard.hexList.length; i++) {
                        let h = this.hexBoard.hexList[i];
                        //todo optimize
                        h.clearHighlightColor();
                        h.clearSecondaryVoteColor();
                        h.setShowVotes(true);
                    }
                }
            };
            exports_16("GameManager", GameManager);
            ViewPort = class ViewPort {
                constructor() {
                    this.x = 0;
                    this.y = 0;
                    this.width = 400;
                    this.height = 400;
                    this.padding = gridHexagonConstants_4.GridHexagonConstants.width * 2;
                }
            };
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
            MenuManager = class MenuManager {
                constructor(canvas) {
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
                openMenu(items, location, onClick) {
                    this.isOpen = true;
                    this.location = location;
                    this.items = items;
                    this.onClick = onClick;
                    this.selectedItem = null;
                }
                closeMenu() {
                    this.canvas.width = this.canvas.width;
                    this.isOpen = false;
                    this.location = null;
                    this.items = null;
                    this.onClick = null;
                    this.selectedItem = null;
                }
                size() {
                    const size = { width: this.iconSize * this.items.length, height: this.iconSize };
                    return size;
                }
                tap(x, y) {
                    if (!this.isOpen)
                        return false;
                    const size = this.size();
                    if (x >= this.location.x && y >= this.location.y &&
                        x <= this.location.x + size.width && y <= this.location.y + size.height) {
                        x -= this.location.x;
                        y -= this.location.y;
                        const ind = (x / this.iconSize) | 0;
                        this.selectedItem = this.items[ind];
                        this.onClick && this.onClick(this.selectedItem);
                        return true;
                    }
                    return false;
                }
                draw() {
                    if (!this.isOpen)
                        return;
                    this.canvas.width = this.canvas.width;
                    this.context.save();
                    this.context.translate(this.location.x, this.location.y);
                    const size = this.size();
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
                }
            };
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
            PageManager = class PageManager {
                constructor() {
                    this.swipeVelocity = { x: 0, y: 0 };
                    this.tapStart = { x: 0, y: 0 };
                }
                async init() {
                    this.gameManager = new gameManager_1.GameManager();
                    await this.gameManager.init();
                    this.fpsMeter = new window.FPSMeter(document.body, {
                        right: '5px',
                        left: 'auto',
                        heat: 1
                    });
                    hexagonColorUtils_5.HexagonColorUtils.setupColors();
                    this.canvas = document.getElementById("hex");
                    this.context = this.canvas.getContext("2d");
                    let menu = document.getElementById("menu");
                    this.menuManager = new menuManager_1.MenuManager(menu);
                    let overlay = document.getElementById("overlay");
                    let mc = new Hammer.Manager(overlay);
                    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
                    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
                    mc.add(new Hammer.Tap());
                    window.onresize = () => {
                        this.canvas.width = document.body.clientWidth;
                        this.canvas.height = document.body.clientHeight;
                        this.gameManager.resize(this.canvas.width, this.canvas.height);
                    };
                    this.canvas.width = document.body.clientWidth;
                    this.canvas.height = document.body.clientHeight;
                    overlay.style.width = '100vw';
                    overlay.style.height = '100vh';
                    this.gameManager.resize(this.canvas.width, this.canvas.height);
                    mc.on('panstart', (ev) => {
                        if (this.menuManager.isOpen) {
                            return false;
                        }
                        this.menuManager.closeMenu();
                        this.swipeVelocity.x = this.swipeVelocity.y = 0;
                        this.tapStart.x = this.gameManager.viewPort.x;
                        this.tapStart.y = this.gameManager.viewPort.y;
                        this.gameManager.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
                        return true;
                    });
                    mc.on('panmove', (ev) => {
                        if (this.menuManager.isOpen) {
                            return false;
                        }
                        this.gameManager.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
                    });
                    mc.on('swipe', (ev) => {
                        if (this.menuManager.isOpen) {
                            return false;
                        }
                        this.menuManager.closeMenu();
                        this.swipeVelocity.x = ev.velocityX * 10;
                        this.swipeVelocity.y = ev.velocityY * 10;
                    });
                    mc.on('tap', (ev) => {
                        let x = ev.center.x;
                        let y = ev.center.y;
                        this.swipeVelocity.x = this.swipeVelocity.y = 0;
                        this.gameManager.tapHex(x, y);
                    });
                    this.draw();
                    setInterval(() => {
                        this.tick();
                    }, 1000 / 16);
                }
                draw() {
                    requestAnimationFrame(() => {
                        this.draw();
                    });
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.gameManager.draw(this.context);
                    this.menuManager.draw();
                    this.fpsMeter.tick();
                }
                tick() {
                    if (Math.abs(this.swipeVelocity.x) > 0) {
                        let sign = hexUtils_4.HexUtils.mathSign(this.swipeVelocity.x);
                        this.swipeVelocity.x += 0.7 * -sign;
                        if (hexUtils_4.HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                            this.swipeVelocity.x = 0;
                        }
                    }
                    if (Math.abs(this.swipeVelocity.y) > 0) {
                        let sign = hexUtils_4.HexUtils.mathSign(this.swipeVelocity.y);
                        this.swipeVelocity.y += 0.7 * -sign;
                        if (hexUtils_4.HexUtils.mathSign(this.swipeVelocity.y) != sign) {
                            this.swipeVelocity.y = 0;
                        }
                    }
                    // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
                    {
                        //todo optimize this cause its called way too fucking often
                        this.gameManager.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
                    }
                    this.gameManager.tick();
                }
            };
            exports_18("PageManager", PageManager);
        }
    };
});
System.register("ui/gameController", ["ui/gameService", "entities/entityManager"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var gameService_2, entityManager_3, GameController;
    return {
        setters: [
            function (gameService_2_1) {
                gameService_2 = gameService_2_1;
            },
            function (entityManager_3_1) {
                entityManager_3 = entityManager_3_1;
            }
        ],
        execute: function () {
            GameController = class GameController {
                constructor($scope, $interval) {
                    this.$scope = $scope;
                    this.$interval = $interval;
                    $scope.model = {};
                    $scope.model.name = 'foo';
                    $scope.model.timerPercent = 0;
                    let secondsTick = 0;
                    $scope.model.loading = true;
                    $scope.model.selectedAction = 'move';
                    $scope.model.setSelectedAction = (action) => {
                        $scope.model.selectedAction = action;
                        gameService_2.GameService.selectedAction = action;
                        setTimeout(() => {
                            gameService_2.GameService.getGameManager().startAction();
                        }, 0);
                    };
                    gameService_2.GameService.onSetSelectedEntity = (entity) => {
                        $scope.model.selectedEntity = entity;
                        if ($scope.model.selectedEntity) {
                            let detail = entityManager_3.EntityDetails.instance.details[entity.entityType];
                            $scope.model.canSpawn = detail.spawnRadius > 0;
                            $scope.model.canAttack = detail.attackRadius > 0;
                            $scope.model.canMove = detail.moveRadius > 0;
                            $scope.model.selectedAction = gameService_2.GameService.selectedAction;
                            $scope.model.maxEntityHealth = detail.health;
                        }
                        else {
                            $scope.model.canSpawn = false;
                            $scope.model.canAttack = false;
                            $scope.model.canMove = false;
                            $scope.model.selectedAction = null;
                        }
                        $scope.$apply();
                    };
                    gameService_2.GameService.hasData = () => {
                        $scope.model.loading = false;
                        $scope.$apply();
                    };
                    gameService_2.GameService.setSecondsToNextGeneration = (seconds) => {
                        secondsTick = 100 / (10 * gameService_2.GameService.secondsPerGeneration);
                        $scope.model.timerPercent = Math.min(100 - (seconds / gameService_2.GameService.secondsPerGeneration * 100), 100);
                        $scope.$apply();
                    };
                    $interval(() => {
                        if ($scope.model.timerPercent < 100) {
                            $scope.model.timerPercent += secondsTick;
                        }
                        $scope.model.timerPercent = Math.min($scope.model.timerPercent, 100);
                    }, 100);
                }
            };
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
            Main = class Main {
                static run() {
                    this.loadAssets(() => {
                        this.pageManager = new pageManager_1.PageManager();
                        this.pageManager.init();
                    });
                }
                static loadAssets(onComplete) {
                    AssetManager_1.AssetManager.completed = onComplete;
                    var size = { width: 80, height: 80 };
                    var base = { x: 40, y: 55 };
                    AssetManager_1.AssetManager.addAsset('MainBase', 'images/MainBase/up_1.png', size, base);
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
                }
            };
            exports_20("Main", Main);
            Main.run();
            angular.module('swg', []).controller('GameController', gameController_1.GameController);
            angular.element(function () {
                angular.bootstrap(document.getElementById('game-ui'), ['swg']);
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy9nYW1lL0Fzc2V0TWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvdXRpbHMudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2RyYXdpbmdVdGlsaXRpZXMudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2NvbG9yLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9oZXhhZ29uQ29sb3JVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9ncmlkSGV4YWdvbi50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9ncmlkSGV4YWdvbkNvbnN0YW50cy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9oZXhVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvbW9kZWxzL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL2hleEJvYXJkLnRzIiwiLi4vY29tcG9uZW50cy9hbmltYXRpb25NYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9oZWxwLnRzIiwiLi4vY29tcG9uZW50cy91aS9nYW1lU2VydmljZS50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvZW50aXR5TWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvZGF0YVNlcnZpY2VzLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL2dhbWVNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9nYW1lL21lbnVNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy9wYWdlTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdWkvZ2FtZUNvbnRyb2xsZXIudHMiLCIuLi9jb21wb25lbnRzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQWVBLGVBQUE7Z0JBUUksTUFBTSxDQUFDLEtBQUs7b0JBQ1IsR0FBRyxDQUFDLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzs0QkFFeEIsR0FBRyxDQUFDLE1BQU0sR0FBRztnQ0FDVCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzs0QkFDaEMsQ0FBQyxDQUFDOzRCQUdGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQ3hDLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBWSxFQUFFLEdBQVcsRUFBRSxJQUFxQyxFQUFFLElBQTRCO29CQUMxRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO29CQUMxRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDNUIsQ0FBQztnQkFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVksRUFBRSxVQUFrQixFQUFFLEdBQVcsRUFBRSxJQUFxQyxFQUFFLElBQTRCO29CQUNuSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO29CQUMvRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDNUIsQ0FBQztnQkFHRCxNQUFNLENBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJO29CQUN6QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV2QyxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSTt3QkFDL0MsSUFBSSxFQUFFLElBQUk7d0JBQ1YsSUFBSSxFQUFFLElBQUk7d0JBQ1YsSUFBSSxFQUFFLElBQUk7d0JBQ1YsUUFBUSxFQUFFLFVBQVUsQ0FBQyxVQUFVLEtBQUssU0FBUztxQkFDaEQsQ0FBQztvQkFFTixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUksRUFBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDO29CQUN2RSxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUk7d0JBQ3hCLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO3dCQUN2QixDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztxQkFDM0IsQ0FBQztvQkFFTixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDakIsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQzt3QkFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUU5QyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO29CQUV0QixDQUFDO29CQUVELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFFekMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLFVBQVUsQ0FBQzs0QkFDSCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsRUFDRCxHQUFHLENBQUMsQ0FBQztvQkFFYixDQUFDO2dCQUNMLENBQUM7YUFDSixDQUFBO1lBckVVLHVCQUFVLEdBQStCLEVBQUUsQ0FBQztZQUM1QyxtQkFBTSxHQUEyQixFQUFFLENBQUM7WUFDcEMsc0JBQVMsR0FBYSxJQUFJLENBQUM7WUFDM0IsMEJBQWEsR0FBRyxDQUFDLENBQUM7WUFDbEIsNkJBQWdCLEdBQUcsQ0FBQyxDQUFDOztRQWlFL0IsQ0FBQzs7Ozs7Ozs7OztZQ3JGRixRQUFBO2dCQUlJLElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBVTtvQkFDM0IsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELFlBQVksQ0FBUyxFQUFFLENBQVM7b0JBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7Z0JBRU0sTUFBTSxDQUFDLGNBQXFCO29CQUMvQixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRSxDQUFDO2dCQUVNLFdBQVcsQ0FBQyxjQUFxQjtvQkFDcEMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsQ0FBQztnQkFFTSxNQUFNLENBQUMsQ0FBUyxFQUFFLENBQVM7b0JBQzlCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsQ0FBQztnQkFFTSxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVM7b0JBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7YUFDSixDQUFBOztZQUVELGNBQUE7Z0JBSVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFnQjtvQkFDakMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2dCQUVELFlBQVksQ0FBUyxFQUFFLENBQVM7b0JBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7Z0JBRU0sTUFBTSxDQUFDLGNBQTJCO29CQUNyQyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixDQUFDO2dCQUVNLFdBQVcsQ0FBQyxjQUEyQjtvQkFDMUMsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakYsQ0FBQztnQkFFTSxNQUFNLENBQUMsQ0FBUyxFQUFFLENBQVM7b0JBQzlCLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsQ0FBQztnQkFFTSxHQUFHLENBQUMsQ0FBUyxFQUFFLENBQVM7b0JBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUM7YUFDSixDQUFBOztZQUdELHdCQUFBLDJCQUFtQyxTQUFRLEtBQUs7Z0JBSTVDLFlBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxLQUFhLEVBQUUsTUFBYztvQkFDM0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRU0sVUFBVSxDQUFDLENBQVE7b0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRyxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBWSxFQUFFLENBQVE7b0JBQy9DLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBYSxFQUFFLEVBQWE7b0JBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RHLENBQUM7YUFDSixDQUFBOztZQUVELFlBQUEsZUFBdUIsU0FBUSxLQUFLO2dCQUloQyxZQUFZLElBQVksQ0FBQyxFQUFFLElBQVksQ0FBQyxFQUFFLFFBQWdCLENBQUMsRUFBRSxTQUFpQixDQUFDO29CQUMzRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztnQkFDekIsQ0FBQzthQUNKLENBQUE7O1FBQUEsQ0FBQzs7Ozs7Ozs7OztZQzlHRixlQUFBO2dCQVNJLFlBQVksS0FBYTtvQkFOekIsVUFBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxlQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNoQixVQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNYLFVBQUssR0FBRyxFQUFFLENBQUM7b0JBQ1gsVUFBSyxHQUFHLEVBQUUsQ0FBQztvQkFHUCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1RCxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzRCxDQUFDO2FBRUosQ0FBQTs7WUFFRCxlQUFBO2dCQUVJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBaUM7b0JBQy9DLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzVDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO29CQUM1QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDckIsQ0FBQztnQkFBQSxDQUFDO2dCQUVGLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBVyxFQUFFLEdBQVc7b0JBQzFDLHNCQUFzQjtvQkFDdEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCwyQ0FBMkM7b0JBQzNDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztvQkFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUN6QixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNsRixHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekMsQ0FBQztvQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNmLENBQUM7Z0JBQUEsQ0FBQztnQkFHRixNQUFNLENBQUMsZUFBZSxDQUFDLEdBQVcsRUFBRSxRQUFnQjtvQkFDaEQsc0JBQXNCO29CQUN0QixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBRXJELDJDQUEyQztvQkFDM0MsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO29CQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUN6QixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUU3QyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDbkIsQ0FBQztvQkFDRCxHQUFHLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO2dCQUFBLENBQUM7Z0JBRUYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFjLEVBQUUsTUFBYyxFQUFFLE9BQWdCO29CQUNsRSxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ2xFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTTs0QkFDL0MsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xILFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQzt3QkFDekIsQ0FBQztvQkFDTCxDQUFDO29CQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQUEsQ0FBQzthQUVMLENBQUE7O1FBR0QsQ0FBQzs7Ozs7Ozs7OztZQzFFRCxrQkFBa0I7WUFDbEIsUUFBQTtnQkFNSSxZQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLElBQVksQ0FBQztvQkFDdEQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQzthQUNKLENBQUE7O1lBRUQsYUFBQTtnQkFDSTs7Ozs7Ozs7Ozs7O21CQVlHO2dCQUNILE1BQU0sQ0FBRSxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVO29CQUMzQyxjQUFjO29CQUNkLE1BQU0sR0FBRyxNQUFNLElBQUksU0FBUyxDQUFDO29CQUM3QixNQUFNLEdBQUcsTUFBTSxJQUFJLFNBQVMsQ0FBQztvQkFDN0IsVUFBVSxHQUFHLFVBQVUsSUFBSSxHQUFHLENBQUM7b0JBRS9CLDREQUE0RDtvQkFDNUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7d0JBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztvQkFFeEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7d0JBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztvQkFFeEQsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7b0JBRzFELHNGQUFzRjtvQkFDdEYsc0dBQXNHO29CQUN0RyxtQ0FBbUM7b0JBQ25DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO3dCQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25GLElBQUk7d0JBQ0EsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO3dCQUNuQixNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25GLElBQUk7d0JBQ0EsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBR2pDLGdEQUFnRDtvQkFDaEQsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDekgsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFHekgsV0FBVztvQkFDWCxJQUFJLE1BQU0sR0FBRzt3QkFDVCxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3JELENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDckQsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO3FCQUN4RCxDQUFDO29CQUdGLG9CQUFvQjtvQkFDcEIsYUFBYTtvQkFDYixNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4SCxDQUFDO2dCQUVELE1BQU0sQ0FBRSxVQUFVLENBQUMsR0FBRztvQkFDbEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO3dCQUNoQixHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDZixDQUFDO2FBQ0osQ0FBQTs7UUFBQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztZQ2pGRixvQkFBQTtnQkFpQlcsTUFBTSxDQUFDLFdBQVc7b0JBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDaEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBWSxDQUFDLCtCQUFZLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUYsQ0FBQztvQkFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztvQkFFM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFHakQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUNqRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7NEJBQzlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBWSxDQUFDLGtCQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLCtCQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFFLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEwsQ0FBQztvQkFDTCxDQUFDO2dCQUVMLENBQUM7YUFDSixDQUFBO1lBekNVLGdDQUFjLEdBQUcsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdDLDJCQUFTLEdBQUcsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLGdDQUFjLEdBQUcsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLHdDQUFzQixHQUFHLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRCxvQ0FBa0IsR0FBRyxJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDakQsc0NBQW9CLEdBQUcsSUFBSSwrQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ25ELHFDQUFtQixHQUFHLElBQUksK0JBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVsRCwrQkFBYSxHQUFpQixJQUFJLCtCQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7O1FBaUNyRSxDQUFDOzs7QUNsREQsNkNBQTZDOzs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBN0MsNkNBQTZDO1lBUzdDLGNBQUE7Z0JBQUE7b0JBRVksWUFBTyxHQUFXLElBQUksQ0FBQztvQkFDdkIsaUJBQVksR0FBVyxJQUFJLENBQUM7b0JBQzVCLGtCQUFhLEdBQVcsSUFBSSxDQUFDO29CQUM3QixvQkFBZSxHQUFXLElBQUksQ0FBQztvQkFDL0IsbUJBQWMsR0FBVyxJQUFJLENBQUM7b0JBRTlCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO29CQUc1QixNQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNOLE1BQUMsR0FBRyxDQUFDLENBQUM7b0JBQ04sTUFBQyxHQUFHLENBQUMsQ0FBQztvQkFDTixXQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNYLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQVNwQixhQUFRLEdBQWlCLEVBQUUsQ0FBQztvQkFXNUIsY0FBUyxHQUFZLElBQUksQ0FBQztvQkFHMUIsV0FBTSxHQUFXLFNBQVMsQ0FBQztvQkFDM0IsV0FBTSxHQUFXLFNBQVMsQ0FBQztnQkF3ZXZDLENBQUM7Z0JBdGVHLFFBQVE7b0JBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDdkIsQ0FBQztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLDJDQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkUsQ0FBQztnQkFFRCxRQUFRO29CQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQ3ZCLENBQUM7b0JBQ0QsSUFBSSxNQUFNLEdBQUcsMkNBQW9CLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7MEJBQzNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDOzBCQUN6QixJQUFJLENBQUMsQ0FBQyxHQUFHLDJDQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUN0RCxDQUFDO2dCQUVELFlBQVk7b0JBQ1IsTUFBTSxDQUFDLENBQUMsK0NBQXdCLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDO2dCQUVELFlBQVk7b0JBQ1IsSUFBSSxNQUFNLEdBQUcsK0NBQXdCLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQy9DLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzBCQUM3RCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsQ0FBQztnQkFFRCxjQUFjLENBQUMsUUFBaUI7b0JBQzVCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLDJDQUFvQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JHLE1BQU0sQ0FBQywyQ0FBb0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUMsQ0FBQztnQkFFRCxXQUFXO29CQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN6QixDQUFDO2dCQUVELFdBQVc7b0JBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUVELGFBQWEsQ0FBQyxFQUFVO29CQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELENBQUM7Z0JBRUQsU0FBUyxDQUFDLE1BQWtCO29CQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUMzQixDQUFDO2dCQUVELFlBQVksQ0FBQyxNQUFrQjtvQkFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFFRCxZQUFZLENBQUMsU0FBeUI7b0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQzNCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO2dCQUVELFVBQVUsQ0FBQyxPQUFlO29CQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO3dCQUN2QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxpQkFBaUIsQ0FBQyxjQUE0QjtvQkFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQzt3QkFDckMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBR0QsWUFBWSxDQUFDLFNBQXVCO29CQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO3dCQUMzQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzNCLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxjQUFjO29CQUNWLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7d0JBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO2dCQUVELHFCQUFxQixDQUFDLFNBQXVCO29CQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsdUJBQXVCO29CQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUMzQixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsbUJBQW1CO29CQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7d0JBQzNCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDM0IsQ0FBQztnQkFDTCxDQUFDO2dCQUVELFVBQVUsQ0FBQyxVQUFpQixFQUFFLFdBQWtCLEVBQUUsYUFBb0IsRUFBRSxZQUFtQjtvQkFDdkYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7b0JBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFHRCxlQUFlLENBQUMsWUFBb0I7b0JBQ2hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUMxQixDQUFDO2dCQUNMLENBQUM7Z0JBRU0sVUFBVTtvQkFDYixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsMkNBQW9CLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO29CQUMvRSw0RkFBNEY7b0JBQzVGLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQywyQ0FBb0IsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN0RyxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsMkNBQW9CLENBQUMseUJBQXlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDMUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLDJDQUFvQixDQUFDLHdCQUF3QixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVHLENBQUM7Z0JBRU0sY0FBYztvQkFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLCtDQUF3QixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztvQkFDdkYsNEZBQTRGO2dCQUNoRyxDQUFDO2dCQUdPLGVBQWU7b0JBQ25CLElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLHFDQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNqRixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUMvQixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztvQkFDakQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztvQkFDekMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxxQ0FBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUMzRyxJQUFJLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFlBQVksSUFBSSxTQUFTLENBQUM7b0JBQ3hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLElBQUksa0JBQWtCLElBQUksY0FBYyxJQUFJLFdBQVcsSUFBSSxZQUFZLElBQUksU0FBUyxDQUFDO29CQUN0SCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsWUFBWSxJQUFJLFNBQVMsQ0FBQztvQkFFckQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsSUFBSSxXQUFXLElBQUksWUFBWSxJQUFJLFNBQVMsQ0FBQztvQkFFOUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDcEgsSUFBSSxDQUFDLGVBQWUsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2hJLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO29CQUM3RSxDQUFDO2dCQUNMLENBQUM7Z0JBR0QsYUFBYSxDQUFDLE9BQWlDLEVBQUUsS0FBbUI7b0JBQ2hFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsQ0FBQzt3QkFDRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFFakMsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUM1RSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsMkNBQW9CLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLDJDQUFvQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSwyQ0FBb0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLDJDQUFvQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMseUNBQXlDO3dCQUVuTSxPQUFPLENBQUMsU0FBUyxHQUFHLCtCQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ25FLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO29CQUNELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDbEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBR3RCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDbEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ25DLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztnQkFHRCxlQUFlLENBQUMsT0FBaUMsRUFBRSxLQUFtQjtvQkFDbEUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDZixDQUFDO3dCQUNHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3dCQUVuQyxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQzlFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQywyQ0FBb0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsMkNBQW9CLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLDJDQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsMkNBQW9CLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7d0JBQ25NLE9BQU8sQ0FBQyxTQUFTLEdBQUcsK0JBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDbkUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7b0JBQ0QsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNsQixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFHdEIsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDckMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN0QixDQUFDO2dCQUVELGNBQWMsQ0FBQyxPQUFpQyxFQUFFLEtBQW1CO29CQUNqRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2YsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNmLENBQUM7d0JBQ0csT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBRWxDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDN0UsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLDJDQUFvQixDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQywyQ0FBb0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsMkNBQW9CLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSwyQ0FBb0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlDQUF5Qzt3QkFFbk0sT0FBTyxDQUFDLFNBQVMsR0FBRywrQkFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNuRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztvQkFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWxCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO29CQUV0QixPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ2xDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNwQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsT0FBTyxDQUFDLE9BQWlDLEVBQUUsS0FBbUI7b0JBRTFELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFZixDQUFDO3dCQUNHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDZixDQUFDOzRCQUNHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUUzQixPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7NEJBQzNFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQywyQ0FBb0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsMkNBQW9CLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLDJDQUFvQixDQUFDLEtBQUssRUFBRSwyQ0FBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQXlDOzRCQUMzTCxPQUFPLENBQUMsU0FBUyxHQUFHLCtCQUFZLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQ25FLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUUzQjs7Ozs7OztnQ0FPSTt3QkFDUixDQUFDO3dCQUNELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDbEIsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO3dCQUN2QyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDakMsQ0FBQztvQkFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRUQsV0FBVyxDQUFDLE9BQWlDO29CQUN6QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO29CQUN4QyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQy9COzt3REFFb0M7Z0JBQ3hDLENBQUM7Z0JBRVMsUUFBUTtvQkFDZCxNQUFNLElBQUksR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLDJDQUFvQixDQUFDLEtBQUssQ0FBQztvQkFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRywyQ0FBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFFNUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUcxQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztvQkFDakIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7b0JBRWpCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7Z0JBRU8sWUFBWTtvQkFDaEIsTUFBTSxJQUFJLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRywrQ0FBd0IsQ0FBQyxLQUFLLENBQUM7b0JBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsK0NBQXdCLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBRWhELElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO29CQUNqQixJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztvQkFFbEIsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztnQkFRRCxJQUFJLENBQUMsT0FBaUMsRUFBRSxPQUFlLEVBQUUsT0FBZTtvQkFDcEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNqQixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUV4SDs7Ozs4QkFJRTt3QkFFVSxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDcEgsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQ0FDYixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQTs0QkFDL0IsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7NEJBQzFELENBQUM7NEJBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUN6QyxDQUFDO29CQUNMLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBRUosRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxPQUFPLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xILENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osSUFBSSxVQUFVLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNwSCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dDQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFBOzRCQUNyQyxDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNKLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs0QkFDdEUsQ0FBQzs0QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3pDLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELFFBQVEsQ0FBQyxPQUFpQyxFQUFFLE9BQWUsRUFBRSxPQUFlO29CQUV4RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEgsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQzFFLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7NEJBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFBO3dCQUN2QyxDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDeEIsQ0FBQzt3QkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzdDLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxZQUFZO29CQUNSLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztvQkFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBRTNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDbkQsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixTQUFTLENBQUMs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