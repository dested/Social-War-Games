"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityManager = (function () {
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
        return this.entitiesMap[item.x + item.z * 5000] || [];
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
    EntityManager.prototype.killEntity = function (entity) {
        var tile = entity.getTile();
        var entities = this.entitiesMap[tile.x + tile.z * 5000];
        entities.splice(entities.indexOf(entity), 1);
        this.entitiesMap[tile.x + tile.z * 5000] = entities;
        this.entities.splice(this.entities.indexOf(entity), 1);
    };
    EntityManager.prototype.addEntityToTile = function (tile, entity) {
        if (!this.entitiesMap[tile.x + tile.z * 5000]) {
            this.entitiesMap[tile.x + tile.z * 5000] = [];
        }
        this.entitiesMap[tile.x + tile.z * 5000].push(entity);
    };
    return EntityManager;
}());
exports.EntityManager = EntityManager;
