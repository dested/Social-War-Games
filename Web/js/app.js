System.register("utils/utils", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("Point", Point);
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
            exports_1("DoublePoint", DoublePoint);
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
            exports_1("IntersectingRectangle", IntersectingRectangle);
            Rectangle = class Rectangle extends Point {
                constructor(x = 0, y = 0, width = 0, height = 0) {
                    super(x, y);
                    this.width = width;
                    this.height = height;
                }
            };
            exports_1("Rectangle", Rectangle);
        }
    };
});
System.register("game/AssetManager", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var AssetManager;
    return {
        setters: [],
        execute: function () {
            AssetManager = class AssetManager {
                static getAsset(key) {
                    return this.assets[key];
                }
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
            exports_2("AssetManager", AssetManager);
        }
    };
});
System.register("game/menuManager", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var MenuManager;
    return {
        setters: [],
        execute: function () {
            /* this.pageManager.menuManager.openMenu([
             {
             image: AssetManager.getAsset("Missile").images[0],
             action: "do this"
             }, {
             image: AssetManager.getAsset("Tank").images[0],
             action: "do that"
             }], new Point(100, 100), (item) => {
             console.log(item);
             });*/
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
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            exports_3("MenuManager", MenuManager);
        }
    };
});
System.register("utils/drawingUtilities", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("HexagonColor", HexagonColor);
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
            exports_4("DrawingUtils", DrawingUtils);
        }
    };
});
System.register("models/hexBoard", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("utils/color", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
            exports_6("Color", Color);
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
                 @returns: string    => the third color, hex, representation of the blend between color1 and color2 at the given percentage
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
                    let colorArray1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
                    let colorArray2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
                    // 4: blend
                    let color3 = [
                        (1 - percentage) * colorArray1[0] + percentage * colorArray2[0],
                        (1 - percentage) * colorArray1[1] + percentage * colorArray2[1],
                        (1 - percentage) * colorArray1[2] + percentage * colorArray2[2]
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
            exports_6("ColorUtils", ColorUtils);
        }
    };
});
System.register("utils/help", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
            exports_7("Help", Help);
        }
    };
});
System.register("animationManager", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var AnimationManager, AnimationFrameType, AnimationType;
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
            exports_8("AnimationManager", AnimationManager);
            (function (AnimationFrameType) {
                AnimationFrameType[AnimationFrameType["Start"] = 0] = "Start";
                AnimationFrameType[AnimationFrameType["Tick"] = 1] = "Tick";
                AnimationFrameType[AnimationFrameType["Stop"] = 2] = "Stop";
            })(AnimationFrameType || (AnimationFrameType = {}));
            exports_8("AnimationFrameType", AnimationFrameType);
            (function (AnimationType) {
                AnimationType[AnimationType["Move"] = 0] = "Move";
                AnimationType[AnimationType["Attack"] = 1] = "Attack";
            })(AnimationType || (AnimationType = {}));
            exports_8("AnimationType", AnimationType);
        }
    };
});
System.register("utils/hexagonColorUtils", ["utils/drawingUtilities", "utils/color"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#dfdab8'));
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#c1bc9c'));
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#ada887'));
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#999470'));
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#747053'));
                    this.baseColors.push(new drawingUtilities_1.HexagonColor('#625d47'));
                    for (let i = 0; i < 6; i++) {
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
            exports_9("HexagonColorUtils", HexagonColorUtils);
        }
    };
});
System.register("entities/baseEntity", ["utils/help", "animationManager", "utils/hexagonColorUtils"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var help_1, animationManager_1, hexagonColorUtils_1, BaseEntity;
    return {
        setters: [
            function (help_1_1) {
                help_1 = help_1_1;
            },
            function (animationManager_1_1) {
                animationManager_1 = animationManager_1_1;
            },
            function (hexagonColorUtils_1_1) {
                hexagonColorUtils_1 = hexagonColorUtils_1_1;
            }
        ],
        execute: function () {
            BaseEntity = class BaseEntity {
                constructor(entityManager, entity, totalFrames, animationSpeed) {
                    this.entityManager = entityManager;
                    this.totalFrames = totalFrames;
                    this.animationSpeed = animationSpeed;
                    this.animationFrame = 0;
                    this.drawTickNumber = (Math.random() * 1000) | 0;
                    this.missileDirection = null;
                    this.missileAnimationFrame = 0;
                    this._move_animateFromHex = null;
                    this._move_animateToHex = null;
                    this._move_durationTicks = -1;
                    this._move_currentTick = -1;
                    this._attack_animateFromHex = null;
                    this._attack_animateToHex = null;
                    this._attack_durationTicks = -1;
                    this._attack_currentTick = -1;
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
                    this.drawTickNumber++;
                    if (this.drawTickNumber % this.animationSpeed === 0) {
                        this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
                    }
                    if (this._move_currentTick != -1) {
                        let percent = this._move_currentTick / this._move_durationTicks;
                        if (percent < 1) {
                            this.x = help_1.Help.lerp(this._move_animateFromHex.getRealX(), this._move_animateToHex.getRealX(), percent);
                            this.z = help_1.Help.lerp(this._move_animateFromHex.getRealZ(), this._move_animateToHex.getRealZ(), percent);
                            this._move_currentTick++;
                        }
                    }
                    if (this._attack_currentTick != -1) {
                        /*         if (this.drawTickNumber % this.animationSpeed === 0) {
                         this.missileAnimationFrame = (this.missileAnimationFrame + 1) % this.totalFrames;
                         }*/
                        this.missileAsset = 'Missile';
                        let percent = this._attack_currentTick / this._attack_durationTicks;
                        if (percent < 1) {
                            this.missileX = help_1.Help.lerp(this._attack_animateFromHex.getRealX(), this._attack_animateToHex.getRealX(), percent);
                            this.missileZ = help_1.Help.lerp(this._attack_animateFromHex.getRealZ(), this._attack_animateToHex.getRealZ(), percent);
                            this._attack_currentTick++;
                        }
                    }
                }
                tick() {
                }
                onAnimationComplete(frame) {
                    switch (frame.type) {
                        case animationManager_1.AnimationType.Move: {
                            if (frame.frameType == animationManager_1.AnimationFrameType.Stop) {
                                let tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                                tile.clearHighlightColor();
                                this._move_currentTick = -1;
                                this._move_durationTicks = -1;
                                this._move_animateToHex = null;
                                this._move_animateFromHex = null;
                                return;
                            }
                            let startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                            startTile.clearHighlightColor();
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
                            break;
                        }
                        case animationManager_1.AnimationType.Attack: {
                            if (frame.frameType == animationManager_1.AnimationFrameType.Stop) {
                                this._attack_currentTick = -1;
                                this._attack_durationTicks = -1;
                                this._attack_animateToHex = null;
                                this._attack_animateFromHex = null;
                                this.missileAsset = null;
                                return;
                            }
                            break;
                        }
                    }
                }
                onAnimationStart(frame) {
                    switch (frame.type) {
                        case animationManager_1.AnimationType.Move: {
                            if (frame.frameType == animationManager_1.AnimationFrameType.Start) {
                                this._move_currentTick = -1;
                                this._move_durationTicks = -1;
                                this._move_animateToHex = null;
                                this._move_animateFromHex = null;
                                return;
                            }
                            let startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                            let nextTile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                            startTile.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.highlightColor);
                            nextTile.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.highlightColor);
                            break;
                        }
                        case animationManager_1.AnimationType.Attack: {
                            if (frame.frameType == animationManager_1.AnimationFrameType.Start) {
                                this._attack_currentTick = -1;
                                this._attack_durationTicks = -1;
                                this._attack_animateToHex = null;
                                this._attack_animateFromHex = null;
                                return;
                            }
                            break;
                        }
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
                    this.getTile().setVoteColor(hexagonColorUtils_1.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
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
                        spot.setSecondaryVoteColor(hexagonColorUtils_1.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
                    }
                }
                markAlive() {
                    this.stillAlive = true;
                }
            };
            exports_10("BaseEntity", BaseEntity);
        }
    };
});
System.register("entities/entityManager", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var EntityManager;
    return {
        setters: [],
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
            exports_11("EntityManager", EntityManager);
        }
    };
});
System.register("utils/animationUtils", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var AnimationUtils, AnimationInstance;
    return {
        setters: [],
        execute: function () {
            AnimationUtils = class AnimationUtils {
                static stopAnimations() {
                    for (var i = 0; i < AnimationUtils.animations.length; i++) {
                        var animation = AnimationUtils.animations[i];
                        animation.stop = true;
                    }
                    AnimationUtils.animations.length = 0;
                }
                static start(options) {
                    if (options.start === options.finish) {
                        options.callback(options.finish);
                        options.complete && options.complete(options.finish);
                        return;
                    }
                    var startTime = +new Date();
                    var animationInstance = new AnimationInstance();
                    AnimationUtils.animations.push(animationInstance);
                    function next() {
                        if (animationInstance.stop) {
                            options.callback(options.finish);
                            options.complete && options.complete(options.finish);
                            return;
                        }
                        if (animationInstance.cancel) {
                            return;
                        }
                        var curTime = +new Date();
                        var percent = Math.max(Math.min((curTime - startTime) / options.duration, 1), 0);
                        var j = options.easing(percent);
                        options.callback(options.start + (options.finish - options.start) * j);
                        if (percent >= 1) {
                            AnimationUtils.animations.splice(AnimationUtils.animations.indexOf(animationInstance), 1);
                            options.complete && options.complete(options.finish);
                        }
                        else {
                            requestAnimationFrame(next);
                        }
                    }
                    requestAnimationFrame(next);
                }
                static lightenDarkenColor(col, amount) {
                    var usePound = false;
                    if (col[0] === "#") {
                        col = col.slice(1);
                        usePound = true;
                    }
                    var num = parseInt(col, 16);
                    var r = (num >> 16) + amount;
                    if (r > 255)
                        r = 255;
                    else if (r < 0)
                        r = 0;
                    var b = ((num >> 8) & 0x00FF) + amount;
                    if (b > 255)
                        b = 255;
                    else if (b < 0)
                        b = 0;
                    var g = (num & 0x0000FF) + amount;
                    if (g > 255)
                        g = 255;
                    else if (g < 0)
                        g = 0;
                    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
                }
            };
            AnimationUtils.animations = [];
            AnimationUtils.easings = {
                // no easing, no acceleration
                linear(t) {
                    return t;
                    ;
                },
                // accelerating from zero velocity
                easeInQuad(t) {
                    return t * t;
                },
                // decelerating to zero velocity
                easeOutQuad(t) {
                    return t * (2 - t);
                },
                // acceleration until halfway, then deceleration
                easeInOutQuad(t) {
                    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                },
                // accelerating from zero velocity
                easeInCubic(t) {
                    return t * t * t;
                },
                // decelerating to zero velocity
                easeOutCubic(t) {
                    return (--t) * t * t + 1;
                },
                // acceleration until halfway, then deceleration
                easeInOutCubic(t) {
                    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                },
                // accelerating from zero velocity
                easeInQuart(t) {
                    return t * t * t * t;
                },
                // decelerating to zero velocity
                easeOutQuart(t) {
                    return 1 - (--t) * t * t * t;
                },
                // acceleration until halfway, then deceleration
                easeInOutQuart(t) {
                    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
                },
                // accelerating from zero velocity
                easeInQuint(t) {
                    return t * t * t * t * t;
                },
                // decelerating to zero velocity
                easeOutQuint(t) {
                    return 1 + (--t) * t * t * t * t;
                },
                // acceleration until halfway, then deceleration
                easeInOutQuint(t) {
                    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
                }
            };
            exports_12("AnimationUtils", AnimationUtils);
            AnimationInstance = class AnimationInstance {
                constructor() {
                    this.stop = false;
                    this.cancel = false;
                }
            };
            exports_12("AnimationInstance", AnimationInstance);
        }
    };
});
System.register("utils/debounceUtils", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var DebounceUtils;
    return {
        setters: [],
        execute: function () {
            DebounceUtils = class DebounceUtils {
                static debounce(key, ms, callback) {
                    if (DebounceUtils.debounceCallbacks[key]) {
                        //                console.log(key + ' debounce stopped');
                        clearTimeout(DebounceUtils.debounceCallbacks[key].timeout);
                    }
                    DebounceUtils.debounceCallbacks[key] = {
                        callback: callback,
                        timeout: setTimeout(() => {
                            //                console.log(key + ' debounce called');
                            callback();
                            delete DebounceUtils.debounceCallbacks[key];
                        }, ms)
                    };
                }
            };
            DebounceUtils.debounceCallbacks = {};
            exports_13("DebounceUtils", DebounceUtils);
        }
    };
});
System.register("game/viewPort", ["utils/animationUtils", "game/gridHexagonConstants", "utils/debounceUtils", "ui/gameService"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var animationUtils_1, gridHexagonConstants_1, debounceUtils_1, gameService_1, ViewPort;
    return {
        setters: [
            function (animationUtils_1_1) {
                animationUtils_1 = animationUtils_1_1;
            },
            function (gridHexagonConstants_1_1) {
                gridHexagonConstants_1 = gridHexagonConstants_1_1;
            },
            function (debounceUtils_1_1) {
                debounceUtils_1 = debounceUtils_1_1;
            },
            function (gameService_1_1) {
                gameService_1 = gameService_1_1;
            }
        ],
        execute: function () {
            ViewPort = class ViewPort {
                constructor() {
                    this.x = 0;
                    this.y = 0;
                    this.width = 400;
                    this.height = 400;
                    this.padding = gridHexagonConstants_1.GridHexagonConstants.width * 2;
                }
                getX() {
                    return this.x;
                }
                getY() {
                    return this.y;
                }
                getZoomedX() {
                    return this.x;
                }
                getZoomedY() {
                    return this.y;
                }
                getWidth() {
                    return this.width;
                }
                getHeight() {
                    return this.height;
                }
                setSize(width, height) {
                    this.width = width;
                    this.height = height;
                }
                setPosition(x, y) {
                    this.x = x;
                    this.y = y;
                }
                constrainViewPort(size) {
                    let scale = this.getScale();
                    this.x = Math.max(this.x, 0 - this.padding * scale.x);
                    this.y = Math.max(this.y, 0 - this.padding * scale.y);
                    this.x = Math.min(this.x, size.width + this.padding * scale.x - this.width);
                    this.y = Math.min(this.y, size.height + this.padding * scale.y - this.height);
                }
                setLocalStorage() {
                    localStorage.setItem("lastX", this.x.toString());
                    localStorage.setItem("lastY", this.y.toString());
                }
                shouldDraw(x, y) {
                    let x2 = this.x;
                    let padding = this.padding;
                    let y2 = this.y;
                    let width = this.width;
                    let height = this.height;
                    return x > x2 - padding &&
                        x < x2 + width + padding &&
                        y > y2 - padding &&
                        y < y2 + height + padding;
                }
                animateZoom(scale, center) {
                    debounceUtils_1.DebounceUtils.debounce("animateZoom", 10, () => {
                        if (this.curAnimation) {
                            this.curAnimation.cancel = true;
                        }
                        if (scale === 1) {
                            if (!this.scaleFactor)
                                return;
                            this.curAnimation = animationUtils_1.AnimationUtils.start({
                                start: this.scaleFactor.x,
                                finish: 1,
                                callback: (c) => {
                                    this.scaleFactor = { x: c, y: c };
                                },
                                duration: 600,
                                easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                                complete: () => {
                                    this.curAnimation = null;
                                    this.scaleFactor = null;
                                }
                            });
                        }
                        else {
                            animationUtils_1.AnimationUtils.start({
                                start: this.x,
                                finish: center.getRealX() - this.getWidth() / scale / 2,
                                callback: (c) => {
                                    this.x = c;
                                },
                                duration: 600,
                                easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                            });
                            animationUtils_1.AnimationUtils.start({
                                start: this.y,
                                finish: center.getRealZ() - this.getHeight() / scale / 2,
                                callback: (c) => {
                                    this.y = c;
                                    gameService_1.GameService.getGameManager().constrainViewPort();
                                },
                                duration: 600,
                                easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                            });
                            if (!this.scaleFactor) {
                                this.curAnimation = animationUtils_1.AnimationUtils.start({
                                    start: 1,
                                    finish: scale,
                                    callback: (c) => {
                                        this.scaleFactor = { x: c, y: c };
                                    },
                                    duration: 600,
                                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                                    complete: () => {
                                        this.curAnimation = null;
                                    }
                                });
                            }
                        }
                    });
                }
                offset(context) {
                    if (this.scaleFactor) {
                        context.scale(this.scaleFactor.x, this.scaleFactor.y);
                    }
                    context.translate(-this.getX(), -this.getY());
                }
                getScale() {
                    return this.scaleFactor || ViewPort.defaultScaleFactor;
                }
            };
            ViewPort.defaultScaleFactor = { x: 1, y: 1 };
            exports_14("ViewPort", ViewPort);
        }
    };
});
System.register("entities/stationaryEntity", ["game/gridHexagonConstants", "game/AssetManager", "entities/baseEntity"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var gridHexagonConstants_2, assetManager_1, baseEntity_1, StationaryEntity;
    return {
        setters: [
            function (gridHexagonConstants_2_1) {
                gridHexagonConstants_2 = gridHexagonConstants_2_1;
            },
            function (assetManager_1_1) {
                assetManager_1 = assetManager_1_1;
            },
            function (baseEntity_1_1) {
                baseEntity_1 = baseEntity_1_1;
            }
        ],
        execute: function () {
            StationaryEntity = class StationaryEntity extends baseEntity_1.BaseEntity {
                getActionFrames(action, hexBoard) {
                    return [];
                }
                draw(context) {
                    super.draw(context);
                    context.save();
                    context.translate(this.x, this.z);
                    let assetName = this.entityType;
                    let asset = assetManager_1.AssetManager.getAsset(assetName);
                    let image = asset.image || asset.images[this.animationFrame];
                    let ratio = (gridHexagonConstants_2.GridHexagonConstants.width / asset.size.width);
                    let shrink = .75;
                    let width = gridHexagonConstants_2.GridHexagonConstants.width * shrink;
                    let height = asset.size.height * ratio * shrink;
                    context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
                    context.restore();
                }
                executeFrame(hexBoard, frame, duration) {
                }
            };
            exports_15("StationaryEntity", StationaryEntity);
        }
    };
});
System.register("entities/mainBaseEntity", ["entities/stationaryEntity"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var stationaryEntity_1, MainBaseEntity;
    return {
        setters: [
            function (stationaryEntity_1_1) {
                stationaryEntity_1 = stationaryEntity_1_1;
            }
        ],
        execute: function () {
            MainBaseEntity = class MainBaseEntity extends stationaryEntity_1.StationaryEntity {
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
            exports_16("MainBaseEntity", MainBaseEntity);
        }
    };
});
System.register("entities/regularBaseEntity", ["entities/stationaryEntity"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var stationaryEntity_2, RegularBaseEntity;
    return {
        setters: [
            function (stationaryEntity_2_1) {
                stationaryEntity_2 = stationaryEntity_2_1;
            }
        ],
        execute: function () {
            RegularBaseEntity = class RegularBaseEntity extends stationaryEntity_2.StationaryEntity {
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
            exports_17("RegularBaseEntity", RegularBaseEntity);
        }
    };
});
System.register("entities/sixDirectionEntity", ["game/hexUtils", "entities/baseEntity", "game/AssetManager", "game/gridHexagonConstants", "animationManager"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var hexUtils_1, baseEntity_2, assetManager_2, gridHexagonConstants_3, animationManager_2, SixDirectionEntity;
    return {
        setters: [
            function (hexUtils_1_1) {
                hexUtils_1 = hexUtils_1_1;
            },
            function (baseEntity_2_1) {
                baseEntity_2 = baseEntity_2_1;
            },
            function (assetManager_2_1) {
                assetManager_2 = assetManager_2_1;
            },
            function (gridHexagonConstants_3_1) {
                gridHexagonConstants_3 = gridHexagonConstants_3_1;
            },
            function (animationManager_2_1) {
                animationManager_2 = animationManager_2_1;
            }
        ],
        execute: function () {
            SixDirectionEntity = class SixDirectionEntity extends baseEntity_2.BaseEntity {
                constructor() {
                    super(...arguments);
                    this.currentDirection = hexUtils_1.Direction.Bottom;
                }
                setDirection(direction) {
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
                }
                draw(context) {
                    super.draw(context);
                    {
                        context.save();
                        context.translate(this.x, this.z);
                        let asset = assetManager_2.AssetManager.getAsset(this.entityType);
                        let image = asset.images[this.animationFrame];
                        let ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width) / 2;
                        let width = gridHexagonConstants_3.GridHexagonConstants.width / 2;
                        let height = asset.size.height * ratio;
                        context.rotate(this.directionToRadians(this.currentDirection));
                        context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
                        context.restore();
                    }
                    if (this.missileAsset) {
                        context.save();
                        context.translate(this.missileX, this.missileZ);
                        let asset = assetManager_2.AssetManager.getAsset(this.missileAsset);
                        let image = asset.images[this.missileAnimationFrame];
                        let ratio = (gridHexagonConstants_3.GridHexagonConstants.width / asset.size.width) / 2;
                        let width = gridHexagonConstants_3.GridHexagonConstants.width / 2;
                        let height = asset.size.height * ratio;
                        context.rotate(this.directionToRadians(this.missileDirection));
                        context.drawImage(image, -asset.base.x * ratio - this.realXOffset(), -asset.base.y * ratio - this.realYOffset(), width, height);
                        context.restore();
                    }
                }
                getActionFrames(action, hexBoard) {
                    let frames = [];
                    switch (action.actionType) {
                        case "Move": {
                            let moveAction = action;
                            let tile = this.getTile();
                            let path = hexBoard.pathFind(hexBoard.getHexAtSpot(tile.x, tile.z), hexBoard.getHexAtSpot(moveAction.x, moveAction.z));
                            frames.push({
                                type: animationManager_2.AnimationType.Move,
                                frameType: animationManager_2.AnimationFrameType.Start,
                                startX: path[0].x,
                                startZ: path[0].z,
                                entity: this
                            });
                            for (let i = 1; i < path.length; i++) {
                                let p = path[i];
                                let oldP = path[i - 1];
                                frames.push({
                                    type: animationManager_2.AnimationType.Move,
                                    frameType: animationManager_2.AnimationFrameType.Tick,
                                    startX: oldP.x,
                                    startZ: oldP.z,
                                    endX: p.x,
                                    endZ: p.z,
                                    entity: this
                                });
                            }
                            frames.push({
                                type: animationManager_2.AnimationType.Move,
                                frameType: animationManager_2.AnimationFrameType.Stop,
                                startX: path[path.length - 1].x,
                                startZ: path[path.length - 1].z,
                                entity: this
                            });
                            break;
                        }
                        case "Attack": {
                            let attackAction = action;
                            let tile = this.getTile();
                            frames.push({
                                type: animationManager_2.AnimationType.Attack,
                                frameType: animationManager_2.AnimationFrameType.Start,
                                startX: attackAction.x,
                                startZ: attackAction.z,
                                entity: this
                            });
                            frames.push({
                                frameType: animationManager_2.AnimationFrameType.Tick,
                                type: animationManager_2.AnimationType.Attack,
                                startX: tile.x,
                                startZ: tile.z,
                                endX: attackAction.x,
                                endZ: attackAction.z,
                                entity: this
                            });
                            frames.push({
                                type: animationManager_2.AnimationType.Attack,
                                frameType: animationManager_2.AnimationFrameType.Stop,
                                startX: attackAction.x,
                                startZ: attackAction.z,
                                entity: this
                            });
                            break;
                        }
                    }
                    return frames;
                }
                executeFrame(hexBoard, frame, duration) {
                    switch (frame.type) {
                        case animationManager_2.AnimationType.Move: {
                            switch (frame.frameType) {
                                case animationManager_2.AnimationFrameType.Tick: {
                                    let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                                    let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
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
                        case animationManager_2.AnimationType.Attack: {
                            switch (frame.frameType) {
                                case animationManager_2.AnimationFrameType.Tick: {
                                    let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                                    let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
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
                }
                directionToRadians(direction) {
                    let degrees = 0;
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
                }
            };
            exports_18("SixDirectionEntity", SixDirectionEntity);
        }
    };
});
System.register("entities/heliEntity", ["entities/sixDirectionEntity"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var sixDirectionEntity_1, HeliEntity;
    return {
        setters: [
            function (sixDirectionEntity_1_1) {
                sixDirectionEntity_1 = sixDirectionEntity_1_1;
            }
        ],
        execute: function () {
            HeliEntity = class HeliEntity extends sixDirectionEntity_1.SixDirectionEntity {
                realYOffset() {
                    return -(Math.sin(this.drawTickNumber / 10));
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
            exports_19("HeliEntity", HeliEntity);
        }
    };
});
System.register("entities/infantyEntity", ["entities/sixDirectionEntity"], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var sixDirectionEntity_2, InfantryEntity;
    return {
        setters: [
            function (sixDirectionEntity_2_1) {
                sixDirectionEntity_2 = sixDirectionEntity_2_1;
            }
        ],
        execute: function () {
            InfantryEntity = class InfantryEntity extends sixDirectionEntity_2.SixDirectionEntity {
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
            exports_20("InfantryEntity", InfantryEntity);
        }
    };
});
System.register("entities/tankEntity", ["entities/sixDirectionEntity"], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var sixDirectionEntity_3, TankEntity;
    return {
        setters: [
            function (sixDirectionEntity_3_1) {
                sixDirectionEntity_3 = sixDirectionEntity_3_1;
            }
        ],
        execute: function () {
            TankEntity = class TankEntity extends sixDirectionEntity_3.SixDirectionEntity {
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
            exports_21("TankEntity", TankEntity);
        }
    };
});
System.register("game/hexBoard", ["game/gridHexagonConstants", "game/gridHexagon", "entities/entityManager", "game/hexUtils", "game/AssetManager", "utils/hexagonColorUtils", "entities/mainBaseEntity", "entities/regularBaseEntity", "entities/heliEntity", "entities/infantyEntity", "entities/tankEntity", "ui/gameService"], function (exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var gridHexagonConstants_4, gridHexagon_1, entityManager_1, hexUtils_2, assetManager_3, hexagonColorUtils_2, mainBaseEntity_1, regularBaseEntity_1, heliEntity_1, infantyEntity_1, tankEntity_1, gameService_2, HexBoard;
    return {
        setters: [
            function (gridHexagonConstants_4_1) {
                gridHexagonConstants_4 = gridHexagonConstants_4_1;
            },
            function (gridHexagon_1_1) {
                gridHexagon_1 = gridHexagon_1_1;
            },
            function (entityManager_1_1) {
                entityManager_1 = entityManager_1_1;
            },
            function (hexUtils_2_1) {
                hexUtils_2 = hexUtils_2_1;
            },
            function (assetManager_3_1) {
                assetManager_3 = assetManager_3_1;
            },
            function (hexagonColorUtils_2_1) {
                hexagonColorUtils_2 = hexagonColorUtils_2_1;
            },
            function (mainBaseEntity_1_1) {
                mainBaseEntity_1 = mainBaseEntity_1_1;
            },
            function (regularBaseEntity_1_1) {
                regularBaseEntity_1 = regularBaseEntity_1_1;
            },
            function (heliEntity_1_1) {
                heliEntity_1 = heliEntity_1_1;
            },
            function (infantyEntity_1_1) {
                infantyEntity_1 = infantyEntity_1_1;
            },
            function (tankEntity_1_1) {
                tankEntity_1 = tankEntity_1_1;
            },
            function (gameService_2_1) {
                gameService_2 = gameService_2_1;
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
                    size.width = gridHexagonConstants_4.GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_4.GridHexagonConstants.height() * this.boardSize.height;
                    return size;
                }
                gameDimensionsMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_4.GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_4.GridMiniHexagonConstants.height() * this.boardSize.height;
                    return size;
                }
                addHexagon(hexagon) {
                    this.hexList.push(hexagon);
                    this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
                }
                reorderHexList() {
                    this.hexList = hexUtils_2.HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200);
                    // this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200 + m.height);
                }
                getHexAtSpot(x, z) {
                    return this.hexBlock[x + z * 5000];
                }
                getHexAtSpotDirection(x, z, direction) {
                    switch (direction) {
                        case hexUtils_2.Direction.Top:
                            z -= 1;
                            break;
                        case hexUtils_2.Direction.Bottom:
                            z += 1;
                            break;
                        case hexUtils_2.Direction.TopLeft:
                            if (x % 2 === 1) {
                                z -= 1;
                            }
                            x -= 1;
                            break;
                        case hexUtils_2.Direction.BottomLeft:
                            if (x % 2 === 0) {
                                z += 1;
                            }
                            x -= 1;
                            break;
                        case hexUtils_2.Direction.TopRight:
                            if (x % 2 === 1) {
                                z -= 1;
                            }
                            x += 1;
                            break;
                        case hexUtils_2.Direction.BottomRight:
                            if (x % 2 === 0) {
                                z += 1;
                            }
                            x += 1;
                            break;
                    }
                    return this.hexBlock[x + z * 5000];
                }
                pathFind(start, finish) {
                    const myPathStart = new hexUtils_2.Node(null, start);
                    const myPathEnd = new hexUtils_2.Node(null, finish);
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
                                /*
                                 if (Math.abs((node.item.height) - (n.height)) >= 2)
                                 continue;
                                 */
                                path = new hexUtils_2.Node(node, n);
                                if (!aStar[path.value()]) {
                                    path.g = node.g + hexUtils_2.HexUtils.distance(n, node.item) /*+ (Math.abs((node.item.height) - (n.height)) * 2)*/;
                                    path.f = path.g + hexUtils_2.HexUtils.distance(n, finish);
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
                    let stoneTop = assetManager_3.AssetManager.getAsset('Stone.Top');
                    let stoneLeft = assetManager_3.AssetManager.getAsset('Stone.Left');
                    let stoneBottom = assetManager_3.AssetManager.getAsset('Stone.Bottom');
                    let stoneRight = assetManager_3.AssetManager.getAsset('Stone.Right');
                    let grassTop = assetManager_3.AssetManager.getAsset('Grass.Top');
                    let grassLeft = assetManager_3.AssetManager.getAsset('Grass.Left');
                    let grassBottom = assetManager_3.AssetManager.getAsset('Grass.Bottom');
                    let grassRight = assetManager_3.AssetManager.getAsset('Grass.Right');
                    let waterTop = assetManager_3.AssetManager.getAsset('Water.Top');
                    let waterLeft = assetManager_3.AssetManager.getAsset('Water.Left');
                    let waterBottom = assetManager_3.AssetManager.getAsset('Water.Bottom');
                    let waterRight = assetManager_3.AssetManager.getAsset('Water.Right');
                    let ys = str.split('|');
                    for (let z = 0; z < terrain.height; z++) {
                        const yItem = ys[z].split('');
                        for (let x = 0; x < terrain.width; x++) {
                            const tileType = parseInt(yItem[x]);
                            let gridHexagon = new gridHexagon_1.GridHexagon();
                            gridHexagon.x = x;
                            gridHexagon.z = z;
                            gridHexagon.tileType = tileType;
                            if (tileType == 0) {
                                gridHexagon.setTexture(waterTop, waterLeft, waterBottom, waterRight);
                            }
                            else if (tileType > 0 && tileType < 3) {
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
                    this.hexListLength = this.hexList.length;
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
                                    entity = new mainBaseEntity_1.MainBaseEntity(this.entityManager, stateEntity);
                                    break;
                                }
                                case "Base": {
                                    entity = new regularBaseEntity_1.RegularBaseEntity(this.entityManager, stateEntity);
                                    break;
                                }
                                case "Heli": {
                                    entity = new heliEntity_1.HeliEntity(this.entityManager, stateEntity);
                                    entity.setDirection(stateEntity.direction);
                                    break;
                                }
                                case "Infantry": {
                                    entity = new infantyEntity_1.InfantryEntity(this.entityManager, stateEntity);
                                    entity.setDirection(stateEntity.direction);
                                    break;
                                }
                                case "Tank": {
                                    entity = new tankEntity_1.TankEntity(this.entityManager, stateEntity);
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
                    this.resetVisibleHexList();
                }
                drawBoard(context, viewPort) {
                    context.lineWidth = 1;
                    let vx = viewPort.getX();
                    let vy = viewPort.getY();
                    let vw = viewPort.getWidth();
                    let vh = viewPort.getHeight();
                    // context.drawImage(this.hexListCanvas.canvas, vx, vy, vw, vh, vx, vy, vw, vh);
                    for (let j = 0; j < this.visibleHexListMap.length; j++) {
                        let gridHexagon = this.visibleHexListMap[j];
                        gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
                    }
                    let entList = this.visibleEntityMap;
                    for (let j = 0; j < entList.length; j++) {
                        entList[j].draw(context);
                    }
                }
                resetVisibleHexList() {
                    let viewPort = gameService_2.GameService.getGameManager().viewPort;
                    let visibleHexList = [];
                    let visibleEntity = [];
                    for (let i = 0; i < this.hexList.length; i++) {
                        const gridHexagon = this.hexList[i];
                        if (gridHexagon.shouldDraw(viewPort)) {
                            visibleHexList.push(gridHexagon);
                            let entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                            if (entities.length) {
                                for (let c = 0; c < entities.length; c++) {
                                    visibleEntity.push(entities[c]);
                                }
                            }
                        }
                    }
                    this.visibleHexListMap = visibleHexList;
                    this.visibleEntityMap = visibleEntity;
                }
            };
            exports_22("HexBoard", HexBoard);
        }
    };
});
System.register("dataServices", [], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
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
            exports_23("WorkerService", WorkerService);
            WorkerService.start();
            DataService = class DataService {
                // private static voteServer: string = 'http://localhost:3568/';
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
                        if (!m.metrics)
                            return null;
                        m.metrics.nextGenerationDate = new Date(m.metrics.nextGeneration);
                        return m.metrics;
                    }
                    catch (ex) {
                        console.error('Fetch Error :-S', ex);
                        return null;
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
            DataService.voteServer = 'https://vote.socialwargames.com/';
            DataService.compressor = new Compressor();
            exports_23("DataService", DataService);
        }
    };
});
System.register("entities/entityDetails", [], function (exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var EntityDetail, EntityDetails;
    return {
        setters: [],
        execute: function () {
            EntityDetail = class EntityDetail {
            };
            exports_24("EntityDetail", EntityDetail);
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
            exports_24("EntityDetails", EntityDetails);
        }
    };
});
System.register("game/gameManager", ["utils/drawingUtilities", "game/hexUtils", "game/hexBoard", "dataServices", "animationManager", "game/gridHexagonConstants", "utils/hexagonColorUtils", "ui/gameService", "utils/debounceUtils", "game/viewPort", "entities/entityDetails"], function (exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var drawingUtilities_2, hexUtils_3, hexBoard_1, dataServices_1, animationManager_3, gridHexagonConstants_5, hexagonColorUtils_3, gameService_3, debounceUtils_2, viewPort_1, entityDetails_1, GameManager;
    return {
        setters: [
            function (drawingUtilities_2_1) {
                drawingUtilities_2 = drawingUtilities_2_1;
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
            function (animationManager_3_1) {
                animationManager_3 = animationManager_3_1;
            },
            function (gridHexagonConstants_5_1) {
                gridHexagonConstants_5 = gridHexagonConstants_5_1;
            },
            function (hexagonColorUtils_3_1) {
                hexagonColorUtils_3 = hexagonColorUtils_3_1;
            },
            function (gameService_3_1) {
                gameService_3 = gameService_3_1;
            },
            function (debounceUtils_2_1) {
                debounceUtils_2 = debounceUtils_2_1;
            },
            function (viewPort_1_1) {
                viewPort_1 = viewPort_1_1;
            },
            function (entityDetails_1_1) {
                entityDetails_1 = entityDetails_1_1;
            }
        ],
        execute: function () {
            GameManager = class GameManager {
                constructor(pageManager) {
                    this.pageManager = pageManager;
                    this.viewPort = new viewPort_1.ViewPort();
                    gameService_3.GameService.setGameManager(this);
                }
                async init() {
                    hexagonColorUtils_3.HexagonColorUtils.setupColors();
                    this.hexBoard = new hexBoard_1.HexBoard();
                    this.animationManager = new animationManager_3.AnimationManager(this.hexBoard);
                    let state = await dataServices_1.DataService.getGameState();
                    gameService_3.GameService.secondsPerGeneration = state.tickIntervalSeconds;
                    this.hexBoard.initialize(state);
                    this.createMiniCanvas();
                    this.rebuildMiniBoard(false);
                    await this.checkState();
                    gameService_3.GameService.hasData && gameService_3.GameService.hasData();
                    let lx = localStorage.getItem("lastX");
                    let ly = localStorage.getItem("lastY");
                    if (lx && ly) {
                        this.setView(parseInt(lx), parseInt(ly));
                    }
                    /*        setTimeout(() => {
                     this.randomTap();
                     }, 1000);*/
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
                    mc.on('panstart', () => {
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
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
                        const x = gridHexagonConstants_5.GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        let z = gridHexagon.z * gridHexagonConstants_5.GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_5.GridMiniHexagonConstants.height() / 2) : 0);
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_5.GridMiniHexagonConstants.hexagonTopPolygon())) {
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
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
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
                    this.viewPort.offset(context);
                    this.hexBoard.drawBoard(context, this.viewPort);
                    context.restore();
                    /*        context.save();
                     context.strokeStyle='white';
                     context.lineWidth=3;
                     context.strokeRect(0, 0, this.viewPort.getWidth() / 2, this.viewPort.getHeight() / 2)
                     context.restore();*/
                }
                tick() {
                    this.hexBoard.entityManager.tick();
                }
                cantAct() {
                    return this.checking || !this.hexBoard || this.hexBoard.generation == -1 || this.animationManager.isRunning;
                }
                async checkState() {
                    // console.log('got state',+new Date());
                    if (this.cantAct()) {
                        debounceUtils_2.DebounceUtils.debounce("checkState", 1000 * 5, () => this.checkState());
                        return;
                    }
                    this.checking = true;
                    let metrics = await dataServices_1.DataService.getGameMetrics();
                    if (!metrics) {
                        this.checking = false;
                        debounceUtils_2.DebounceUtils.debounce("checkState", 1000 * 5, () => this.checkState());
                        return;
                    }
                    let seconds = (+metrics.nextGenerationDate - +new Date()) / 1000;
                    gameService_3.GameService.setSecondsToNextGeneration(seconds);
                    for (let i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
                        let ent = this.hexBoard.entityManager.entities[i];
                        ent.resetVotes();
                    }
                    if (this.hexBoard.generation != metrics.generation) {
                        console.log(`Gen - old: ${this.hexBoard.generation} new ${metrics.generation}`);
                        let result = await dataServices_1.DataService.getGenerationResult(this.hexBoard.generation);
                        gameService_3.GameService.resetSelection();
                        let hexListLength = this.hexBoard.hexListLength;
                        for (let i = 0; i < hexListLength; i++) {
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
                                return this.checkState();
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
                    debounceUtils_2.DebounceUtils.debounce("checkState", 1000 * (seconds > 5 ? 5 : Math.max(seconds, .5)), () => {
                        this.checkState();
                    });
                }
                startAction() {
                    this.resetBoardColors();
                    let entities = this.hexBoard.entityManager.getEntitiesAtTile(gameService_3.GameService.selectedHex);
                    let selectedEntity = entities[0];
                    if (!selectedEntity) {
                        gameService_3.GameService.resetSelection();
                        return false;
                    }
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
                        let h = this.hexBoard.hexList[i];
                        h.setShowVotes(false);
                    }
                    let radius = 0;
                    let entityDetail = entityDetails_1.EntityDetails.instance.details[selectedEntity.entityType];
                    if (!gameService_3.GameService.selectedAction) {
                        gameService_3.GameService.selectedAction = entityDetail.defaultAction;
                    }
                    gameService_3.GameService.setSelectedEntity(selectedEntity);
                    let selectedAction = gameService_3.GameService.selectedAction;
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
                    let spots = this.findAvailableSpots(radius, gameService_3.GameService.selectedHex);
                    gameService_3.GameService.selectedHex.setShowVotes(true);
                    for (let i = 0; i < spots.length; i++) {
                        let spot = spots[i];
                        if (spot == gameService_3.GameService.selectedHex)
                            continue;
                        let entities = this.hexBoard.entityManager.getEntitiesAtTile(spot);
                        switch (selectedAction) {
                            case "move":
                                {
                                    if (entities.length > 0)
                                        continue;
                                    let path = this.hexBoard.pathFind(gameService_3.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        spot.setHighlightColor(hexagonColorUtils_3.HexagonColorUtils.moveHighlightColor);
                                        spot.setShowVotes(true);
                                        selectedEntity.setSecondaryVoteColor(spot);
                                        // spot.setHeightOffset(.25);
                                    }
                                }
                                break;
                            case "attack":
                                {
                                    if (entities[0] && entities[0].faction == gameService_3.GameService.selectedEntity.faction)
                                        continue;
                                    let path = this.hexBoard.pathFind(gameService_3.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        if (entities.length == 0) {
                                            spot.setHighlightColor(hexagonColorUtils_3.HexagonColorUtils.moveHighlightColor);
                                            spot.setShowVotes(true);
                                            selectedEntity.setSecondaryVoteColor(spot);
                                            // spot.setHeightOffset(.25);
                                        }
                                        else {
                                            spot.setHighlightColor(hexagonColorUtils_3.HexagonColorUtils.attackHighlightColor);
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
                                    let path = this.hexBoard.pathFind(gameService_3.GameService.selectedHex, spot);
                                    if (path.length > 1 && path.length <= radius + 1) {
                                        spot.setHighlightColor(hexagonColorUtils_3.HexagonColorUtils.spawnHighlightColor);
                                        spot.setShowVotes(true);
                                        selectedEntity.setSecondaryVoteColor(spot);
                                        // spot.setHeightOffset(.25);
                                    }
                                }
                                break;
                        }
                    }
                    return true;
                }
                async processAction(hex) {
                    let entityDetail = entityDetails_1.EntityDetails.instance.details[gameService_3.GameService.selectedEntity.entityType];
                    this.resetBoardColors();
                    let distance = hexUtils_3.HexUtils.distance(gameService_3.GameService.selectedHex, hex);
                    if (distance == 0) {
                        gameService_3.GameService.resetSelection();
                        return;
                    }
                    let radius = 0;
                    switch (gameService_3.GameService.selectedAction) {
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
                        gameService_3.GameService.resetSelection();
                        gameService_3.GameService.selectedHex = hex;
                        this.startAction();
                        return;
                    }
                    switch (gameService_3.GameService.selectedAction) {
                        case "move":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length > 0) {
                                    gameService_3.GameService.selectedHex = hex;
                                    gameService_3.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                        case "attack":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length == 0) {
                                    gameService_3.GameService.selectedHex = hex;
                                    gameService_3.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                        case "spawn":
                            {
                                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                if (entities.length > 0) {
                                    gameService_3.GameService.selectedHex = hex;
                                    gameService_3.GameService.setSelectedEntity(null);
                                    this.startAction();
                                    return;
                                }
                            }
                            break;
                    }
                    await this.vote(gameService_3.GameService.selectedEntity, gameService_3.GameService.selectedAction, hex.x, hex.z);
                    gameService_3.GameService.resetSelection();
                }
                findAvailableSpots(radius, center) {
                    let items = [];
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let q = 0; q < hexListLength; q++) {
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
                    /*    if(hex.highlightColor!=null){
                     hex.clearHighlightColor();
                     }else{
                     hex.setHighlightColor(HexagonColorUtils.voteColor[4]);
                     }*/
                    if (!hex) {
                        gameService_3.GameService.resetSelection();
                        return;
                    }
                    if (!gameService_3.GameService.selectedHex) {
                        gameService_3.GameService.selectedHex = hex;
                        this.startAction();
                    }
                    else {
                        await this.processAction(hex);
                    }
                }
                resize(width, height) {
                    this.viewPort.setSize(width, height);
                    this.constrainViewPort();
                }
                offsetView(x, y) {
                    this.setView(this.viewPort.getX() + x, this.viewPort.getY() + y);
                }
                setView(x, y) {
                    this.viewPort.setPosition(x, y);
                    this.constrainViewPort();
                    this.viewPort.setLocalStorage();
                }
                constrainViewPort() {
                    this.viewPort.constrainViewPort(this.hexBoard.gameDimensions());
                    this.hexBoard.resetVisibleHexList();
                }
                getHexAtPoint(clickX, clickY) {
                    let lastClick = null;
                    clickX /= this.viewPort.getScale().x;
                    clickY /= this.viewPort.getScale().y;
                    clickX += this.viewPort.getZoomedX();
                    clickY += this.viewPort.getZoomedY();
                    let hexWidth = gridHexagonConstants_5.GridHexagonConstants.width * 3 / 4;
                    let gridHeight = gridHexagonConstants_5.GridHexagonConstants.height();
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
                        const x = hexWidth * gridHexagon.x;
                        let z = gridHexagon.z * gridHeight + ((gridHexagon.x % 2 === 1) ? (-gridHeight / 2) : 0);
                        let offClickX = clickX - x;
                        let offClickY = clickY - z;
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_5.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                    }
                    return lastClick;
                }
                centerOnHex(gridHexagon) {
                    const x = gridHexagon.getRealX();
                    const y = gridHexagon.getRealZ();
                    this.setView(x - this.viewPort.getWidth() / 2, y - this.viewPort.getHeight() / 2);
                }
                resetBoardColors() {
                    let length = this.hexBoard.hexListLength;
                    for (let i = 0; i < length; i++) {
                        let h = this.hexBoard.hexList[i];
                        h.clearHighlightColor();
                        h.clearSecondaryVoteColor();
                        h.setShowVotes(true);
                    }
                }
            };
            exports_25("GameManager", GameManager);
        }
    };
});
System.register("ui/gameService", [], function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var GameService;
    return {
        setters: [],
        execute: function () {
            GameService = class GameService {
                static get selectedEntity() {
                    return this._selectedEntity;
                }
                static setSelectedEntity(entity) {
                    this._selectedEntity = entity;
                    this.onSetSelectedEntity(entity);
                    if (entity != null) {
                        this.gameManager.viewPort.animateZoom(1.5, entity.getTile());
                    }
                    else {
                        this.gameManager.viewPort.animateZoom(1, null);
                    }
                }
                static resetSelection() {
                    this._selectedEntity = null;
                    this.selectedHex = null;
                    this.selectedAction = null;
                    this.onSetSelectedEntity(null);
                    this.gameManager.viewPort.animateZoom(1, null);
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
            exports_26("GameService", GameService);
        }
    };
});
System.register("game/gridHexagonConstants", ["utils/utils", "game/gridHexagon", "ui/gameService"], function (exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var utils_1, gridHexagon_2, gameService_4, GridHexagonConstants, GridMiniHexagonConstants;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridHexagon_2_1) {
                gridHexagon_2 = gridHexagon_2_1;
            },
            function (gameService_4_1) {
                gameService_4 = gameService_4_1;
            }
        ],
        execute: function () {
            GridHexagonConstants = class GridHexagonConstants {
                static generate(width) {
                    this.width = width;
                    this.heightSkew = .7;
                    this._height = Math.ceil(Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew);
                    this._topPolygon = GridHexagonConstants.makeHexagonDepthTopPolygon();
                    gridHexagon_2.GridHexagon.generateHexCenters();
                    if (gameService_4.GameService.getGameManager() && gameService_4.GameService.getGameManager().hexBoard && gameService_4.GameService.getGameManager().hexBoard.hexList) {
                        let hexList = gameService_4.GameService.getGameManager().hexBoard.hexList;
                        for (let i = 0; i < hexList.length; i++) {
                            let hex = hexList[i];
                            hex.buildPaths();
                        }
                    }
                }
                static height() {
                    return this._height;
                }
                static hexagonTopPolygon() {
                    return this._topPolygon;
                }
                ;
                static makeHexagonDepthTopPolygon() {
                    let halfWidth = Math.ceil(GridHexagonConstants.width / 2);
                    let quarterWidth = Math.ceil(GridHexagonConstants.width / 4);
                    let halfHeight = Math.ceil(GridHexagonConstants._height / 2);
                    return [
                        new utils_1.Point(-halfWidth, 0),
                        new utils_1.Point(-quarterWidth, -halfHeight),
                        new utils_1.Point(quarterWidth, -halfHeight),
                        new utils_1.Point(halfWidth, 0),
                        new utils_1.Point(quarterWidth, halfHeight),
                        new utils_1.Point(-quarterWidth, halfHeight),
                        new utils_1.Point(-halfWidth, 0)
                    ];
                }
                ;
            };
            exports_27("GridHexagonConstants", GridHexagonConstants);
            GridMiniHexagonConstants = class GridMiniHexagonConstants {
                static height() {
                    return Math.ceil(Math.sqrt(3) / 2 * this.width * this.heightSkew);
                }
                static hexagonTopPolygon() {
                    let halfWidth = Math.ceil(this.width / 2);
                    let quarterWidth = Math.ceil(this.width / 4);
                    let halfHeight = Math.ceil(this.height() / 2);
                    return [
                        new utils_1.Point(-halfWidth, 0),
                        new utils_1.Point(-quarterWidth, -halfHeight),
                        new utils_1.Point(quarterWidth, -halfHeight),
                        new utils_1.Point(halfWidth, 0),
                        new utils_1.Point(quarterWidth, halfHeight),
                        new utils_1.Point(-quarterWidth, halfHeight),
                        new utils_1.Point(-halfWidth, 0)
                    ];
                }
                ;
            };
            GridMiniHexagonConstants.width = 10;
            GridMiniHexagonConstants.heightSkew = 0.7;
            exports_27("GridMiniHexagonConstants", GridMiniHexagonConstants);
        }
    };
});
///<reference path="../typings/path2d.d.ts"/>
System.register("game/gridHexagon", ["utils/drawingUtilities", "game/gridHexagonConstants", "utils/hexagonColorUtils", "ui/gameService"], function (exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var drawingUtilities_3, gridHexagonConstants_6, hexagonColorUtils_4, gameService_5, GridHexagon;
    return {
        setters: [
            function (drawingUtilities_3_1) {
                drawingUtilities_3 = drawingUtilities_3_1;
            },
            function (gridHexagonConstants_6_1) {
                gridHexagonConstants_6 = gridHexagonConstants_6_1;
            },
            function (hexagonColorUtils_4_1) {
                hexagonColorUtils_4 = hexagonColorUtils_4_1;
            },
            function (gameService_5_1) {
                gameService_5 = gameService_5_1;
            }
        ],
        execute: function () {///<reference path="../typings/path2d.d.ts"/>
            GridHexagon = class GridHexagon {
                constructor() {
                    this.topPath = null;
                    this.topPathInner = null;
                    this.topMiniPath = null;
                    this.x = 0;
                    this.z = 0;
                    this.tileType = 0;
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
                    return this._realX = (gridHexagonConstants_6.GridHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealZ() {
                    if (this._realZ !== undefined) {
                        return this._realZ;
                    }
                    let height = gridHexagonConstants_6.GridHexagonConstants.height();
                    return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0));
                }
                getScreenX() {
                    return this.getRealX() - gameService_5.GameService.getGameManager().viewPort.getX();
                }
                getScreenZ() {
                    return this.getRealZ() - gameService_5.GameService.getGameManager().viewPort.getY();
                }
                getRealMiniX() {
                    return (gridHexagonConstants_6.GridMiniHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealMiniZ() {
                    let height = gridHexagonConstants_6.GridMiniHexagonConstants.height();
                    return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0));
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
                    this.invalidateColor();
                }
                buildPaths() {
                    this._realX = undefined;
                    this._realZ = undefined;
                    this.topPath = GridHexagon.buildPath(gridHexagonConstants_6.GridHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                }
                buildMiniPaths() {
                    this.topMiniPath = GridHexagon.buildPath(gridHexagonConstants_6.GridMiniHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                }
                invalidateColor() {
                    let entityColor = (this.entities.length > 0 && hexagonColorUtils_4.HexagonColorUtils.entityHexColor);
                    let voteColor = this.voteColor;
                    let secondaryVoteColor = this.secondaryVoteColor;
                    let highlightColor = this.highlightColor;
                    let factionColor = (this.faction > 0 && hexagonColorUtils_4.HexagonColorUtils.factionHexColors[this.faction - 1][this.tileType]);
                    let baseColor = (this.baseColor && this.baseColor[this.tileType]);
                    this.currentDrawColorNoVote = factionColor || baseColor;
                    this.currentDrawColor = voteColor || secondaryVoteColor || highlightColor || entityColor || factionColor || baseColor;
                    this.currentFactionColor = factionColor || baseColor;
                    this.currentMiniColor = voteColor || entityColor || factionColor || baseColor;
                    if (this.currentDrawColor && this.textureTop) {
                        this.drawCache = GridHexagon.getCacheImage(this.currentDrawColor, this.textureTop.name);
                        this.drawCacheNoVote = GridHexagon.getCacheImage(this.currentDrawColorNoVote, this.textureTop.name);
                        this.drawMiniCache = GridHexagon.getMiniCacheImage(this.currentMiniColor);
                    }
                }
                drawTop(context, color) {
                    context.save();
                    {
                        context.save();
                        {
                            context.clip(this.topPath);
                            context.fillStyle = context.createPattern(this.textureTop.image, 'repeat');
                            context.fillRect(-gridHexagonConstants_6.GridHexagonConstants.width / 2, -gridHexagonConstants_6.GridHexagonConstants.height() / 2, gridHexagonConstants_6.GridHexagonConstants.width, gridHexagonConstants_6.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_3.DrawingUtils.makeTransparent(color.color, .7);
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
                    let color = this.currentMiniColor.color;
                    context.fillStyle = color;
                    context.fill(this.topMiniPath);
                    /*        context.lineWidth = 3;
                     context.strokeStyle = color;
                     context.stroke(this.topMiniPath);*/
                }
                envelope() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_6.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_6.GridHexagonConstants.height();
                    size.width += 12;
                    size.height += 6;
                    return size;
                }
                envelopeMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_6.GridMiniHexagonConstants.width;
                    size.height = gridHexagonConstants_6.GridMiniHexagonConstants.height();
                    size.width += 20;
                    size.height += 20;
                    return size;
                }
                static generateHexCenters() {
                    this.hexCenter = { x: (gridHexagonConstants_6.GridHexagonConstants.width / 2 + 6), y: (gridHexagonConstants_6.GridHexagonConstants.height() / 2 + 6) };
                    this.hexCenterMini = {
                        x: (gridHexagonConstants_6.GridMiniHexagonConstants.width / 2 + 6),
                        y: (gridHexagonConstants_6.GridMiniHexagonConstants.height() / 2 + 6)
                    };
                }
                draw(context, offsetX, offsetY) {
                    if (this.showVotes) {
                        if (this.drawCache) {
                            context.drawImage(this.drawCache, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
                            /*
                             context.fillStyle = 'black';
                             context.font = '11px bold san-serif';
                             context.fillText(this.x + "," + this.z, offsetX - 10, offsetY + 5)
                             */
                        }
                        else {
                            let cacheImage = GridHexagon.getCacheImage(this.currentDrawColor, this.textureTop.name);
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
                            let cacheImage = GridHexagon.getCacheImage(this.currentDrawColor, this.textureTop.name);
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
                static getCacheImage(hexColor, texture) {
                    const c = `${hexColor.color}-${texture}`;
                    return GridHexagon.caches[c];
                }
                static setCacheImage(hexColor, texture, img) {
                    const c = `${hexColor.color}-${texture}`;
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
                    ctx.save();
                    ctx.lineWidth = 1;
                    //ctx.lineCap = "round";
                    //ctx.lineJoin = "round";
                    this.drawTop(ctx, color);
                    ctx.restore();
                    ctx.restore();
                    GridHexagon.setCacheImage(color, this.textureTop.name, can);
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
                    return viewPort.shouldDraw(x, y);
                }
                setShowVotes(showVotes) {
                    this.showVotes = showVotes;
                }
            };
            GridHexagon.caches = {};
            exports_28("GridHexagon", GridHexagon);
        }
    };
});
System.register("game/hexUtils", [], function (exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
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
            exports_29("Node", Node);
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
            exports_29("HexUtils", HexUtils);
            (function (Direction) {
                Direction[Direction["Top"] = 0] = "Top";
                Direction[Direction["TopRight"] = 1] = "TopRight";
                Direction[Direction["BottomRight"] = 2] = "BottomRight";
                Direction[Direction["Bottom"] = 3] = "Bottom";
                Direction[Direction["BottomLeft"] = 4] = "BottomLeft";
                Direction[Direction["TopLeft"] = 5] = "TopLeft";
            })(Direction || (Direction = {}));
            exports_29("Direction", Direction);
        }
    };
});
System.register("pageManager", ["game/menuManager", "game/hexUtils", "game/gameManager", "utils/hexagonColorUtils"], function (exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
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
                    document.onkeydown = (e) => {
                        if (e.key == 'a') {
                            // this.gameManager.viewPort.animateZoom(1.5,this.gameManager.selectedTile);
                        }
                    };
                }
                async init() {
                    this.gameManager = new gameManager_1.GameManager(this);
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
                        this.tapStart.x = this.gameManager.viewPort.getX();
                        this.tapStart.y = this.gameManager.viewPort.getY();
                        var scaleFactor = this.gameManager.viewPort.getScale();
                        this.gameManager.setView(this.tapStart.x - ev.deltaX / scaleFactor.x, this.tapStart.y - ev.deltaY / scaleFactor.y);
                        return true;
                    });
                    mc.on('panmove', (ev) => {
                        if (this.menuManager.isOpen) {
                            return false;
                        }
                        var scaleFactor = this.gameManager.viewPort.getScale();
                        this.gameManager.setView(this.tapStart.x - ev.deltaX / scaleFactor.x, this.tapStart.y - ev.deltaY / scaleFactor.y);
                    });
                    mc.on('swipe', (ev) => {
                        if (this.menuManager.isOpen) {
                            return false;
                        }
                        this.menuManager.closeMenu();
                        var scaleFactor = this.gameManager.viewPort.getScale();
                        this.swipeVelocity.x = ev.velocityX * 10 / scaleFactor.x;
                        this.swipeVelocity.y = ev.velocityY * 10 / scaleFactor.y;
                    });
                    mc.on('tap', (ev) => {
                        let x = ev.center.x;
                        let y = ev.center.y;
                        this.swipeVelocity.x = this.swipeVelocity.y = 0;
                        if (!this.menuManager.tap(x, y)) {
                            this.gameManager.tapHex(x, y);
                        }
                    });
                    this.draw();
                }
                draw() {
                    this.tick();
                    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.gameManager.draw(this.context);
                    this.menuManager.draw();
                    this.fpsMeter.tick();
                    requestAnimationFrame(() => {
                        this.draw();
                    });
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
                    if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0) {
                        this.gameManager.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
                    }
                    /*else {
                     this.gameManager.hexBoard.resetVisibleHexList()
                     }*/
                    this.gameManager.tick();
                }
            };
            exports_30("PageManager", PageManager);
        }
    };
});
System.register("ui/gameController", ["react", "ui/gameService", "entities/entityDetails"], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var react_1, gameService_6, entityDetails_2, GameUI;
    return {
        setters: [
            function (react_1_1) {
                react_1 = react_1_1;
            },
            function (gameService_6_1) {
                gameService_6 = gameService_6_1;
            },
            function (entityDetails_2_1) {
                entityDetails_2 = entityDetails_2_1;
            }
        ],
        execute: function () {
            GameUI = class GameUI extends react_1.default.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        name: 'foo',
                        timerPercent: 0,
                        loading: true,
                        selectedAction: 'move',
                        selectedEntity: null,
                        canAttack: false,
                        canMove: false,
                        canSpawn: false,
                        maxEntityHealth: 0
                    };
                }
                componentDidMount() {
                    let secondsTick = 0;
                    gameService_6.GameService.onSetSelectedEntity = (entity) => {
                        if (entity) {
                            let detail = entityDetails_2.EntityDetails.instance.details[entity.entityType];
                            this.setState({
                                canSpawn: detail.spawnRadius > 0,
                                canAttack: detail.attackRadius > 0,
                                canMove: detail.moveRadius > 0,
                                selectedAction: gameService_6.GameService.selectedAction,
                                maxEntityHealth: detail.health,
                                selectedEntity: entity
                            });
                        }
                        else {
                            this.setState({
                                canSpawn: false,
                                canAttack: false,
                                canMove: false,
                                selectedAction: null,
                                maxEntityHealth: 0,
                                selectedEntity: null
                            });
                        }
                    };
                    gameService_6.GameService.hasData = () => {
                        this.setState({
                            loading: false
                        });
                    };
                    gameService_6.GameService.setSecondsToNextGeneration = (seconds) => {
                        secondsTick = 100 / (10 * gameService_6.GameService.secondsPerGeneration);
                        this.setState({
                            timerPercent: Math.min(100 - (seconds / gameService_6.GameService.secondsPerGeneration * 100), 100)
                        });
                    };
                    setInterval(() => {
                        let timePercent = this.state.timerPercent;
                        if (timePercent < 100) {
                            timePercent += secondsTick;
                        }
                        timePercent = Math.min(timePercent, 100);
                        this.setState({
                            timerPercent: timePercent
                        });
                    }, 100);
                }
                componentWillUnmount() {
                }
                setSelectedAction(action) {
                    this.setState({
                        selectedAction: action
                    });
                    gameService_6.GameService.selectedAction = action;
                    setTimeout(() => {
                        gameService_6.GameService.getGameManager().startAction();
                    }, 0);
                }
                render() {
                    return (react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "game-ui", style: { display: this.state.loading ? 'none' : 'block' } },
                            react_1.default.createElement("div", { className: "countdown-container" },
                                react_1.default.createElement("div", { className: `countdown-container-ticker ${this.state.timerPercent >= 96 && 'countdown-frozen'}`, style: { width: `${this.state.timerPercent}%` } })),
                            react_1.default.createElement("div", { className: "center" }, this.state.selectedEntity &&
                                react_1.default.createElement("div", { style: { height: '100%' } },
                                    react_1.default.createElement("img", { src: `/images/${this.state.selectedEntity.entityType}/up_1.png`, style: { float: 'left', width: '6vw', height: '6vh', marginLeft: '10px', marginTop: '10px' } }),
                                    react_1.default.createElement("div", { style: { float: 'left', marginLeft: '20px' } },
                                        react_1.default.createElement("span", { className: "label" },
                                            "Health: ",
                                            this.state.selectedEntity.health,
                                            "/",
                                            this.state.maxEntityHealth),
                                        react_1.default.createElement("br", null),
                                        react_1.default.createElement("span", { className: "label" },
                                            "Votes: ",
                                            this.state.selectedEntity.totalVoteCount)),
                                    this.state.canMove &&
                                        react_1.default.createElement("div", { className: `action-button move-button ${this.state.selectedAction == 'move' && 'selected-button'}`, onClick: () => this.setSelectedAction('move') }, "Move"),
                                    this.state.canAttack &&
                                        react_1.default.createElement("div", { className: `action-button attack-button ${this.state.selectedAction == 'attack' && 'selected-button'}`, onClick: () => this.setSelectedAction('attack') }, "Attack"),
                                    this.state.canSpawn &&
                                        react_1.default.createElement("div", { className: `action-button spawn-button ${this.state.selectedAction == 'spawn' && 'selected-button'}`, onClick: () => this.setSelectedAction('spawn') }, "Tank"))),
                            react_1.default.createElement("div", { className: "left-bubble", id: "leftBubble" })),
                        this.state.loading && react_1.default.createElement("div", { className: "loading" }, ">Loading\u2026")));
                }
            };
            exports_31("GameUI", GameUI);
        }
    };
});
System.register("main", ["react", "react-dom", "game/AssetManager", "pageManager", "game/gridHexagonConstants", "ui/gameController"], function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var react_2, react_dom_1, assetManager_4, pageManager_1, gridHexagonConstants_7, gameController_1, Main;
    return {
        setters: [
            function (react_2_1) {
                react_2 = react_2_1;
            },
            function (react_dom_1_1) {
                react_dom_1 = react_dom_1_1;
            },
            function (assetManager_4_1) {
                assetManager_4 = assetManager_4_1;
            },
            function (pageManager_1_1) {
                pageManager_1 = pageManager_1_1;
            },
            function (gridHexagonConstants_7_1) {
                gridHexagonConstants_7 = gridHexagonConstants_7_1;
            },
            function (gameController_1_1) {
                gameController_1 = gameController_1_1;
            }
        ],
        execute: function () {
            Main = class Main {
                static run() {
                    gridHexagonConstants_7.GridHexagonConstants.generate(60);
                    react_dom_1.default.render(react_2.default.createElement(gameController_1.GameUI, null), document.getElementById('game-ui'));
                    this.loadAssets(() => {
                        this.pageManager = new pageManager_1.PageManager();
                        this.pageManager.init();
                    });
                }
                static loadAssets(onComplete) {
                    assetManager_4.AssetManager.completed = onComplete;
                    var size = { width: 80, height: 80 };
                    var base = { x: 40, y: 55 };
                    assetManager_4.AssetManager.addAsset('MainBase', 'images/MainBase/up_1.png', size, base);
                    assetManager_4.AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
                    assetManager_4.AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);
                    assetManager_4.AssetManager.addAsset('Stone.Top', 'images/tile.png');
                    assetManager_4.AssetManager.addAsset('Stone.Left', 'images/tile.png');
                    assetManager_4.AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
                    assetManager_4.AssetManager.addAsset('Stone.Right', 'images/tile.png');
                    assetManager_4.AssetManager.addAsset('Grass.Top', 'images/grass.png');
                    assetManager_4.AssetManager.addAsset('Grass.Left', 'images/grass.png');
                    assetManager_4.AssetManager.addAsset('Grass.Bottom', 'images/grass.png');
                    assetManager_4.AssetManager.addAsset('Grass.Right', 'images/grass.png');
                    assetManager_4.AssetManager.addAsset('Water.Top', 'images/water.png');
                    assetManager_4.AssetManager.addAsset('Water.Left', 'images/water.png');
                    assetManager_4.AssetManager.addAsset('Water.Bottom', 'images/water.png');
                    assetManager_4.AssetManager.addAsset('Water.Right', 'images/water.png');
                    /*
                     AssetManager.addAsset('Stone.Top', 'images/tile.png');
                     AssetManager.addAsset('Stone.Left', 'images/tile.png');
                     AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
                     AssetManager.addAsset('Stone.Right', 'images/tile.png');
                     */
                    assetManager_4.AssetManager.addAssetFrame('Heli', 0, 'images/Heli/up_1.png', null, null);
                    assetManager_4.AssetManager.addAssetFrame('Heli', 1, 'images/Heli/up_2.png', null, null);
                    assetManager_4.AssetManager.addAssetFrame('Tank', 0, 'images/Tank/up_1.png', null, null);
                    assetManager_4.AssetManager.addAssetFrame('Tank', 1, 'images/Tank/up_1.png', null, null);
                    assetManager_4.AssetManager.addAssetFrame('Missile', 0, 'images/Missile/up_1.png', null, null);
                    assetManager_4.AssetManager.addAssetFrame('Missile', 1, 'images/Missile/up_2.png', null, null);
                    assetManager_4.AssetManager.start();
                }
            };
            exports_32("Main", Main);
            Main.run();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy91dGlscy91dGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9Bc3NldE1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvbWVudU1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2RyYXdpbmdVdGlsaXRpZXMudHMiLCIuLi9jb21wb25lbnRzL21vZGVscy9oZXhCb2FyZC50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvY29sb3IudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2hlbHAudHMiLCIuLi9jb21wb25lbnRzL2FuaW1hdGlvbk1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2hleGFnb25Db2xvclV0aWxzLnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9iYXNlRW50aXR5LnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9lbnRpdHlNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9hbmltYXRpb25VdGlscy50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvZGVib3VuY2VVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS92aWV3UG9ydC50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvc3RhdGlvbmFyeUVudGl0eS50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvbWFpbkJhc2VFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL3JlZ3VsYXJCYXNlRW50aXR5LnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9zaXhEaXJlY3Rpb25FbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL2hlbGlFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL2luZmFudHlFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL3RhbmtFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvaGV4Qm9hcmQudHMiLCIuLi9jb21wb25lbnRzL2RhdGFTZXJ2aWNlcy50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvZW50aXR5RGV0YWlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9nYW1lTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdWkvZ2FtZVNlcnZpY2UudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvZ3JpZEhleGFnb25Db25zdGFudHMudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvZ3JpZEhleGFnb24udHMiLCIuLi9jb21wb25lbnRzL2dhbWUvaGV4VXRpbHMudHMiLCIuLi9jb21wb25lbnRzL3BhZ2VNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91aS9nYW1lQ29udHJvbGxlci50c3giLCIuLi9jb21wb25lbnRzL21haW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFBQSxRQUFBO2dCQUlJLElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBVTtvQkFDM0IsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELFlBQVksQ0FBUyxFQUFFLENBQVM7b0JBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29C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