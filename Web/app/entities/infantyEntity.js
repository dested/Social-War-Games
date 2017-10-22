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
var InfantryEntity = (function (_super) {
    __extends(InfantryEntity, _super);
    function InfantryEntity(entityManager, entity) {
        var _this = _super.call(this, entityManager, entity, 2, 10) || this;
        _this.entityType = 'Infantry';
        return _this;
    }
    InfantryEntity.prototype.realYOffset = function () {
        return 0;
    };
    InfantryEntity.prototype.realXOffset = function () {
        return 0;
    };
    InfantryEntity.prototype.getYOffset = function () {
        return 0;
    };
    return InfantryEntity;
}(sixDirectionEntity_1.SixDirectionEntity));
exports.InfantryEntity = InfantryEntity;
