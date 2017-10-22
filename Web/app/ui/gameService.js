"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameService = (function () {
    function GameService() {
    }
    Object.defineProperty(GameService, "selectedEntity", {
        get: function () {
            return this._selectedEntity;
        },
        enumerable: true,
        configurable: true
    });
    GameService.setSelectedEntity = function (entity) {
        this._selectedEntity = entity;
        this.onSetSelectedEntity(entity);
        if (entity != null) {
            this.gameManager.viewPort.animateZoom(1.5, entity.getTile());
        }
        else {
            this.gameManager.viewPort.animateZoom(1, null);
        }
    };
    GameService.resetSelection = function () {
        this._selectedEntity = null;
        this.selectedHex = null;
        this.selectedAction = null;
        this.onSetSelectedEntity(null);
        this.gameManager.viewPort.animateZoom(1, null);
    };
    GameService.setGameManager = function (gameManager) {
        this.gameManager = gameManager;
    };
    ;
    GameService.getGameManager = function () {
        return this.gameManager;
    };
    ;
    return GameService;
}());
exports.GameService = GameService;
