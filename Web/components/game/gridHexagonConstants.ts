import {Point} from "../utils/utils";
import {GridHexagon} from "./gridHexagon";
import {GameService} from "../ui/gameService";

export class GridHexagonConstants {

    static width: number;
    static heightSkew: number;

    private static _height: number;

    private static _topPolygon: Point[];

    public static generate(width: number) {
        this.width = width;
        this.heightSkew = .7;

        this._height = Math.ceil(Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew);
        this._topPolygon = GridHexagonConstants.makeHexagonDepthTopPolygon();
        GridHexagon.generateHexCenters();
        if (GameService.getGameManager() && GameService.getGameManager().hexBoard && GameService.getGameManager().hexBoard.hexList) {
            let hexList = GameService.getGameManager().hexBoard.hexList;
            for (let i = 0; i < hexList.length; i++) {
                let hex = hexList[i];
                hex.buildPaths();
            }
        }
    }

    static height() {
        return this._height;
    }


    static hexagonTopPolygon() {
        return this._topPolygon;
    };


    static makeHexagonDepthTopPolygon() {
        let halfWidth = Math.ceil(GridHexagonConstants.width / 2);
        let quarterWidth = Math.ceil(GridHexagonConstants.width / 4);
        let halfHeight = Math.ceil(GridHexagonConstants._height / 2);
        return [
            new Point(-halfWidth, 0),
            new Point(-quarterWidth, -halfHeight),
            new Point(quarterWidth, -halfHeight),
            new Point(halfWidth, 0),
            new Point(quarterWidth, halfHeight),
            new Point(-quarterWidth, halfHeight),
            new Point(-halfWidth, 0)
        ];
    };

}

export class GridMiniHexagonConstants {

    static height() {
        return Math.ceil(Math.sqrt(3) / 2 * this.width * this.heightSkew);
    }

    static hexagonTopPolygon() {
        let halfWidth = Math.ceil(this.width / 2);
        let quarterWidth = Math.ceil(this.width / 4);
        let halfHeight = Math.ceil(this.height() / 2);
        return [
            new Point(-halfWidth, 0),
            new Point(-quarterWidth, -halfHeight),
            new Point(quarterWidth, -halfHeight),
            new Point(halfWidth, 0),
            new Point(quarterWidth, halfHeight),
            new Point(-quarterWidth, halfHeight),
            new Point(-halfWidth, 0)
        ];
    };


    static width = 10;
    static heightSkew = 0.7;

}

