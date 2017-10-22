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
var sixDirectionEntity_1 = require("./sixDirectionEntity");
var HeliEntity = (function (_super) {
    __extends(HeliEntity, _super);
    function HeliEntity(entityManager, entity) {
        var _this = _super.call(this, entityManager, entity, 2, 10) || this;
        _this.entityType = 'Heli';
        return _this;
    }
    HeliEntity.prototype.realYOffset = function () {
        return -(Math.sin(this.drawTickNumber / 10));
    };
    HeliEntity.prototype.realXOffset = function () {
        return 0;
    };
    HeliEntity.prototype.getYOffset = function () {
        return 1;
    };
    return HeliEntity;
}(sixDirectionEntity_1.SixDirectionEntity));
exports.HeliEntity = HeliEntity;
