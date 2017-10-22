"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drawingUtilities_1 = require("./drawingUtilities");
var color_1 = require("./color");
var HexagonColorUtils = (function () {
    function HexagonColorUtils() {
    }
    HexagonColorUtils.setupColors = function () {
        this.baseColors = [new drawingUtilities_1.HexagonColor('#AFFFFF')];
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#dfdab8'));
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#c1bc9c'));
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#ada887'));
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#999470'));
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#747053'));
        this.baseColors.push(new drawingUtilities_1.HexagonColor('#625d47'));
        this.factionColors = ["#444EF0", "#ff5069", "#009900"];
        this.factionHexColors = [];
        this.voteColor = [];
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#cffffd"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#7bfffd"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#13dfff"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#1bc1ff"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#63b2ff"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#a3a0ff"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#b66aff"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#ffb0ec"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#ffcd68"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#FF6638"));
        this.voteColor.push(new drawingUtilities_1.HexagonColor("#FF0000"));
        for (var f = 0; f < this.factionColors.length; f++) {
            this.factionHexColors[f] = [];
            for (var i = 0; i < this.baseColors.length; i++) {
                this.factionHexColors[f].push(new drawingUtilities_1.HexagonColor(color_1.ColorUtils.blend_colors(this.baseColors[i].color, drawingUtilities_1.DrawingUtils.colorLuminance(this.factionColors[f], i == 0 ? 1 : ((i - 1) / 6)), .9)));
            }
        }
    };
    HexagonColorUtils.entityHexColor = new drawingUtilities_1.HexagonColor("#FCFCFC");
    HexagonColorUtils.baseColor = new drawingUtilities_1.HexagonColor('#FFFFFF');
    HexagonColorUtils.highlightColor = new drawingUtilities_1.HexagonColor('#00F9FF');
    HexagonColorUtils.selectedHighlightColor = new drawingUtilities_1.HexagonColor('#6B90FF');
    HexagonColorUtils.moveHighlightColor = new drawingUtilities_1.HexagonColor('#BE9EFF');
    HexagonColorUtils.attackHighlightColor = new drawingUtilities_1.HexagonColor('#f9a5b1');
    HexagonColorUtils.spawnHighlightColor = new drawingUtilities_1.HexagonColor('#f7f966');
    HexagonColorUtils.miniBaseColor = new drawingUtilities_1.HexagonColor('#DCDCDC');
    return HexagonColorUtils;
}());
exports.HexagonColorUtils = HexagonColorUtils;
