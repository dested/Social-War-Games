"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimationUtils = (function () {
    function AnimationUtils() {
    }
    AnimationUtils.stopAnimations = function () {
        for (var i = 0; i < AnimationUtils.animations.length; i++) {
            var animation = AnimationUtils.animations[i];
            animation.stop = true;
        }
        AnimationUtils.animations.length = 0;
    };
    AnimationUtils.start = function (options) {
        if (options.start === options.finish) {
            options.callback(options.finish);
            options.complete && options.complete(options.finish);
            return;
        }
        var startTime = +new Date();
        var animationInstance = new AnimationInstance();
        AnimationUtils.animations.push(animationInstance);
        function next() {
            if (animationInstance.stop) {
                options.callback(options.finish);
                options.complete && options.complete(options.finish);
                return;
            }
            if (animationInstance.cancel) {
                return;
            }
            var curTime = +new Date();
            var percent = Math.max(Math.min((curTime - startTime) / options.duration, 1), 0);
            var j = options.easing(percent);
            options.callback(options.start + (options.finish - options.start) * j);
            if (percent >= 1) {
                AnimationUtils.animations.splice(AnimationUtils.animations.indexOf(animationInstance), 1);
                options.complete && options.complete(options.finish);
            }
            else {
                requestAnimationFrame(next);
            }
        }
        requestAnimationFrame(next);
    };
    AnimationUtils.lightenDarkenColor = function (col, amount) {
        var usePound = false;
        if (col[0] === "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col, 16);
        var r = (num >> 16) + amount;
        if (r > 255)
            r = 255;
        else if (r < 0)
            r = 0;
        var b = ((num >> 8) & 0x00FF) + amount;
        if (b > 255)
            b = 255;
        else if (b < 0)
            b = 0;
        var g = (num & 0x0000FF) + amount;
        if (g > 255)
            g = 255;
        else if (g < 0)
            g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    };
    AnimationUtils.animations = [];
    AnimationUtils.easings = {
        // no easing, no acceleration
        linear: function (t) {
            return t;
            ;
        },
        // accelerating from zero velocity
        easeInQuad: function (t) {
            return t * t;
        },
        // decelerating to zero velocity
        easeOutQuad: function (t) {
            return t * (2 - t);
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        // accelerating from zero velocity
        easeInCubic: function (t) {
            return t * t * t;
        },
        // decelerating to zero velocity
        easeOutCubic: function (t) {
            return (--t) * t * t + 1;
        },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuart: function (t) {
            return t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuart: function (t) {
            return 1 - (--t) * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint: function (t) {
            return t * t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuint: function (t) {
            return 1 + (--t) * t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };
    return AnimationUtils;
}());
exports.AnimationUtils = AnimationUtils;
var AnimationInstance = (function () {
    function AnimationInstance() {
        this.stop = false;
        this.cancel = false;
    }
    return AnimationInstance;
}());
exports.AnimationInstance = AnimationInstance;
