"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HexagonColor = (function () {
    function HexagonColor(color) {
        this.color = "";
        this.darkBorder = "";
        this.dark1 = "";
        this.dark2 = "";
        this.dark3 = "";
        this.color = color;
        this.darkBorder = DrawingUtils.colorLuminance(color, -0.45);
        this.dark1 = DrawingUtils.colorLuminance(color, -0.4);
        this.dark2 = DrawingUtils.colorLuminance(color, -0.55);
        this.dark3 = DrawingUtils.colorLuminance(color, -0.65);
    }
    return HexagonColor;
}());
exports.HexagonColor = HexagonColor;
var DrawingUtils = (function () {
    function DrawingUtils() {
    }
    DrawingUtils.drawCircle = function (context) {
        context.beginPath();
        context.arc(0, 0, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.lineWidth = 5;
        context.stroke();
    };
    ;
    DrawingUtils.colorLuminance = function (hex, lum) {
        // validate hex string
        hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
        // convert to decimal and change luminosity
        var rgb = '#';
        for (var i = 0; i < 3; i++) {
            var c = parseInt(hex.substr(i * 2, 2), 16);
            var cs = (Math.round(Math.min(Math.max(0, c + c * lum), 255)) | 0).toString(16);
            rgb += ("00" + cs).substr(cs.length);
        }
        return rgb;
    };
    ;
    DrawingUtils.makeTransparent = function (hex, opacitiy) {
        // validate hex string
        hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
        // convert to decimal and change luminosity
        var rgb = 'rgba(';
        for (var i = 0; i < 3; i++) {
            var c = parseInt(hex.substr(i * 2, 2), 16);
            rgb += c + ',';
        }
        rgb += opacitiy + ")";
        return rgb;
    };
    ;
    DrawingUtils.pointInPolygon = function (pointX, pointY, polygon) {
        var isInside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (polygon[i].y > pointY !== polygon[j].y > pointY &&
                pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                isInside = !isInside;
            }
        }
        return isInside;
    };
    ;
    return DrawingUtils;
}());
exports.DrawingUtils = DrawingUtils;
