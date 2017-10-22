"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Help = (function () {
    function Help() {
    }
    Help.lerp = function (start, end, amt) {
        return start + (end - start) * amt;
    };
    Help.mod = function (j, n) {
        return ((j % n) + n) % n;
    };
    Help.getBase64Image = function (data) {
        var canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;
        var ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    };
    Help.getImageData = function (image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        var data = ctx.getImageData(0, 0, image.width, image.height);
        return data;
    };
    Help.isLoaded = function (element) {
        return element.getAttribute("loaded") == "true";
    };
    Help.loaded = function (element, set) {
        element.setAttribute("loaded", set ? "true" : "false");
    };
    Help.loadSprite = function (src, complete) {
        var image = new Image();
        image.addEventListener("load", function (e) {
            Help.loaded(image, true);
            if (complete)
                complete(image);
        }, false);
        image.src = src;
        return image;
    };
    Help.degToRad = function (angle) {
        return angle * Math.PI / 180;
    };
    Help.sign = function (m) {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    };
    Help.floor = function (spinDashSpeed) {
        if (spinDashSpeed > 0)
            return ~~spinDashSpeed;
        return Math.floor(spinDashSpeed) | 0;
    };
    Help.max = function (f1, f2) {
        return f1 < f2 ? f2 : f1;
    };
    Help.min = function (f1, f2) {
        return f1 > f2 ? f2 : f1;
    };
    Help.getQueryString = function () {
        var result = {};
        var queryString = window.location.search.substring(1);
        var re = new RegExp("/([^&=]+)=([^&]*)/g");
        var m;
        while ((m = re.exec(queryString)) != null) {
            result[window.decodeURIComponent(m[1])] = window.decodeURIComponent(m[2]);
        }
        return result;
    };
    Help.merge = function (base, update) {
        for (var i in update) {
            base[i] = update[i];
        }
        return base;
    };
    return Help;
}());
exports.Help = Help;
