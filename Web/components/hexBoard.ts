import {GridHexagonConstants} from "./hexLibraries/gridHexagonConstants";
import {GridHexagon} from "./gridHexagon";
import {HexUtils, Node, Vector3d} from "./hexLibraries/hexUtils";
import {SpriteManager} from "./spriteManager";

export class HexBoard {
    hexList: GridHexagon[] = [];
    hexBlock: {[key: number]: GridHexagon} = {};
    boardSize = {width: 0, height: 0};
    spriteManager:SpriteManager;

    gameDimensions(): {width: number,height: number} {
        const size = {width: 0, height: 0};
        size.width = GridHexagonConstants.width * (3 / 4) * this.boardSize.width;
        size.height = GridHexagonConstants.height() * this.boardSize.height;
        return size;
    }


    addHexagon(hexagon: GridHexagon) {
        this.hexList.push(hexagon);
        this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
    }

    reorderHexList() {
        this.hexList = HexUtils.orderBy(this.hexList, m => (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height);
    }

    xyToHexIndex(x, y): GridHexagon {
        return this.hexBlock[x + y * 5000];
    }

    pathFind(start: Vector3d, finish: Vector3d) {
        const myPathStart = new Node(null, start);
        const myPathEnd = new Node(null, finish);
        let aStar = [];
        let open = [myPathStart];
        let closed = [];
        const result: Vector3d[] = [];
        let neighbours;
        let node;
        let path;
        let length, max, min, i, j;
        while (length = open.length) {
            max = Infinity;
            min = -1;
            for (i = 0; i < length; i++) {
                if (open[i].f < max) {
                    max = open[i].f;
                    min = i;
                }
            }
            node = open.splice(min, 1)[0];
            if (node.x === myPathEnd.x && node.y === myPathEnd.y) {
                path = closed[closed.push(node) - 1];
                do {
                    result.push(path.item);
                }
                while (path = path.parent);
                aStar = closed = open = [];
                result.reverse();
            }
            else {
                neighbours = node.item.getNeighbors();
                for (i = 0, j = neighbours.length; i < j; i++) {
                    const n = this.xyToHexIndex(neighbours[i].x, neighbours[i].y);
                    if (!n) continue;
                    if (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) >= 2)
                        continue;
                    path = new Node(node, n);
                    if (!aStar[path.value()]) {
                        path.g = node.g + HexUtils.distance(n, node.item) + (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) * 2);
                        path.f = path.g + HexUtils.distance(n, finish);
                        open.push(path);
                        aStar[path.value()] = true;
                    }
                }
                closed.push(node);
            }
        }
        return result;
    }

}