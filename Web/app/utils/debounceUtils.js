"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebounceUtils = (function () {
    function DebounceUtils() {
    }
    DebounceUtils.debounce = function (key, ms, callback) {
        if (DebounceUtils.debounceCallbacks[key]) {
            //                console.log(key + ' debounce stopped');
            clearTimeout(DebounceUtils.debounceCallbacks[key].timeout);
        }
        DebounceUtils.debounceCallbacks[key] = {
            callback: callback,
            timeout: setTimeout(function () {
                //                console.log(key + ' debounce called');
                callback();
                delete DebounceUtils.debounceCallbacks[key];
            }, ms)
        };
    };
    DebounceUtils.debounceCallbacks = {};
    return DebounceUtils;
}());
exports.DebounceUtils = DebounceUtils;
