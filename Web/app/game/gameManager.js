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
var drawingUtilities_1 = require("../utils/drawingUtilities");
var hexUtils_1 = require("./hexUtils");
var hexBoard_1 = require("./hexBoard");
var dataServices_1 = require("../dataServices");
var animationManager_1 = require("../animationManager");
var gridHexagonConstants_1 = require("./gridHexagonConstants");
var hexagonColorUtils_1 = require("../utils/hexagonColorUtils");
var gameService_1 = require("../ui/gameService");
var debounceUtils_1 = require("../utils/debounceUtils");
var viewPort_1 = require("./viewPort");
var entityDetails_1 = require("../entities/entityDetails");
var GameManager = (function () {
    function GameManager(pageManager) {
        this.pageManager = pageManager;
        this.viewPort = new viewPort_1.ViewPort();
        gameService_1.GameService.setGameManager(this);
    }
    GameManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, lx, ly;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hexagonColorUtils_1.HexagonColorUtils.setupColors();
                        this.hexBoard = new hexBoard_1.HexBoard();
                        this.animationManager = new animationManager_1.AnimationManager(this.hexBoard);
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
        mc.on('panstart', function () {
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
        var hexListLength = this.hexBoard.hexListLength;
        for (var i = 0; i < hexListLength; i++) {
            var gridHexagon = this.hexBoard.hexList[i];
            var x = gridHexagonConstants_1.GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
            var z = gridHexagon.z * gridHexagonConstants_1.GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-gridHexagonConstants_1.GridMiniHexagonConstants.height() / 2) : 0);
            if (drawingUtilities_1.DrawingUtils.pointInPolygon(clickX - x, clickY - z, gridHexagonConstants_1.GridMiniHexagonConstants.hexagonTopPolygon())) {
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
        var hexListLength = this.hexBoard.hexListLength;
        for (var i = 0; i < hexListLength; i++) {
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
        this.viewPort.offset(context);
        this.hexBoard.drawBoard(context, this.viewPort);
        context.restore();
        /*        context.save();
         context.strokeStyle='white';
         context.lineWidth=3;
         context.strokeRect(0, 0, this.viewPort.getWidth() / 2, this.viewPort.getHeight() / 2)
         context.restore();*/
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
            var metrics, seconds, i, ent, result, hexListLength, i, hex, i, vote, action, entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log('got state',+new Date());
                        if (this.cantAct()) {
                            debounceUtils_1.DebounceUtils.debounce("checkState", 1000 * 5, function () { return _this.checkState(); });
                            return [2 /*return*/];
                        }
                        this.checking = true;
                        return [4 /*yield*/, dataServices_1.DataService.getGameMetrics()];
                    case 1:
                        metrics = _a.sent();
                        if (!metrics) {
                            this.checking = false;
                            debounceUtils_1.DebounceUtils.debounce("checkState", 1000 * 5, function () { return _this.checkState(); });
                            return [2 /*return*/];
                        }
                        seconds = (+metrics.nextGenerationDate - +new Date()) / 1000;
                        gameService_1.GameService.setSecondsToNextGeneration(seconds);
                        for (i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
                            ent = this.hexBoard.entityManager.entities[i];
                            ent.resetVotes();
                        }
                        if (!(this.hexBoard.generation != metrics.generation)) return [3 /*break*/, 3];
                        console.log("Gen - old: " + this.hexBoard.generation + " new " + metrics.generation);
                        return [4 /*yield*/, dataServices_1.DataService.getGenerationResult(this.hexBoard.generation)];
                    case 2:
                        result = _a.sent();
                        gameService_1.GameService.resetSelection();
                        hexListLength = this.hexBoard.hexListLength;
                        for (i = 0; i < hexListLength; i++) {
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
                                return _this.checkState();
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
                        debounceUtils_1.DebounceUtils.debounce("checkState", 1000 * (seconds > 5 ? 5 : Math.max(seconds, .5)), function () {
                            _this.checkState();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameManager.prototype.startAction = function () {
        this.resetBoardColors();
        var entities = this.hexBoard.entityManager.getEntitiesAtTile(gameService_1.GameService.selectedHex);
        var selectedEntity = entities[0];
        if (!selectedEntity) {
            gameService_1.GameService.resetSelection();
            return false;
        }
        var hexListLength = this.hexBoard.hexListLength;
        for (var i = 0; i < hexListLength; i++) {
            var h = this.hexBoard.hexList[i];
            h.setShowVotes(false);
        }
        var radius = 0;
        var entityDetail = entityDetails_1.EntityDetails.instance.details[selectedEntity.entityType];
        if (!gameService_1.GameService.selectedAction) {
            gameService_1.GameService.selectedAction = entityDetail.defaultAction;
        }
        gameService_1.GameService.setSelectedEntity(selectedEntity);
        var selectedAction = gameService_1.GameService.selectedAction;
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
        var spots = this.findAvailableSpots(radius, gameService_1.GameService.selectedHex);
        gameService_1.GameService.selectedHex.setShowVotes(true);
        for (var i = 0; i < spots.length; i++) {
            var spot = spots[i];
            if (spot == gameService_1.GameService.selectedHex)
                continue;
            var entities_1 = this.hexBoard.entityManager.getEntitiesAtTile(spot);
            switch (selectedAction) {
                case "move":
                    {
                        if (entities_1.length > 0)
                            continue;
                        var path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            spot.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.moveHighlightColor);
                            spot.setShowVotes(true);
                            selectedEntity.setSecondaryVoteColor(spot);
                        }
                    }
                    break;
                case "attack":
                    {
                        if (entities_1[0] && entities_1[0].faction == gameService_1.GameService.selectedEntity.faction)
                            continue;
                        var path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            if (entities_1.length == 0) {
                                spot.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.moveHighlightColor);
                                spot.setShowVotes(true);
                                selectedEntity.setSecondaryVoteColor(spot);
                            }
                            else {
                                spot.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.attackHighlightColor);
                                spot.setShowVotes(true);
                                selectedEntity.setSecondaryVoteColor(spot);
                            }
                        }
                    }
                    break;
                case "spawn":
                    {
                        if (entities_1.length > 0)
                            continue;
                        var path = this.hexBoard.pathFind(gameService_1.GameService.selectedHex, spot);
                        if (path.length > 1 && path.length <= radius + 1) {
                            spot.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.spawnHighlightColor);
                            spot.setShowVotes(true);
                            selectedEntity.setSecondaryVoteColor(spot);
                            // spot.setHeightOffset(.25);
                        }
                    }
                    break;
            }
        }
        return true;
    };
    GameManager.prototype.processAction = function (hex) {
        return __awaiter(this, void 0, void 0, function () {
            var entityDetail, distance, radius, entities, entities, entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entityDetail = entityDetails_1.EntityDetails.instance.details[gameService_1.GameService.selectedEntity.entityType];
                        this.resetBoardColors();
                        distance = hexUtils_1.HexUtils.distance(gameService_1.GameService.selectedHex, hex);
                        if (distance == 0) {
                            gameService_1.GameService.resetSelection();
                            return [2 /*return*/];
                        }
                        radius = 0;
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
                            return [2 /*return*/];
                        }
                        switch (gameService_1.GameService.selectedAction) {
                            case "move":
                                {
                                    entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                    if (entities.length > 0) {
                                        gameService_1.GameService.selectedHex = hex;
                                        gameService_1.GameService.setSelectedEntity(null);
                                        this.startAction();
                                        return [2 /*return*/];
                                    }
                                }
                                break;
                            case "attack":
                                {
                                    entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                    if (entities.length == 0) {
                                        gameService_1.GameService.selectedHex = hex;
                                        gameService_1.GameService.setSelectedEntity(null);
                                        this.startAction();
                                        return [2 /*return*/];
                                    }
                                }
                                break;
                            case "spawn":
                                {
                                    entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                                    if (entities.length > 0) {
                                        gameService_1.GameService.selectedHex = hex;
                                        gameService_1.GameService.setSelectedEntity(null);
                                        this.startAction();
                                        return [2 /*return*/];
                                    }
                                }
                                break;
                        }
                        return [4 /*yield*/, this.vote(gameService_1.GameService.selectedEntity, gameService_1.GameService.selectedAction, hex.x, hex.z)];
                    case 1:
                        _a.sent();
                        gameService_1.GameService.resetSelection();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameManager.prototype.findAvailableSpots = function (radius, center) {
        var items = [];
        var hexListLength = this.hexBoard.hexListLength;
        for (var q = 0; q < hexListLength; q++) {
            var item = this.hexBoard.hexList[q];
            if (hexUtils_1.HexUtils.distance(center, item) <= radius) {
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
                            if (hexUtils_1.HexUtils.distance({ x: px, z: pz }, { x: tile.x, z: tile.z }) <= 5) {
                                break;
                            }
                        }
                        return [4 /*yield*/, this.vote(ent, 'move', px, pz)];
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
                        if (!result) return [3 /*break*/, 4];
                        if (!result.generationMismatch) return [3 /*break*/, 3];
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
            var hex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.cantAct()) {
                            return [2 /*return*/];
                        }
                        hex = this.getHexAtPoint(x, y);
                        /*    if(hex.highlightColor!=null){
                         hex.clearHighlightColor();
                         }else{
                         hex.setHighlightColor(HexagonColorUtils.voteColor[4]);
                         }*/
                        if (!hex) {
                            gameService_1.GameService.resetSelection();
                            return [2 /*return*/];
                        }
                        if (!!gameService_1.GameService.selectedHex) return [3 /*break*/, 1];
                        gameService_1.GameService.selectedHex = hex;
                        this.startAction();
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.processAction(hex)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameManager.prototype.resize = function (width, height) {
        this.viewPort.setSize(width, height);
        this.constrainViewPort();
    };
    GameManager.prototype.offsetView = function (x, y) {
        this.setView(this.viewPort.getX() + x, this.viewPort.getY() + y);
    };
    GameManager.prototype.setView = function (x, y) {
        this.viewPort.setPosition(x, y);
        this.constrainViewPort();
        this.viewPort.setLocalStorage();
    };
    GameManager.prototype.constrainViewPort = function () {
        this.viewPort.constrainViewPort(this.hexBoard.gameDimensions());
        this.hexBoard.resetVisibleHexList();
    };
    GameManager.prototype.getHexAtPoint = function (clickX, clickY) {
        var lastClick = null;
        clickX /= this.viewPort.getScale().x;
        clickY /= this.viewPort.getScale().y;
        clickX += this.viewPort.getZoomedX();
        clickY += this.viewPort.getZoomedY();
        var hexWidth = gridHexagonConstants_1.GridHexagonConstants.width * 3 / 4;
        var gridHeight = gridHexagonConstants_1.GridHexagonConstants.height();
        var hexListLength = this.hexBoard.hexListLength;
        for (var i = 0; i < hexListLength; i++) {
            var gridHexagon = this.hexBoard.hexList[i];
            var x = hexWidth * gridHexagon.x;
            var z = gridHexagon.z * gridHeight + ((gridHexagon.x % 2 === 1) ? (-gridHeight / 2) : 0);
            var offClickX = clickX - x;
            var offClickY = clickY - z;
            if (drawingUtilities_1.DrawingUtils.pointInPolygon(offClickX, offClickY, gridHexagonConstants_1.GridHexagonConstants.hexagonTopPolygon())) {
                lastClick = gridHexagon;
            }
        }
        return lastClick;
    };
    GameManager.prototype.centerOnHex = function (gridHexagon) {
        var x = gridHexagon.getRealX();
        var y = gridHexagon.getRealZ();
        this.setView(x - this.viewPort.getWidth() / 2, y - this.viewPort.getHeight() / 2);
    };
    GameManager.prototype.resetBoardColors = function () {
        var length = this.hexBoard.hexListLength;
        for (var i = 0; i < length; i++) {
            var h = this.hexBoard.hexList[i];
            h.clearHighlightColor();
            h.clearSecondaryVoteColor();
            h.setShowVotes(true);
        }
    };
    return GameManager;
}());
exports.GameManager = GameManager;
