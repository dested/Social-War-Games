"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help_1 = require("../utils/help");
var animationManager_1 = require("../animationManager");
var hexagonColorUtils_1 = require("../utils/hexagonColorUtils");
var BaseEntity = (function () {
    function BaseEntity(entityManager, entity, totalFrames, animationSpeed) {
        this.entityManager = entityManager;
        this.totalFrames = totalFrames;
        this.animationSpeed = animationSpeed;
        this.animationFrame = 0;
        this.drawTickNumber = (Math.random() * 1000) | 0;
        this.missileDirection = null;
        this.missileAnimationFrame = 0;
        this._move_animateFromHex = null;
        this._move_animateToHex = null;
        this._move_durationTicks = -1;
        this._move_currentTick = -1;
        this._attack_animateFromHex = null;
        this._attack_animateToHex = null;
        this._attack_durationTicks = -1;
        this._attack_currentTick = -1;
        this.currentVotes = [];
        this.stillAlive = false;
        this.faction = entity.factionId;
        this.setHealth(entity.health);
    }
    BaseEntity.prototype.setId = function (id) {
        this.id = id;
    };
    BaseEntity.prototype.setHealth = function (health) {
        this.health = health;
    };
    BaseEntity.prototype.setTile = function (tile) {
        if (this.tile) {
            this.entityManager.removeEntityFromTile(this.tile, this);
            this.tile.removeEntity(this);
        }
        this.tile = tile;
        if (tile) {
            this.tile.addEntity(this);
            this.x = this.tile.getRealX();
            this.z = this.tile.getRealZ();
            this.entityManager.addEntityToTile(tile, this);
        }
    };
    BaseEntity.prototype.getTile = function () {
        return this.tile;
    };
    BaseEntity.prototype.draw = function (context) {
        this.drawTickNumber++;
        if (this.drawTickNumber % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
        }
        if (this._move_currentTick != -1) {
            var percent = this._move_currentTick / this._move_durationTicks;
            if (percent < 1) {
                this.x = help_1.Help.lerp(this._move_animateFromHex.getRealX(), this._move_animateToHex.getRealX(), percent);
                this.z = help_1.Help.lerp(this._move_animateFromHex.getRealZ(), this._move_animateToHex.getRealZ(), percent);
                this._move_currentTick++;
            }
        }
        if (this._attack_currentTick != -1) {
            /*         if (this.drawTickNumber % this.animationSpeed === 0) {
             this.missileAnimationFrame = (this.missileAnimationFrame + 1) % this.totalFrames;
             }*/
            this.missileAsset = 'Missile';
            var percent = this._attack_currentTick / this._attack_durationTicks;
            if (percent < 1) {
                this.missileX = help_1.Help.lerp(this._attack_animateFromHex.getRealX(), this._attack_animateToHex.getRealX(), percent);
                this.missileZ = help_1.Help.lerp(this._attack_animateFromHex.getRealZ(), this._attack_animateToHex.getRealZ(), percent);
                this._attack_currentTick++;
            }
        }
    };
    BaseEntity.prototype.tick = function () {
    };
    BaseEntity.prototype.onAnimationComplete = function (frame) {
        switch (frame.type) {
            case animationManager_1.AnimationType.Move: {
                if (frame.frameType == animationManager_1.AnimationFrameType.Stop) {
                    var tile_1 = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                    tile_1.clearHighlightColor();
                    this._move_currentTick = -1;
                    this._move_durationTicks = -1;
                    this._move_animateToHex = null;
                    this._move_animateFromHex = null;
                    return;
                }
                var startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                startTile.clearHighlightColor();
                var tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                var neighbors = tile.getNeighbors();
                tile.setFaction(this.faction);
                for (var j = 0; j < neighbors.length; j++) {
                    var ne = neighbors[j];
                    var tile_2 = this.entityManager.hexBoard.getHexAtSpot(ne.x, ne.z);
                    if (!tile_2)
                        continue;
                    tile_2.setFaction(this.faction);
                }
                this.x = tile.getRealX();
                this.z = tile.getRealZ();
                this.setTile(tile);
                break;
            }
            case animationManager_1.AnimationType.Attack: {
                if (frame.frameType == animationManager_1.AnimationFrameType.Stop) {
                    this._attack_currentTick = -1;
                    this._attack_durationTicks = -1;
                    this._attack_animateToHex = null;
                    this._attack_animateFromHex = null;
                    this.missileAsset = null;
                    return;
                }
                break;
            }
        }
    };
    BaseEntity.prototype.onAnimationStart = function (frame) {
        switch (frame.type) {
            case animationManager_1.AnimationType.Move: {
                if (frame.frameType == animationManager_1.AnimationFrameType.Start) {
                    this._move_currentTick = -1;
                    this._move_durationTicks = -1;
                    this._move_animateToHex = null;
                    this._move_animateFromHex = null;
                    return;
                }
                var startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                var nextTile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                startTile.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.highlightColor);
                nextTile.setHighlightColor(hexagonColorUtils_1.HexagonColorUtils.highlightColor);
                break;
            }
            case animationManager_1.AnimationType.Attack: {
                if (frame.frameType == animationManager_1.AnimationFrameType.Start) {
                    this._attack_currentTick = -1;
                    this._attack_durationTicks = -1;
                    this._attack_animateToHex = null;
                    this._attack_animateFromHex = null;
                    return;
                }
                break;
            }
        }
    };
    BaseEntity.prototype.resetVotes = function () {
        this.currentVotes.length = 0;
        this.totalVoteCount = 0;
        this.getTile().clearVoteColor();
        this.getTile().clearSecondaryVoteColor();
    };
    BaseEntity.prototype.pushVote = function (vote) {
        this.currentVotes.push(vote);
        var votes = 0;
        for (var i = 0; i < this.currentVotes.length; i++) {
            votes += this.currentVotes[i].votes;
        }
        this.totalVoteCount = votes;
        this.getTile().setVoteColor(hexagonColorUtils_1.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
    };
    BaseEntity.prototype.setSecondaryVoteColor = function (spot) {
        var votes = 0;
        for (var i = 0; i < this.currentVotes.length; i++) {
            var currentVote = this.currentVotes[i];
            switch (currentVote.action.actionType) {
                case "Move":
                    var moveAction = currentVote.action;
                    if (moveAction.x == spot.x && moveAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
                case "Attack":
                    var attackAction = currentVote.action;
                    if (attackAction.x == spot.x && attackAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
                case "Spawn":
                    var spawnAction = currentVote.action;
                    if (spawnAction.x == spot.x && spawnAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
            }
        }
        if (votes > 0) {
            spot.setSecondaryVoteColor(hexagonColorUtils_1.HexagonColorUtils.voteColor[Math.min(votes, 10)]);
        }
    };
    BaseEntity.prototype.markAlive = function () {
        this.stillAlive = true;
    };
    return BaseEntity;
}());
exports.BaseEntity = BaseEntity;
