
import {GridHexagonConstants} from "./hexLibraries/gridHexagonConstants";

export class GridHexagon {
    x = 0;
    y = 0;
    z = 0;
    height = 0;
    heightOffset = 0;

    getRealX(){
        return  GridHexagonConstants.width * 3 / 4 * this.x;
    }

    getRealY(){
        let y = this.z * GridHexagonConstants.height() + ((this.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
        y -= this.getDepthHeight();
        y += this.y * GridHexagonConstants.depthHeight();
        return  y;
    }

    getDepthHeight() {
        return Math.max(1, (this.height + this.heightOffset) * GridHexagonConstants.depthHeight());
    }

}