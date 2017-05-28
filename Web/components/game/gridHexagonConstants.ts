import {Point} from "../utils/utils";

export class GridHexagonConstants {

    static width = 50;
    static heightSkew = .7;
    static depthHeightSkew = .3;

    private static _height = Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
    private static _depthHeight = GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
    private static _topPolygon = [
        new Point(-GridHexagonConstants.width / 2, 0),
        new Point(-GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
        new Point(GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
        new Point(GridHexagonConstants.width / 2, 0),
        new Point(GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
        new Point(-GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
        new Point(-GridHexagonConstants.width / 2, 0)
    ];

    private static _leftPolygon = [
        GridHexagonConstants.makeHexagonDepthLeftPolygon(0),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(1),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(2),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(3),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(4),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(5),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(6),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(7),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(8),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(9),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(10),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(11),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(12),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(13),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(14),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(15),
        GridHexagonConstants.makeHexagonDepthLeftPolygon(16),
    ];
    private static _bottomPolygon = [
        GridHexagonConstants.makeHexagonDepthBottomPolygon(0),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(1),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(2),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(3),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(4),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(5),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(6),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(7),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(8),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(9),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(10),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(11),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(12),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(13),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(14),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(15),
        GridHexagonConstants.makeHexagonDepthBottomPolygon(16),
    ];

    private static _rightPolygon = [
        GridHexagonConstants.makeHexagonDepthRightPolygon(0),
        GridHexagonConstants.makeHexagonDepthRightPolygon(1),
        GridHexagonConstants.makeHexagonDepthRightPolygon(2),
        GridHexagonConstants.makeHexagonDepthRightPolygon(3),
        GridHexagonConstants.makeHexagonDepthRightPolygon(4),
        GridHexagonConstants.makeHexagonDepthRightPolygon(5),
        GridHexagonConstants.makeHexagonDepthRightPolygon(6),
        GridHexagonConstants.makeHexagonDepthRightPolygon(7),
        GridHexagonConstants.makeHexagonDepthRightPolygon(8),
        GridHexagonConstants.makeHexagonDepthRightPolygon(9),
        GridHexagonConstants.makeHexagonDepthRightPolygon(10),
        GridHexagonConstants.makeHexagonDepthRightPolygon(11),
        GridHexagonConstants.makeHexagonDepthRightPolygon(12),
        GridHexagonConstants.makeHexagonDepthRightPolygon(13),
        GridHexagonConstants.makeHexagonDepthRightPolygon(14),
        GridHexagonConstants.makeHexagonDepthRightPolygon(15),
        GridHexagonConstants.makeHexagonDepthRightPolygon(16),
    ];


    static height() {
        return this._height;
    }

    static depthHeight() {
        return this._depthHeight;
    };

    static hexagonTopPolygon() {
        return this._topPolygon;
    };

    static hexagonDepthLeftPolygon(depthHeight) {
        return this._leftPolygon[depthHeight | 0];
    };

    static hexagonDepthBottomPolygon(depthHeight) {
        return this._bottomPolygon[depthHeight | 0];
    };

    static hexagonDepthRightPolygon(depthHeight) {
        return this._rightPolygon[depthHeight | 0];
    };


    static makeHexagonDepthLeftPolygon(depthHeight) {
        return [
            new Point(-this.width / 2, 0),
            new Point(-this.width / 4, this.height() / 2),
            new Point(-this.width / 4, this.height() / 2 + depthHeight),
            new Point(-this.width / 2, depthHeight),
            new Point(-this.width / 2, 0)
        ];
    };


    static makeHexagonDepthBottomPolygon(depthHeight) {
        return [new Point(-this.width / 4, this.height() / 2),
            new Point(this.width / 4, this.height() / 2),
            new Point(this.width / 4, this.height() / 2 + depthHeight),
            new Point(-this.width / 4, this.height() / 2 + depthHeight),
            new Point(-this.width / 4, this.height() / 2)];
    };


    static makeHexagonDepthRightPolygon(depthHeight) {
        return [
            new Point(this.width / 4, this.height() / 2),
            new Point(this.width / 2, 0),
            new Point(this.width / 2, depthHeight),
            new Point(this.width / 4, depthHeight + this.height() / 2),
            new Point(this.width / 4, this.height() / 2)
        ];
    };


}

export class GridMiniHexagonConstants {

    static height() {
        return Math.sqrt(3) / 2 * this.width * this.heightSkew;
    }

    static hexagonTopPolygon() {
        return [new Point(-this.width / 2, 0), new Point(-this.width / 4, -this.height() / 2), new Point(this.width / 4, -this.height() / 2), new Point(this.width / 2, 0), new Point(this.width / 4, this.height() / 2), new Point(-this.width / 4, this.height() / 2), new Point(-this.width / 2, 0)];
    };


    static width = 10;
    static heightSkew = 0.7;

}

/*
 setTimeout(() => {

 document.getElementById('ranger').oninput = () => {
 var ranger = document.getElementById('ranger');
 this.width = ranger.value;
 GridHexagon.caches = {};
 for (var i = 0; i < Main.gameManager.hexBoard.hexList.length; i++) {
 var hex = Main.gameManager.hexBoard.hexList[i];
 hex. buildPaths();
 hex.drawCache = null;
 }
 };
 }, 100)*/
