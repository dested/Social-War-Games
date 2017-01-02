import {Point} from "../utils";
import {GridHexagon} from "./gridHexagon";
import {Main} from "../main";

export class GridHexagonConstants {

    static height() {
        return Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
    }

    static depthHeight() {
        return GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
    };

    static hexagonTopPolygon() {
        return [new Point(-GridHexagonConstants.width / 2, 0), new Point(-GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 2, 0), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 2, 0)];
    };

    static hexagonDepthLeftPolygon(depthHeight) {
        return [new Point(-GridHexagonConstants.width / 2, 0), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight), new Point(-GridHexagonConstants.width / 2, depthHeight), new Point(-GridHexagonConstants.width / 2, 0)];
    };

    static hexagonDepthBottomPolygon(depthHeight) {
        return [new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2),
            new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2),
            new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight),
            new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight),
            new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
    };

    static hexagonDepthRightPolygon(depthHeight) {
        return [new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 2, 0), new Point(GridHexagonConstants.width / 2, depthHeight), new Point(GridHexagonConstants.width / 4, depthHeight + GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
    };


    static width = 50;
    static heightSkew = .7;
    static depthHeightSkew = .3;

}

/*
setTimeout(() => {

    document.getElementById('ranger').oninput = () => {
        var ranger = document.getElementById('ranger');
        GridHexagonConstants.width = ranger.value;
        GridHexagon.caches = {};
        for (var i = 0; i < Main.gameManager.hexBoard.hexList.length; i++) {
            var hex = Main.gameManager.hexBoard.hexList[i];
            hex. buildPaths();
            hex.drawCache = null;
        }
    };
}, 100)*/
