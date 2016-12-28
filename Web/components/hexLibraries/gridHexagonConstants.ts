import {Point} from "../utils";

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


    static width = 150 ;
    static heightSkew = .7;
    static depthHeightSkew = .3;

}

