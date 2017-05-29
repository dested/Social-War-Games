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
System.register("game/assetManager", [], function (exports_2, context_2) {
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
System.register("game/viewPort", ["utils/animationUtils", "game/gridHexagonConstants", "utils/debounceUtils"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var animationUtils_1, gridHexagonConstants_1, debounceUtils_1, ViewPort;
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
                    if (this.zoomPosition) {
                        return this.x + this.zoomPosition.x / this.scaleFactor.x;
                    }
                    return this.x;
                }
                getZoomedY() {
                    if (this.zoomPosition) {
                        return this.y + this.zoomPosition.y / this.scaleFactor.y;
                    }
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
                animateZoom(scale, position) {
                    debounceUtils_1.DebounceUtils.debounce("animateZoom", 10, () => {
                        if (this.curAnimation) {
                            this.curAnimation.cancel = true;
                        }
                        if (!position) {
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
                                    this.zoomPosition = null;
                                }
                            });
                        }
                        else {
                            if (this.scaleFactor) {
                                animationUtils_1.AnimationUtils.start({
                                    start: this.zoomPosition.x,
                                    finish: position.x,
                                    callback: (c) => {
                                        this.zoomPosition.x = c;
                                    },
                                    duration: 600,
                                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                                });
                                animationUtils_1.AnimationUtils.start({
                                    start: this.zoomPosition.y,
                                    finish: position.y,
                                    callback: (c) => {
                                        this.zoomPosition.y = c;
                                    },
                                    duration: 600,
                                    easing: animationUtils_1.AnimationUtils.easings.easeOutQuint,
                                });
                            }
                            else {
                                this.curAnimation = animationUtils_1.AnimationUtils.start({
                                    start: 1,
                                    finish: scale,
                                    callback: (c) => {
                                        this.scaleFactor = { x: c, y: c };
                                        this.zoomPosition = position;
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
                zoom(context) {
                    if (this.scaleFactor && this.zoomPosition) {
                        context.translate(-(this.scaleFactor.x - 1) * this.zoomPosition.x, -(this.scaleFactor.y - 1) * this.zoomPosition.y);
                        context.scale(this.scaleFactor.x, this.scaleFactor.y);
                    }
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
System.register("entities/stationaryEntity", ["game/gridHexagonConstants", "game/assetManager", "entities/baseEntity"], function (exports_15, context_15) {
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
System.register("entities/sixDirectionEntity", ["game/hexUtils", "entities/baseEntity", "game/assetManager", "game/gridHexagonConstants", "animationManager"], function (exports_18, context_18) {
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
System.register("entities/heliEntity", ["game/gridHexagonConstants", "entities/sixDirectionEntity"], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var gridHexagonConstants_4, sixDirectionEntity_1, HeliEntity;
    return {
        setters: [
            function (gridHexagonConstants_4_1) {
                gridHexagonConstants_4 = gridHexagonConstants_4_1;
            },
            function (sixDirectionEntity_1_1) {
                sixDirectionEntity_1 = sixDirectionEntity_1_1;
            }
        ],
        execute: function () {
            HeliEntity = class HeliEntity extends sixDirectionEntity_1.SixDirectionEntity {
                realYOffset() {
                    let offset = gridHexagonConstants_4.GridHexagonConstants.depthHeight() / 3;
                    return -(Math.sin(this.drawTickNumber / 10)) * offset + offset * 1;
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
System.register("game/hexBoard", ["game/gridHexagonConstants", "game/gridHexagon", "entities/entityManager", "game/hexUtils", "game/assetManager", "utils/hexagonColorUtils", "entities/mainBaseEntity", "entities/regularBaseEntity", "entities/heliEntity", "entities/infantyEntity", "entities/tankEntity"], function (exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var gridHexagonConstants_5, gridHexagon_1, entityManager_1, hexUtils_2, assetManager_3, hexagonColorUtils_2, mainBaseEntity_1, regularBaseEntity_1, heliEntity_1, infantyEntity_1, tankEntity_1, HexBoard;
    return {
        setters: [
            function (gridHexagonConstants_5_1) {
                gridHexagonConstants_5 = gridHexagonConstants_5_1;
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
                    size.width = gridHexagonConstants_5.GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_5.GridHexagonConstants.height() * this.boardSize.height;
                    return size;
                }
                gameDimensionsMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_5.GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
                    size.height = gridHexagonConstants_5.GridMiniHexagonConstants.height() * this.boardSize.height;
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
                        hx_h[i] = hexUtils_2.HexUtils.orderBy(hx_h[i], m => (m.z) * 1000 + (m.x % 2) * -200);
                    }
                    this.hexList = [];
                    this.hexListHeightMap = [];
                    for (let i = 0; i < hx_h.length; i++) {
                        let h = hx_h[i];
                        // console.log(h.length);
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
                                if (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) >= 2)
                                    continue;
                                path = new hexUtils_2.Node(node, n);
                                if (!aStar[path.value()]) {
                                    path.g = node.g + hexUtils_2.HexUtils.distance(n, node.item) + (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) * 2);
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
                }
                drawBoard(context) {
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
                                    let aboveMe = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_2.Direction.Top);
                                    let localYOffset = 0;
                                    if (aboveMe && aboveMe.height > gridHexagon.height) {
                                        localYOffset = 1;
                                    }
                                    else {
                                        let topLeft = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_2.Direction.TopLeft);
                                        if (topLeft && topLeft.height > gridHexagon.height) {
                                            localYOffset = 1;
                                        }
                                        else {
                                            let topRight = this.getHexAtSpotDirection(gridHexagon.x, gridHexagon.z, hexUtils_2.Direction.TopRight);
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
    var drawingUtilities_2, hexUtils_3, hexBoard_1, dataServices_1, animationManager_3, gridHexagonConstants_6, hexagonColorUtils_3, gameService_1, debounceUtils_2, viewPort_1, entityDetails_1, GameManager;
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
            function (gridHexagonConstants_6_1) {
                gridHexagonConstants_6 = gridHexagonConstants_6_1;
            },
            function (hexagonColorUtils_3_1) {
                hexagonColorUtils_3 = hexagonColorUtils_3_1;
            },
            function (gameService_1_1) {
                gameService_1 = gameService_1_1;
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
                    gameService_1.GameService.setGameManager(this);
                }
                async init() {
                    hexagonColorUtils_3.HexagonColorUtils.setupColors();
                    this.hexBoard = new hexBoard_1.HexBoard();
                    this.animationManager = new animationManager_3.AnimationManager(this.hexBoard);
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
                        const x = gridHexagonConstants_6.GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
                        let z = gridHexagon.z * gridHexagonConstants_6.GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_6.GridMiniHexagonConstants.height() / 2) : 0);
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_6.GridMiniHexagonConstants.hexagonTopPolygon())) {
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
                    this.viewPort.zoom(context);
                    context.translate(-this.viewPort.getX(), -this.viewPort.getY());
                    this.hexBoard.drawBoard(context);
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
                    gameService_1.GameService.setSecondsToNextGeneration(seconds);
                    for (let i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
                        let ent = this.hexBoard.entityManager.entities[i];
                        ent.resetVotes();
                    }
                    if (this.hexBoard.generation != metrics.generation) {
                        console.log(`Gen - old: ${this.hexBoard.generation} new ${metrics.generation}`);
                        let result = await dataServices_1.DataService.getGenerationResult(this.hexBoard.generation);
                        gameService_1.GameService.resetSelection();
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
                    let entities = this.hexBoard.entityManager.getEntitiesAtTile(gameService_1.GameService.selectedHex);
                    let selectedEntity = entities[0];
                    if (!selectedEntity) {
                        gameService_1.GameService.resetSelection();
                        return false;
                    }
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
                        let h = this.hexBoard.hexList[i];
                        h.setShowVotes(false);
                    }
                    let radius = 0;
                    let entityDetail = entityDetails_1.EntityDetails.instance.details[selectedEntity.entityType];
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
                                        spot.setHighlightColor(hexagonColorUtils_3.HexagonColorUtils.moveHighlightColor);
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
                                    let path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
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
                    let entityDetail = entityDetails_1.EntityDetails.instance.details[gameService_1.GameService.selectedEntity.entityType];
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
                    if (!hex) {
                        gameService_1.GameService.resetSelection();
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
                    this.hexBoard.resetVisibleHexList(this.viewPort);
                }
                getHexAtPoint(clickX, clickY) {
                    let lastClick = null;
                    clickX /= this.viewPort.getScale().x;
                    clickY /= this.viewPort.getScale().y;
                    clickX += this.viewPort.getZoomedX();
                    clickY += this.viewPort.getZoomedY();
                    let hexWidth = gridHexagonConstants_6.GridHexagonConstants.width * 3 / 4;
                    let gridHeight = gridHexagonConstants_6.GridHexagonConstants.height();
                    let hexListLength = this.hexBoard.hexListLength;
                    for (let i = 0; i < hexListLength; i++) {
                        const gridHexagon = this.hexBoard.hexList[i];
                        const x = hexWidth * gridHexagon.x;
                        let z = gridHexagon.z * gridHeight + ((gridHexagon.x % 2 === 1) ? (-gridHeight / 2) : 0);
                        z -= gridHexagon.getDepthHeight(true);
                        z += gridHexagon.y * gridHexagonConstants_6.GridHexagonConstants.depthHeight();
                        let depthHeight = gridHexagon.getDepthHeight(false);
                        let offClickX = clickX - x;
                        let offClickY = clickY - z;
                        if (drawingUtilities_2.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_6.GridHexagonConstants.hexagonTopPolygon())) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_2.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_6.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_2.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_6.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                        else if (drawingUtilities_2.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_6.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight))) {
                            lastClick = gridHexagon;
                        }
                    }
                    console.log(lastClick.x, lastClick.z);
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
                        this.gameManager.viewPort.animateZoom(2, { x: entity.getTile().getScreenX(), y: entity.getTile().getScreenZ() });
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
    var utils_1, gridHexagon_2, gameService_2, GridHexagonConstants, GridMiniHexagonConstants;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (gridHexagon_2_1) {
                gridHexagon_2 = gridHexagon_2_1;
            },
            function (gameService_2_1) {
                gameService_2 = gameService_2_1;
            }
        ],
        execute: function () {
            GridHexagonConstants = class GridHexagonConstants {
                static generate(width) {
                    this.width = width;
                    this.heightSkew = .7;
                    this.depthHeightSkew = .3;
                    this._height = Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
                    this._depthHeight = GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
                    this._topPolygon = GridHexagonConstants.makeHexagonDepthTopPolygon();
                    this._leftPolygon = [];
                    this._bottomPolygon = [];
                    this._rightPolygon = [];
                    for (let i = 0; i <= 16; i++) {
                        this._rightPolygon.push(GridHexagonConstants.makeHexagonDepthRightPolygon(i));
                        this._bottomPolygon.push(GridHexagonConstants.makeHexagonDepthBottomPolygon(i));
                        this._leftPolygon.push(GridHexagonConstants.makeHexagonDepthLeftPolygon(i));
                    }
                    gridHexagon_2.GridHexagon.generateHexCenters();
                    if (gameService_2.GameService.getGameManager() && gameService_2.GameService.getGameManager().hexBoard && gameService_2.GameService.getGameManager().hexBoard.hexList) {
                        let hexList = gameService_2.GameService.getGameManager().hexBoard.hexList;
                        for (let i = 0; i < hexList.length; i++) {
                            let hex = hexList[i];
                            hex.buildPaths();
                        }
                    }
                }
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
                    return this._leftPolygon[depthHeight | 0];
                }
                ;
                static hexagonDepthBottomPolygon(depthHeight) {
                    return this._bottomPolygon[depthHeight | 0];
                }
                ;
                static hexagonDepthRightPolygon(depthHeight) {
                    return this._rightPolygon[depthHeight | 0];
                }
                ;
                static makeHexagonDepthLeftPolygon(depthHeight) {
                    return [
                        new utils_1.Point(-this.width / 2, 0),
                        new utils_1.Point(-this.width / 4, this.height() / 2),
                        new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 2, depthHeight),
                        new utils_1.Point(-this.width / 2, 0)
                    ];
                }
                ;
                static makeHexagonDepthTopPolygon() {
                    return [
                        new utils_1.Point(-GridHexagonConstants.width / 2, 0),
                        new utils_1.Point(-GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
                        new utils_1.Point(GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
                        new utils_1.Point(GridHexagonConstants.width / 2, 0),
                        new utils_1.Point(GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
                        new utils_1.Point(-GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
                        new utils_1.Point(-GridHexagonConstants.width / 2, 0)
                    ];
                }
                ;
                static makeHexagonDepthBottomPolygon(depthHeight) {
                    return [new utils_1.Point(-this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2 + depthHeight),
                        new utils_1.Point(-this.width / 4, this.height() / 2)];
                }
                ;
                static makeHexagonDepthRightPolygon(depthHeight) {
                    return [
                        new utils_1.Point(this.width / 4, this.height() / 2),
                        new utils_1.Point(this.width / 2, 0),
                        new utils_1.Point(this.width / 2, depthHeight),
                        new utils_1.Point(this.width / 4, depthHeight + this.height() / 2),
                        new utils_1.Point(this.width / 4, this.height() / 2)
                    ];
                }
                ;
            };
            exports_27("GridHexagonConstants", GridHexagonConstants);
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
            exports_27("GridMiniHexagonConstants", GridMiniHexagonConstants);
        }
    };
});
///<reference path="../typings/path2d.d.ts"/>
System.register("game/gridHexagon", ["utils/drawingUtilities", "game/gridHexagonConstants", "utils/hexagonColorUtils", "ui/gameService"], function (exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var drawingUtilities_3, gridHexagonConstants_7, hexagonColorUtils_4, gameService_3, GridHexagon;
    return {
        setters: [
            function (drawingUtilities_3_1) {
                drawingUtilities_3 = drawingUtilities_3_1;
            },
            function (gridHexagonConstants_7_1) {
                gridHexagonConstants_7 = gridHexagonConstants_7_1;
            },
            function (hexagonColorUtils_4_1) {
                hexagonColorUtils_4 = hexagonColorUtils_4_1;
            },
            function (gameService_3_1) {
                gameService_3 = gameService_3_1;
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
                    return this._realX = (gridHexagonConstants_7.GridHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealZ() {
                    if (this._realZ !== undefined) {
                        return this._realZ;
                    }
                    let height = gridHexagonConstants_7.GridHexagonConstants.height();
                    return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0))
                        - this.getDepthHeight(true)
                        + this.y * gridHexagonConstants_7.GridHexagonConstants.depthHeight();
                }
                getScreenX() {
                    return this.getRealX() - gameService_3.GameService.getGameManager().viewPort.getX();
                }
                getScreenZ() {
                    return this.getRealZ() - gameService_3.GameService.getGameManager().viewPort.getY();
                }
                getRealMiniX() {
                    return (gridHexagonConstants_7.GridMiniHexagonConstants.width * 3 / 4 * this.x);
                }
                getRealMiniZ() {
                    let height = gridHexagonConstants_7.GridMiniHexagonConstants.height();
                    return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0)) + this.y * 0;
                }
                getDepthHeight(position) {
                    if (position)
                        return Math.max(1, (this.height + this.heightOffset) * (gridHexagonConstants_7.GridHexagonConstants.depthHeight() - 2));
                    return gridHexagonConstants_7.GridHexagonConstants.depthHeight();
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
                    this._realX = undefined;
                    this._realZ = undefined;
                    const depthHeight = this.getDepthHeight(false);
                    this.topPath = GridHexagon.buildPath(gridHexagonConstants_7.GridHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                    this.leftDepthPath = GridHexagon.buildPath(gridHexagonConstants_7.GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
                    this.bottomDepthPath = GridHexagon.buildPath(gridHexagonConstants_7.GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
                    this.rightDepthPath = GridHexagon.buildPath(gridHexagonConstants_7.GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
                }
                buildMiniPaths() {
                    this.topMiniPath = GridHexagon.buildPath(gridHexagonConstants_7.GridMiniHexagonConstants.hexagonTopPolygon());
                    // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
                }
                invalidateColor() {
                    let entityColor = (this.entities.length > 0 && hexagonColorUtils_4.HexagonColorUtils.entityHexColor);
                    let voteColor = this.voteColor;
                    let secondaryVoteColor = this.secondaryVoteColor;
                    let highlightColor = this.highlightColor;
                    let factionColor = (this.faction > 0 && hexagonColorUtils_4.HexagonColorUtils.factionHexColors[this.faction - 1][this.height]);
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
                        context.fillRect(-gridHexagonConstants_7.GridHexagonConstants.width / 2, -gridHexagonConstants_7.GridHexagonConstants.height() / 2, gridHexagonConstants_7.GridHexagonConstants.width * 2, gridHexagonConstants_7.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_3.DrawingUtils.makeTransparent(color.dark1, .75);
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
                        context.fillRect(-gridHexagonConstants_7.GridHexagonConstants.width / 2, -gridHexagonConstants_7.GridHexagonConstants.height() / 2, gridHexagonConstants_7.GridHexagonConstants.width * 2, gridHexagonConstants_7.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_3.DrawingUtils.makeTransparent(color.dark2, .75);
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
                        context.fillRect(-gridHexagonConstants_7.GridHexagonConstants.width / 2, -gridHexagonConstants_7.GridHexagonConstants.height() / 2, gridHexagonConstants_7.GridHexagonConstants.width * 2, gridHexagonConstants_7.GridHexagonConstants.height() * 2); // context.fillRect(x, y, width, height);
                        context.fillStyle = drawingUtilities_3.DrawingUtils.makeTransparent(color.dark3, .75);
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
                            context.fillRect(-gridHexagonConstants_7.GridHexagonConstants.width / 2, -gridHexagonConstants_7.GridHexagonConstants.height() / 2, gridHexagonConstants_7.GridHexagonConstants.width, gridHexagonConstants_7.GridHexagonConstants.height()); // context.fillRect(x, y, width, height);
                            context.fillStyle = drawingUtilities_3.DrawingUtils.makeTransparent(color.color, 0.6);
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
                    size.width = gridHexagonConstants_7.GridHexagonConstants.width;
                    size.height = gridHexagonConstants_7.GridHexagonConstants.height();
                    size.height += this.getDepthHeight(false);
                    size.width += 12;
                    size.height += 6;
                    return size;
                }
                envelopeMini() {
                    const size = { width: 0, height: 0 };
                    size.width = gridHexagonConstants_7.GridMiniHexagonConstants.width;
                    size.height = gridHexagonConstants_7.GridMiniHexagonConstants.height();
                    size.width += 20;
                    size.height += 20;
                    return size;
                }
                static generateHexCenters() {
                    this.hexCenter = { x: (gridHexagonConstants_7.GridHexagonConstants.width / 2 + 6), y: (gridHexagonConstants_7.GridHexagonConstants.height() / 2 + 6) };
                    this.hexCenterMini = {
                        x: (gridHexagonConstants_7.GridMiniHexagonConstants.width / 2 + 6),
                        y: (gridHexagonConstants_7.GridMiniHexagonConstants.height() / 2 + 6)
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
            exports_30("PageManager", PageManager);
        }
    };
});
System.register("ui/gameController", ["react", "ui/gameService", "entities/entityDetails"], function (exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var react_1, gameService_4, entityDetails_2, GameUI;
    return {
        setters: [
            function (react_1_1) {
                react_1 = react_1_1;
            },
            function (gameService_4_1) {
                gameService_4 = gameService_4_1;
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
                    gameService_4.GameService.onSetSelectedEntity = (entity) => {
                        if (entity) {
                            let detail = entityDetails_2.EntityDetails.instance.details[entity.entityType];
                            this.setState({
                                canSpawn: detail.spawnRadius > 0,
                                canAttack: detail.attackRadius > 0,
                                canMove: detail.moveRadius > 0,
                                selectedAction: gameService_4.GameService.selectedAction,
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
                    gameService_4.GameService.hasData = () => {
                        this.setState({
                            loading: false
                        });
                    };
                    gameService_4.GameService.setSecondsToNextGeneration = (seconds) => {
                        secondsTick = 100 / (10 * gameService_4.GameService.secondsPerGeneration);
                        this.setState({
                            timerPercent: Math.min(100 - (seconds / gameService_4.GameService.secondsPerGeneration * 100), 100)
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
                    gameService_4.GameService.selectedAction = action;
                    setTimeout(() => {
                        gameService_4.GameService.getGameManager().startAction();
                    }, 0);
                }
                render() {
                    return (react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: "game-ui", style: { display: this.state.loading ? 'none' : 'block' } },
                            react_1.default.createElement("div", { className: "countdown-container" },
                                react_1.default.createElement("div", { className: `countdown-container-ticker ${this.state.timerPercent >= 96 && 'countdown-frozen'}`, style: { width: `${this.state.timerPercent}%` } })),
                            react_1.default.createElement("div", { className: "center" }, this.state.selectedEntity &&
                                react_1.default.createElement("div", { style: { height: '100%' } },
                                    react_1.default.createElement("img", { src: `/images/${this.state.selectedEntity.entityType}/up_1.png`, style: { float: 'left', width: '6vw', height: '6vh', 'margin-left': '10px', 'margin-top': '10px' } }),
                                    react_1.default.createElement("div", { style: { float: 'left', 'margin-left': '20px' } },
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
System.register("main", ["react", "react-dom", "game/assetManager", "pageManager", "game/gridHexagonConstants", "ui/gameController"], function (exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var react_2, react_dom_1, assetManager_4, pageManager_1, gridHexagonConstants_8, gameController_1, Main;
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
            function (gridHexagonConstants_8_1) {
                gridHexagonConstants_8 = gridHexagonConstants_8_1;
            },
            function (gameController_1_1) {
                gameController_1 = gameController_1_1;
            }
        ],
        execute: function () {
            Main = class Main {
                static run() {
                    gridHexagonConstants_8.GridHexagonConstants.generate(60);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tcG9uZW50cy91dGlscy91dGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9hc3NldE1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvbWVudU1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2RyYXdpbmdVdGlsaXRpZXMudHMiLCIuLi9jb21wb25lbnRzL21vZGVscy9oZXhCb2FyZC50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvY29sb3IudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2hlbHAudHMiLCIuLi9jb21wb25lbnRzL2FuaW1hdGlvbk1hbmFnZXIudHMiLCIuLi9jb21wb25lbnRzL3V0aWxzL2hleGFnb25Db2xvclV0aWxzLnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9iYXNlRW50aXR5LnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9lbnRpdHlNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91dGlscy9hbmltYXRpb25VdGlscy50cyIsIi4uL2NvbXBvbmVudHMvdXRpbHMvZGVib3VuY2VVdGlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS92aWV3UG9ydC50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvc3RhdGlvbmFyeUVudGl0eS50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvbWFpbkJhc2VFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL3JlZ3VsYXJCYXNlRW50aXR5LnRzIiwiLi4vY29tcG9uZW50cy9lbnRpdGllcy9zaXhEaXJlY3Rpb25FbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL2hlbGlFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL2luZmFudHlFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2VudGl0aWVzL3RhbmtFbnRpdHkudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvaGV4Qm9hcmQudHMiLCIuLi9jb21wb25lbnRzL2RhdGFTZXJ2aWNlcy50cyIsIi4uL2NvbXBvbmVudHMvZW50aXRpZXMvZW50aXR5RGV0YWlscy50cyIsIi4uL2NvbXBvbmVudHMvZ2FtZS9nYW1lTWFuYWdlci50cyIsIi4uL2NvbXBvbmVudHMvdWkvZ2FtZVNlcnZpY2UudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvZ3JpZEhleGFnb25Db25zdGFudHMudHMiLCIuLi9jb21wb25lbnRzL2dhbWUvZ3JpZEhleGFnb24udHMiLCIuLi9jb21wb25lbnRzL2dhbWUvaGV4VXRpbHMudHMiLCIuLi9jb21wb25lbnRzL3BhZ2VNYW5hZ2VyLnRzIiwiLi4vY29tcG9uZW50cy91aS9nYW1lQ29udHJvbGxlci50c3giLCIuLi9jb21wb25lbnRzL21haW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7WUFBQSxRQUFBO2dCQUlJLElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVELElBQVcsQ0FBQztvQkFDUixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBRUQsSUFBVyxDQUFDLENBQUMsR0FBVztvQkFDcEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBVTtvQkFDM0IsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELFlBQVksQ0FBUyxFQUFFLENBQVM7b0JBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29C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QUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbkQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNyQyxHQUFHLENBQUM7Z0NBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzNCLENBQUMsUUFDTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFDM0IsS0FBSyxHQUFHLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzRCQUMzQixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3JCLENBQUM7d0JBQ0QsSUFBSSxDQUFDLENBQUM7NEJBQ0YsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7NEJBQ3JDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUMzQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FBQyxRQUFRLENBQUM7Z0NBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0NB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QUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDM0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUNuRCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQzt3QkFFL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3dCQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDL0MsQ0FBQztvQkFDRCxNQUFNLENBQUMsU0FB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LElBQUksTUFBcUIsQ0FBQztvQkFDMUIsSUFBSSxTQUF1QyxDQUFDO29CQUc1QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyQixNQUFNLEdBQUcsTUFBTSxDQUFDO3dCQUNwQixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyQixNQUFNLEdBQUcsSUFBSSxDQUFDO3dCQUNsQixDQUFDO29CQUNMLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3QkFDcEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckIsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3QkFDcEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDckIsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDbEIsQ0FBQztvQkFDTCxDQUFDO29CQUdELEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFB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