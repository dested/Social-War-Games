"use strict";
///<reference path="../typings/path2d.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
var drawingUtilities_1 = require("../utils/drawingUtilities");
var gridHexagonConstants_1 = require("./gridHexagonConstants");
var hexagonColorUtils_1 = require("../utils/hexagonColorUtils");
var gameService_1 = require("../ui/gameService");
var GridHexagon = (function () {
    function GridHexagon() {
        this.topPath = null;
        this.topPathInner = null;
        this.topMiniPath = null;
        this.x = 0;
        this.z = 0;
        this.tileType = 0;
        this.faction = 0;
        this.entities = [];
        this.showVotes = true;
        this._realX = undefined;
        this._realZ = undefined;
        this.neighbors = null;
    }
    GridHexagon.prototype.getRealX = function () {
        if (this._realX !== undefined) {
            return this._realX;
        }
        return this._realX = (gridHexagonConstants_1.GridHexagonConstants.width * 3 / 4 * this.x);
    };
    GridHexagon.prototype.getRealZ = function () {
        if (this._realZ !== undefined) {
            return this._realZ;
        }
        var height = gridHexagonConstants_1.GridHexagonConstants.height();
        return this._realZ = (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0));
    };
    GridHexagon.prototype.getScreenX = function () {
        return this.getRealX() - gameService_1.GameService.getGameManager().viewPort.getX();
    };
    GridHexagon.prototype.getScreenZ = function () {
        return this.getRealZ() - gameService_1.GameService.getGameManager().viewPort.getY();
    };
    GridHexagon.prototype.getRealMiniX = function () {
        return (gridHexagonConstants_1.GridMiniHexagonConstants.width * 3 / 4 * this.x);
    };
    GridHexagon.prototype.getRealMiniZ = function () {
        var height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
        return (this.z * height + ((this.x % 2 === 1) ? (-height / 2) : 0));
    };
    GridHexagon.prototype.getEntities = function () {
        return this.entities;
    };
    GridHexagon.prototype.hasEntities = function () {
        return this.entities && this.entities.length > 0;
    };
    GridHexagon.prototype.getEntityById = function (id) {
        return this.entities.filter(function (a) { return a.id == id; })[0];
    };
    GridHexagon.prototype.addEntity = function (entity) {
        this.entities.push(entity);
        this.invalidateColor();
    };
    GridHexagon.prototype.removeEntity = function (entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        this.invalidateColor();
    };
    GridHexagon.prototype.setBaseColor = function (baseColor) {
        if (this.baseColor !== baseColor) {
            this.baseColor = baseColor;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.setFaction = function (faction) {
        if (this.faction !== faction) {
            this.faction = faction;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.setHighlightColor = function (highlightColor) {
        if (this.highlightColor !== highlightColor) {
            this.highlightColor = highlightColor;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.setVoteColor = function (voteColor) {
        if (this.voteColor !== voteColor) {
            this.voteColor = voteColor;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.clearVoteColor = function () {
        if (this.voteColor !== null) {
            this.voteColor = null;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.setSecondaryVoteColor = function (voteColor) {
        if (this.secondaryVoteColor !== voteColor) {
            this.secondaryVoteColor = voteColor;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.clearSecondaryVoteColor = function () {
        if (this.secondaryVoteColor !== null) {
            this.secondaryVoteColor = null;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.clearHighlightColor = function () {
        if (this.highlightColor !== null) {
            this.highlightColor = null;
            this.invalidateColor();
        }
    };
    GridHexagon.prototype.setTexture = function (textureTop) {
        this.textureTop = textureTop;
        this.invalidateColor();
    };
    GridHexagon.prototype.buildPaths = function () {
        this._realX = undefined;
        this._realZ = undefined;
        this.topPath = GridHexagon.buildPath(gridHexagonConstants_1.GridHexagonConstants.hexagonTopPolygon());
        // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
    };
    GridHexagon.prototype.buildMiniPaths = function () {
        this.topMiniPath = GridHexagon.buildPath(gridHexagonConstants_1.GridMiniHexagonConstants.hexagonTopPolygon());
        // this.topPathInner = GridHexagon.buildPath(GridHexagonConstants.hexagonTopInnerPolygon());
    };
    GridHexagon.prototype.invalidateColor = function () {
        var entityColor = (this.entities.length > 0 && hexagonColorUtils_1.HexagonColorUtils.entityHexColor);
        var voteColor = this.voteColor;
        var secondaryVoteColor = this.secondaryVoteColor;
        var highlightColor = this.highlightColor;
        var factionColor = (this.faction > 0 && hexagonColorUtils_1.HexagonColorUtils.factionHexColors[this.faction - 1][this.tileType]);
        var baseColor = (this.baseColor && this.baseColor[this.tileType]);
        this.currentDrawColorNoVote = factionColor || baseColor;
        this.currentDrawColor = voteColor || secondaryVoteColor || highlightColor || entityColor || factionColor || baseColor;
        this.currentFactionColor = factionColor || baseColor;
        this.currentMiniColor = voteColor || entityColor || factionColor || baseColor;
        this.shouldStroke = !!highlightColor;
        if (this.currentDrawColor && this.textureTop) {
            this.drawCache = GridHexagon.getCacheImage(this.currentDrawColor, this.shouldStroke, this.textureTop.name);
            this.drawCacheNoVote = GridHexagon.getCacheImage(this.currentDrawColorNoVote, this.shouldStroke, this.textureTop.name);
            this.drawMiniCache = GridHexagon.getMiniCacheImage(this.currentMiniColor);
        }
    };
    GridHexagon.prototype.drawTop = function (context, color) {
        context.save();
        {
            if (this.shouldStroke) {
                context.fillStyle = color.darkBorder;
                context.fill(this.topPath);
            }
            else {
                context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(color.color, 0.8);
                context.fill(this.topPath);
            }
            context.scale(0.95, 0.95);
            context.fillStyle = context.createPattern(this.textureTop.image, 'repeat');
            context.fill(this.topPath);
            context.fillStyle = drawingUtilities_1.DrawingUtils.makeTransparent(color.color, 0.8);
            context.fill(this.topPath);
            context.restore();
        }
        context.restore();
    };
    GridHexagon.prototype.drawTopMini = function (context) {
        var color = this.currentMiniColor.color;
        context.fillStyle = color;
        context.fill(this.topMiniPath);
        /*        context.lineWidth = 3;
         context.strokeStyle = color;
         context.stroke(this.topMiniPath);*/
    };
    GridHexagon.prototype.envelope = function () {
        var size = { width: 0, height: 0 };
        size.width = gridHexagonConstants_1.GridHexagonConstants.width;
        size.height = gridHexagonConstants_1.GridHexagonConstants.height();
        size.width += 12;
        size.height += 6;
        return size;
    };
    GridHexagon.prototype.envelopeMini = function () {
        var size = { width: 0, height: 0 };
        size.width = gridHexagonConstants_1.GridMiniHexagonConstants.width;
        size.height = gridHexagonConstants_1.GridMiniHexagonConstants.height();
        size.width += 20;
        size.height += 20;
        return size;
    };
    GridHexagon.generateHexCenters = function () {
        this.hexCenter = { x: (gridHexagonConstants_1.GridHexagonConstants.width / 2 + 6), y: (gridHexagonConstants_1.GridHexagonConstants.height() / 2 + 6) };
        this.hexCenterMini = {
            x: (gridHexagonConstants_1.GridMiniHexagonConstants.width / 2 + 6),
            y: (gridHexagonConstants_1.GridMiniHexagonConstants.height() / 2 + 6)
        };
    };
    GridHexagon.prototype.draw = function (context, offsetX, offsetY) {
        if (this.showVotes) {
            if (this.drawCache) {
                context.drawImage(this.drawCache, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
                /*
                 context.fillStyle = 'black';
                 context.font = '11px bold san-serif';
                 context.fillText(this.x + "," + this.z, offsetX - 10, offsetY + 5)
                 */
            }
            else {
                var cacheImage = GridHexagon.getCacheImage(this.currentDrawColor, this.shouldStroke, this.textureTop.name);
                if (cacheImage) {
                    this.drawCache = cacheImage;
                }
                else {
                    this.drawCache = this.prepDraw(this.currentDrawColor);
                    console.log(this.drawCache.toDataURL());
                }
                this.draw(context, offsetX, offsetY);
            }
        }
        else {
            if (this.drawCacheNoVote) {
                context.drawImage(this.drawCacheNoVote, offsetX - GridHexagon.hexCenter.x, offsetY - GridHexagon.hexCenter.y);
            }
            else {
                var cacheImage = GridHexagon.getCacheImage(this.currentDrawColor, this.shouldStroke, this.textureTop.name);
                if (cacheImage) {
                    this.drawCacheNoVote = cacheImage;
                }
                else {
                    this.drawCacheNoVote = this.prepDraw(this.currentDrawColorNoVote);
                }
                this.draw(context, offsetX, offsetY);
            }
        }
    };
    GridHexagon.prototype.drawMini = function (context, offsetX, offsetY) {
        if (this.drawMiniCache) {
            context.drawImage(this.drawMiniCache, offsetX - GridHexagon.hexCenterMini.x, offsetY - GridHexagon.hexCenterMini.y);
        }
        else {
            var miniCacheImage = GridHexagon.getMiniCacheImage(this.currentMiniColor);
            if (miniCacheImage) {
                this.drawMiniCache = miniCacheImage;
            }
            else {
                this.prepMiniDraw();
            }
            this.drawMini(context, offsetX, offsetY);
        }
    };
    GridHexagon.prototype.getNeighbors = function () {
        if (this.neighbors === null) {
            this.neighbors = [];
            if ((this.x % 2 === 0)) {
                this.neighbors.push({ x: this.x - 1, z: this.z });
                this.neighbors.push({ x: this.x, z: this.z - 1 });
                this.neighbors.push({ x: this.x + 1, z: this.z });
                this.neighbors.push({ x: this.x - 1, z: this.z + 1 });
                this.neighbors.push({ x: this.x, z: this.z + 1 });
                this.neighbors.push({ x: this.x + 1, z: this.z + 1 });
            }
            else {
                this.neighbors.push({ x: this.x - 1, z: this.z - 1 });
                this.neighbors.push({ x: this.x, z: this.z - 1 });
                this.neighbors.push({ x: this.x + 1, z: this.z - 1 });
                this.neighbors.push({ x: this.x - 1, z: this.z });
                this.neighbors.push({ x: this.x, z: this.z + 1 });
                this.neighbors.push({ x: this.x + 1, z: this.z });
            }
        }
        return this.neighbors;
    };
    GridHexagon.getCacheImage = function (hexColor, shouldStroke, texture) {
        var c = hexColor.color + "-" + texture + "-" + shouldStroke;
        return GridHexagon.caches[c];
    };
    GridHexagon.setCacheImage = function (hexColor, shouldStroke, texture, img) {
        var c = hexColor.color + "-" + texture + "-" + shouldStroke;
        GridHexagon.caches[c] = img;
    };
    GridHexagon.getMiniCacheImage = function (hexColor) {
        var c = "m" + hexColor.color;
        return GridHexagon.caches[c];
    };
    GridHexagon.setMiniCacheImage = function (hexColor, img) {
        var c = "m" + hexColor.color;
        GridHexagon.caches[c] = img;
    };
    GridHexagon.buildPath = function (path) {
        var p2d = new Path2D();
        for (var i = 0; i < path.length; i++) {
            var point = path[i];
            p2d.lineTo(point.x, point.y);
        }
        return p2d;
    };
    GridHexagon.prototype.prepDraw = function (color) {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        var size = this.envelope();
        can.width = Math.ceil(size.width);
        can.height = Math.ceil(size.height);
        ctx.save();
        ctx.translate(GridHexagon.hexCenter.x, GridHexagon.hexCenter.y);
        ctx.save();
        this.drawTop(ctx, color);
        ctx.restore();
        ctx.restore();
        GridHexagon.setCacheImage(color, this.shouldStroke, this.textureTop.name, can);
        return can;
    };
    GridHexagon.prototype.prepMiniDraw = function () {
        var can = document.createElement('canvas');
        var ctx = can.getContext('2d');
        var size = this.envelopeMini();
        can.width = size.width;
        can.height = size.height;
        ctx.save();
        ctx.translate(GridHexagon.hexCenterMini.x, GridHexagon.hexCenterMini.y);
        this.drawTopMini(ctx);
        ctx.restore();
        GridHexagon.setMiniCacheImage(this.currentMiniColor, can);
        this.drawMiniCache = can;
        /*       ctx.strokeStyle='black';
         ctx.lineWidth=1;
         ctx.strokeRect(0,0,can.width,can.height);*/
        return can;
    };
    GridHexagon.prototype.shouldDraw = function (viewPort) {
        var x = this.getRealX();
        var y = this.getRealZ();
        return viewPort.shouldDraw(x, y);
    };
    GridHexagon.prototype.setShowVotes = function (showVotes) {
        this.showVotes = showVotes;
    };
    GridHexagon.caches = {};
    return GridHexagon;
}());
exports.GridHexagon = GridHexagon;
