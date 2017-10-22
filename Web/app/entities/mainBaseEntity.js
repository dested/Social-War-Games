"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stationaryEntity_1 = require("./stationaryEntity");
var MainBaseEntity = (function (_super) {
    __extends(MainBaseEntity, _super);
    function MainBaseEntity(entityManager, entity) {
        var _this = _super.call(this, entityManager, entity, 0, 0) || this;
        _this.entityType = 'MainBase';
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
}(stationaryEntity_1.StationaryEntity));
exports.MainBaseEntity = MainBaseEntity;
