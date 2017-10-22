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
var RegularBaseEntity = (function (_super) {
    __extends(RegularBaseEntity, _super);
    function RegularBaseEntity(entityManager, entity) {
        var _this = _super.call(this, entityManager, entity, 0, 0) || this;
        _this.entityType = 'Base';
        return _this;
    }
    RegularBaseEntity.prototype.realYOffset = function () {
        return 0;
    };
    RegularBaseEntity.prototype.realXOffset = function () {
        return 0;
    };
    RegularBaseEntity.prototype.getYOffset = function () {
        return 0;
    };
    return RegularBaseEntity;
}(stationaryEntity_1.StationaryEntity));
exports.RegularBaseEntity = RegularBaseEntity;
