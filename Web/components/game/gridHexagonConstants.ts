import {Point} from "../utils/utils";
import {GridHexagon} from "./gridHexagon";
import {GameService} from "../ui/gameService";

export class GridHexagonConstants {


    static width: number;
    static heightSkew: number;
    static depthHeightSkew: number;

    private static _height: number;
    private static _depthHeight: number;

    private static _topPolygon: Point[];
    private static _leftPolygon: Point[][];
    private static _bottomPolygon: Point[][];
    private static _rightPolygon: Point[][];

    public static generate(width: number) {
        this.width = width;
        this.heightSkew = .7;
        this.depthHeightSkew = .3;

        this._height = Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
        this._depthHeight = GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
        this._topPolygon = GridHexagonConstants.makeHexagonDepthTopPolygon();

        this._leftPolygon = [];
        this._bottomPolygon = [];
        this._rightPolygon = [];
        for (let i = 0; i <= 16; i++) {
            this._rightPolygon.push(GridHexagonConstants.makeHexagonDepthRightPolygon(i));
            this._bottomPolygon.push(GridHexagonConstants.makeHexagonDepthBottomPolygon(i));
            this._leftPolygon.push(GridHexagonConstants.makeHexagonDepthLeftPolygon(i));
        }
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

    static makeHexagonDepthTopPolygon() {
        return [
            new Point(-GridHexagonConstants.width / 2, 0),
            new Point(-GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
            new Point(GridHexagonConstants.width / 4, -GridHexagonConstants._height / 2),
            new Point(GridHexagonConstants.width / 2, 0),
            new Point(GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
            new Point(-GridHexagonConstants.width / 4, GridHexagonConstants._height / 2),
            new Point(-GridHexagonConstants.width / 2, 0)
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

