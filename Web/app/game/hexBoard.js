"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gridHexagonConstants_1 = require(".//gridHexagonConstants");
var gridHexagon_1 = require("./gridHexagon");
var entityManager_1 = require("../entities/entityManager");
var hexUtils_1 = require("./hexUtils");
var assetManager_1 = require("./assetManager");
var hexagonColorUtils_1 = require("../utils/hexagonColorUtils");
var mainBaseEntity_1 = require("../entities/mainBaseEntity");
var regularBaseEntity_1 = require("../entities/regularBaseEntity");
var heliEntity_1 = require("../entities/heliEntity");
var infantyEntity_1 = require("../entities/infantyEntity");
var tankEntity_1 = require("../entities/tankEntity");
var gameService_1 = require("../ui/gameService");
var HexBoard = (function () {
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
        size.width = gridHexagonConstants_1.GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = gridHexagonConstants_1.GridHexagonConstants.height() * this.boardSize.height;
        return size;
    };
    HexBoard.prototype.gameDimensionsMini = function () {
        var size = { width: 0, height: 0 };
        size.width = gridHexagonConstants_1.GridMiniHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = gridHexagonConstants_1.GridMiniHexagonConstants.height() * this.boardSize.height;
        return size;
    };
    HexBoard.prototype.addHexagon = function (hexagon) {
        this.hexList.push(hexagon);
        this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
    };
    HexBoard.prototype.reorderHexList = function () {
        this.hexList = hexUtils_1.HexUtils.orderBy(this.hexList, function (m) { return (m.z) * 1000 + (m.x % 2) * -200; });
        // this.hexList = HexUtils.orderBy(this.hexList, m => (m.z) * 1000 + (m.x % 2) * -200 + m.height);
    };
    HexBoard.prototype.getHexAtSpot = function (x, z) {
        return this.hexBlock[x + z * 5000];
    };
    HexBoard.prototype.getHexAtSpotDirection = function (x, z, direction) {
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
                    /*
                     if (Math.abs((node.item.height) - (n.height)) >= 2)
                     continue;
                     */
                    path = new hexUtils_1.Node(node, n);
                    if (!aStar[path.value()]) {
                        path.g = node.g + hexUtils_1.HexUtils.distance(n, node.item) /*+ (Math.abs((node.item.height) - (n.height)) * 2)*/;
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
        var stoneTop = assetManager_1.AssetManager.getAsset('Stone.Top');
        var grassTop = assetManager_1.AssetManager.getAsset('Grass.Top');
        var waterTop = assetManager_1.AssetManager.getAsset('Water.Top');
        var ys = str.split('|');
        for (var z = 0; z < terrain.height; z++) {
            var yItem = ys[z].split('');
            for (var x = 0; x < terrain.width; x++) {
                var tileType = parseInt(yItem[x]);
                var gridHexagon = new gridHexagon_1.GridHexagon();
                gridHexagon.x = x;
                gridHexagon.z = z;
                gridHexagon.tileType = tileType;
                if (tileType == 0) {
                    gridHexagon.setTexture(waterTop);
                }
                else if (tileType > 0 && tileType < 3) {
                    gridHexagon.setTexture(grassTop);
                }
                else {
                    gridHexagon.setTexture(stoneTop);
                }
                gridHexagon.setBaseColor(hexagonColorUtils_1.HexagonColorUtils.baseColors);
                gridHexagon.buildPaths();
                gridHexagon.buildMiniPaths();
                this.addHexagon(gridHexagon);
            }
        }
        this.hexListLength = this.hexList.length;
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
        for (var i = 0; i < state.entities.length; i++) {
            var stateEntity = state.entities[i];
            var entity = this.entityManager.getEntityById(stateEntity.id);
            var gridHexagon = this.getHexAtSpot(stateEntity.x, stateEntity.z);
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
        for (var i = this.entityManager.entities.length - 1; i >= 0; i--) {
            var entity = this.entityManager.entities[i];
            if (!entity.stillAlive) {
                this.entityManager.killEntity(entity);
            }
            else {
                entity.stillAlive = false;
            }
        }
        this.resetVisibleHexList();
    };
    HexBoard.prototype.drawBoard = function (context, viewPort) {
        context.lineWidth = 1;
        var vx = viewPort.getX();
        var vy = viewPort.getY();
        var vw = viewPort.getWidth();
        var vh = viewPort.getHeight();
        // context.drawImage(this.hexListCanvas.canvas, vx, vy, vw, vh, vx, vy, vw, vh);
        for (var j = 0; j < this.visibleHexListMap.length; j++) {
            var gridHexagon = this.visibleHexListMap[j];
            gridHexagon.draw(context, gridHexagon.getRealX(), gridHexagon.getRealZ());
        }
        var entList = this.visibleEntityMap;
        for (var j = 0; j < entList.length; j++) {
            entList[j].draw(context);
        }
    };
    HexBoard.prototype.resetVisibleHexList = function () {
        var viewPort = gameService_1.GameService.getGameManager().viewPort;
        var visibleHexList = [];
        var visibleEntity = [];
        for (var i = 0; i < this.hexList.length; i++) {
            var gridHexagon = this.hexList[i];
            if (gridHexagon.shouldDraw(viewPort)) {
                visibleHexList.push(gridHexagon);
                var entities = this.entityManager.getEntitiesAtTile(gridHexagon);
                if (entities.length) {
                    for (var c = 0; c < entities.length; c++) {
                        visibleEntity.push(entities[c]);
                    }
                }
            }
        }
        this.visibleHexListMap = visibleHexList;
        this.visibleEntityMap = visibleEntity;
    };
    return HexBoard;
}());
exports.HexBoard = HexBoard;
