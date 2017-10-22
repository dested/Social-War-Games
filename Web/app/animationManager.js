"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationManager = (function () {
    function AnimationManager(hexBoard) {
        this.hexBoard = hexBoard;
        this.frameIndex = 0;
        this.isRunning = false;
    }
    AnimationManager.prototype.reset = function () {
        this.frames = [];
        this.frameIndex = 0;
        this.isRunning = false;
    };
    AnimationManager.prototype.setVotes = function (votes) {
        var allFrames = [];
        var maxLength = 0;
        for (var i = 0; i < votes.length; i++) {
            var vote = votes[i];
            var action = vote.action;
            var entity = this.hexBoard.entityManager.getEntityById(action.entityId);
            if (!entity) {
                //idk
                continue;
            }
            var actionFrames = entity.getActionFrames(action, this.hexBoard);
            if (actionFrames.length > maxLength) {
                maxLength = actionFrames.length;
            }
            allFrames.push(actionFrames);
        }
        this.frames = [];
        for (var c = 0; c < maxLength; c++) {
            var frameCollection = [];
            for (var i = 0; i < allFrames.length; i++) {
                if (allFrames[i][c]) {
                    frameCollection.push(allFrames[i][c]);
                }
            }
            this.frames.push(frameCollection);
        }
    };
    AnimationManager.prototype.start = function () {
        var _this = this;
        this.isRunning = true;
        var duration = 400;
        var frames = this.frames[this.frameIndex++];
        if (!frames) {
            this.isRunning = false;
            this.complete();
            return;
        }
        for (var i = 0; i < frames.length; i++) {
            var frame = frames[i];
            frame.entity.onAnimationStart(frame);
            frame.entity.executeFrame(this.hexBoard, frame, duration);
        }
        setTimeout(function () {
            for (var i = 0; i < frames.length; i++) {
                var frame = frames[i];
                frame.entity.onAnimationComplete(frame);
            }
            _this.start();
        }, duration);
    };
    AnimationManager.prototype.onComplete = function (callback) {
        this.complete = callback;
    };
    return AnimationManager;
}());
exports.AnimationManager = AnimationManager;
var AnimationFrameType;
(function (AnimationFrameType) {
    AnimationFrameType[AnimationFrameType["Start"] = 0] = "Start";
    AnimationFrameType[AnimationFrameType["Tick"] = 1] = "Tick";
    AnimationFrameType[AnimationFrameType["Stop"] = 2] = "Stop";
})(AnimationFrameType = exports.AnimationFrameType || (exports.AnimationFrameType = {}));
var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["Move"] = 0] = "Move";
    AnimationType[AnimationType["Attack"] = 1] = "Attack";
})(AnimationType = exports.AnimationType || (exports.AnimationType = {}));
