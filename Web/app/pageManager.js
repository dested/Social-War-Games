"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var menuManager_1 = require("./game/menuManager");
var hexUtils_1 = require("./game/hexUtils");
var gameManager_1 = require("./game/gameManager");
var hexagonColorUtils_1 = require("./utils/hexagonColorUtils");
var PageManager = (function () {
    function PageManager() {
        this.swipeVelocity = { x: 0, y: 0 };
        this.tapStart = { x: 0, y: 0 };
        document.onkeydown = function (e) {
            if (e.key == 'a') {
                // this.gameManager.viewPort.animateZoom(1.5,this.gameManager.selectedTile);
            }
        };
    }
    PageManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var menu, overlay, mc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gameManager = new gameManager_1.GameManager(this);
                        return [4 /*yield*/, this.gameManager.init()];
                    case 1:
                        _a.sent();
                        this.fpsMeter = new window.FPSMeter(document.body, {
                            right: '5px',
                            left: 'auto',
                            heat: 1
                        });
                        hexagonColorUtils_1.HexagonColorUtils.setupColors();
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
                            _this.tapStart.x = _this.gameManager.viewPort.getX();
                            _this.tapStart.y = _this.gameManager.viewPort.getY();
                            var scaleFactor = _this.gameManager.viewPort.getScale();
                            _this.gameManager.setView(_this.tapStart.x - ev.deltaX / scaleFactor.x, _this.tapStart.y - ev.deltaY / scaleFactor.y);
                            return true;
                        });
                        mc.on('panmove', function (ev) {
                            if (_this.menuManager.isOpen) {
                                return false;
                            }
                            var scaleFactor = _this.gameManager.viewPort.getScale();
                            _this.gameManager.setView(_this.tapStart.x - ev.deltaX / scaleFactor.x, _this.tapStart.y - ev.deltaY / scaleFactor.y);
                        });
                        mc.on('swipe', function (ev) {
                            if (_this.menuManager.isOpen) {
                                return false;
                            }
                            _this.menuManager.closeMenu();
                            var scaleFactor = _this.gameManager.viewPort.getScale();
                            _this.swipeVelocity.x = ev.velocityX * 10 / scaleFactor.x;
                            _this.swipeVelocity.y = ev.velocityY * 10 / scaleFactor.y;
                        });
                        mc.on('tap', function (ev) {
                            var x = ev.center.x;
                            var y = ev.center.y;
                            _this.swipeVelocity.x = _this.swipeVelocity.y = 0;
                            if (!_this.menuManager.tap(x, y)) {
                                _this.gameManager.tapHex(x, y);
                            }
                        });
                        this.draw();
                        return [2 /*return*/];
                }
            });
        });
    };
    PageManager.prototype.draw = function () {
        var _this = this;
        this.tick();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameManager.draw(this.context);
        this.menuManager.draw();
        this.fpsMeter.tick();
        requestAnimationFrame(function () {
            _this.draw();
        });
    };
    PageManager.prototype.tick = function () {
        if (Math.abs(this.swipeVelocity.x) > 0) {
            var sign = hexUtils_1.HexUtils.mathSign(this.swipeVelocity.x);
            this.swipeVelocity.x += 0.7 * -sign;
            if (hexUtils_1.HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                this.swipeVelocity.x = 0;
            }
        }
        if (Math.abs(this.swipeVelocity.y) > 0) {
            var sign = hexUtils_1.HexUtils.mathSign(this.swipeVelocity.y);
            this.swipeVelocity.y += 0.7 * -sign;
            if (hexUtils_1.HexUtils.mathSign(this.swipeVelocity.y) != sign) {
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
    };
    return PageManager;
}());
exports.PageManager = PageManager;
