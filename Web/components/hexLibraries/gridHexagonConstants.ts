import {Point} from "../utils/utils";
import {GridHexagon} from "./gridHexagon";
import {Main} from "../main";

export class GridHexagonConstants {

    static height() {
        return Math.sqrt(3) / 2 * this.width * this.heightSkew;
    }

    static depthHeight() {
        return this.height() * this.depthHeightSkew;
    };

    static hexagonTopPolygon() {
        return [new Point(-this.width / 2, 0), new Point(-this.width / 4, -this.height() / 2), new Point(this.width / 4, -this.height() / 2), new Point(this.width / 2, 0), new Point(this.width / 4, this.height() / 2), new Point(-this.width / 4, this.height() / 2), new Point(-this.width / 2, 0)];
    };

    static hexagonDepthLeftPolygon(depthHeight) {
        return [new Point(-this.width / 2, 0), new Point(-this.width / 4, this.height() / 2), new Point(-this.width / 4, this.height() / 2 + depthHeight), new Point(-this.width / 2, depthHeight), new Point(-this.width / 2, 0)];
    };

    static hexagonDepthBottomPolygon(depthHeight) {
        return [new Point(-this.width / 4, this.height() / 2),
            new Point(this.width / 4, this.height() / 2),
            new Point(this.width / 4, this.height() / 2 + depthHeight),
            new Point(-this.width / 4, this.height() / 2 + depthHeight),
            new Point(-this.width / 4, this.height() / 2)];
    };

    static hexagonDepthRightPolygon(depthHeight) {
        return [new Point(this.width / 4, this.height() / 2), new Point(this.width / 2, 0), new Point(this.width / 2, depthHeight), new Point(this.width / 4, depthHeight + this.height() / 2), new Point(this.width / 4, this.height() / 2)];
    };


    static width = 50;
    static heightSkew = .7;
    static depthHeightSkew = .3;

}

export class GridMiniHexagonConstants {

    static height() {
        return Math.sqrt(3) / 2 * this.width * this.heightSkew;
    }

    static depthHeight() {
        return this.height() * this.depthHeightSkew;
    };

    static hexagonTopPolygon() {
        return [new Point(-this.width / 2, 0), new Point(-this.width / 4, -this.height() / 2), new Point(this.width / 4, -this.height() / 2), new Point(this.width / 2, 0), new Point(this.width / 4, this.height() / 2), new Point(-this.width / 4, this.height() / 2), new Point(-this.width / 2, 0)];
    };


    static width = 10;
    static heightSkew = .7;
    static depthHeightSkew = .3;

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
