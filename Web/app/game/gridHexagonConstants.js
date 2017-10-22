"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/utils");
var gridHexagon_1 = require("./gridHexagon");
var gameService_1 = require("../ui/gameService");
var GridHexagonConstants = (function () {
    function GridHexagonConstants() {
    }
    GridHexagonConstants.generate = function (width) {
        this.width = width;
        this.heightSkew = .7;
        this._height = Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
        this._topPolygon = GridHexagonConstants.makeHexagonDepthTopPolygon();
        gridHexagon_1.GridHexagon.generateHexCenters();
        if (gameService_1.GameService.getGameManager() && gameService_1.GameService.getGameManager().hexBoard && gameService_1.GameService.getGameManager().hexBoard.hexList) {
            var hexList = gameService_1.GameService.getGameManager().hexBoard.hexList;
            for (var i = 0; i < hexList.length; i++) {
                var hex = hexList[i];
                hex.buildPaths();
            }
        }
    };
    GridHexagonConstants.height = function () {
        return this._height;
    };
    GridHexagonConstants.hexagonTopPolygon = function () {
        return this._topPolygon;
    };
    ;
    GridHexagonConstants.makeHexagonDepthTopPolygon = function () {
        var halfWidth = GridHexagonConstants.width / 2;
        var quarterWidth = GridHexagonConstants.width / 4;
        var halfHeight = GridHexagonConstants._height / 2;
        return [
            new utils_1.Point((-halfWidth), 0),
            new utils_1.Point((-quarterWidth), (-halfHeight)),
            new utils_1.Point((quarterWidth), (-halfHeight)),
            new utils_1.Point((halfWidth), 0),
            new utils_1.Point((quarterWidth), (halfHeight)),
            new utils_1.Point((-quarterWidth), (halfHeight)),
            new utils_1.Point((-halfWidth), 0)
        ];
    };
    ;
    return GridHexagonConstants;
}());
exports.GridHexagonConstants = GridHexagonConstants;
var GridMiniHexagonConstants = (function () {
    function GridMiniHexagonConstants() {
    }
    GridMiniHexagonConstants.height = function () {
        return Math.ceil(Math.sqrt(3) / 2 * this.width * this.heightSkew);
    };
    GridMiniHexagonConstants.hexagonTopPolygon = function () {
        var halfWidth = this.width / 2;
        var quarterWidth = this.width / 4;
        var halfHeight = this.height() / 2;
        var offset = .7;
        var floor = function (_x) { return Math.floor(_x - offset); };
        var ceil = function (_x) { return Math.ceil(_x + offset); };
        return [
            new utils_1.Point(floor(-halfWidth), 0),
            new utils_1.Point(floor(-quarterWidth), floor(-halfHeight)),
            new utils_1.Point(ceil(quarterWidth), floor(-halfHeight)),
            new utils_1.Point(ceil(halfWidth), 0),
            new utils_1.Point(ceil(quarterWidth), ceil(halfHeight)),
            new utils_1.Point(floor(-quarterWidth), ceil(halfHeight)),
            new utils_1.Point(floor(-halfWidth), 0)
        ];
    };
    ;
    GridMiniHexagonConstants.width = 10;
    GridMiniHexagonConstants.heightSkew = 0.7;
    return GridMiniHexagonConstants;
}());
exports.GridMiniHexagonConstants = GridMiniHexagonConstants;
