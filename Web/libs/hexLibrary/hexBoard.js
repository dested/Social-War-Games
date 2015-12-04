
var HexBoard = function () {
  this.hexList = [];
  this.hexBlock = {};
};

HexBoard.prototype.xyToHex = function (clickX, clickY) {
  var size = GridHexagonConstants.width / 2;
  var q = clickX * 2 / 3 / size;
  var r = (-clickX / 3 + Math.sqrt(3) / 3 * (clickY / GridHexagonConstants.heightSkew)) / size;
  var x = q;
  var y = -q - r;
  var z = r;
  var rx = Math.round(x);
  var ry = Math.round(y);
  var rz = Math.round(z);
  var x_diff = Math.abs(rx - x);
  var y_diff = Math.abs(ry - y);
  var z_diff = Math.abs(rz - z);
  if (x_diff > y_diff && x_diff > z_diff) {
    rx = -ry - rz;
  } else if (y_diff > z_diff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  x = rx;
  y = rz + (rx + rx % 2) / 2;
  return new Point(x, y);
};

HexBoard.prototype.xyToHexIndex = function (x, y) {
  return this.hexBlock[x + y * 5000];
};

HexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
  var lastClick = null;
  for (var $t1 = 0; $t1 < this.hexList.length; $t1++) {
    var gridHexagon = this.hexList[$t1];
    var x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
    var z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
    z -= gridHexagon.height * GridHexagonConstants.depthHeight();
    z += gridHexagon.y * GridHexagonConstants.depthHeight();
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonTopPolygon())) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
  }

  return lastClick;
};
HexBoard.prototype.$addHexagon = function (hexagon) {
  this.hexList.push(hexagon);
  this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
  this.$reorderHexList();
};
HexBoard.prototype.$reorderHexList = function () {
  this.hexList = OrderBy(this.hexList, function (m) {
    return (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height
  });
};
function OrderBy(list, callback) {
  var itms = [];
  for (var i = 0; i < list.length; i++) {
    var obj = list[i];
    itms.push({item: obj, val: callback(obj)});
  }
  itms.sort(function compareNumbers(a, b) {
    return a.val - b.val;
  });
  list = [];
  for (var i = 0; i < itms.length; i++) {
    var obj1 = itms[i];
    list.push(obj1.item);
  }
  return list;
}
HexBoard.prototype.drawBoard = function (context) {
  context.save();
  context.lineWidth = 1;
  for (var $t1 = 0; $t1 < this.hexList.length; $t1++) {
    var gridHexagon = this.hexList[$t1];
    this.$drawHexagon(context, gridHexagon);
  }
  context.restore();
};
HexBoard.prototype.$drawHexagon = function (context, gridHexagon) {
  context.save();
  var x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
  var z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
  z += -gridHexagon.height * GridHexagonConstants.depthHeight();
  z += gridHexagon.y * GridHexagonConstants.depthHeight();
  context.translate(x, z);
  gridHexagon.draw(context);
  context.restore();
};
HexBoard.prototype.getPath = function (start, finish) {
  var mypathStart = new Node(null, start);
  var mypathEnd = new Node(null, finish);
  var AStar = [];
  var Open = [mypathStart];
  var Closed = [];
  var result = [];
  var myNeighbours;
  var myNode;
  var myPath;
  var length, max, min, i, j;
  while (length = Open.length) {
    max = Infinity;
    min = -1;
    for (i = 0; i < length; i++) {
      if (Open[i].f < max) {
        max = Open[i].f;
        min = i;
      }
    }
    myNode = Open.splice(min, 1)[0];
    if (myNode.x === mypathEnd.x && myNode.y === mypathEnd.y) {
      myPath = Closed[Closed.push(myNode) - 1];
      do
      {
        result.push(myPath.hexagon);
      }
      while (myPath = myPath.parent);
      AStar = Closed = Open = [];
      result.reverse();
    }
    else {
      myNeighbours = myNode.hexagon.getNeighbors();
      for (i = 0, j = myNeighbours.length; i < j; i++) {
        var n = this.xyToHexIndex(myNeighbours[i].x, myNeighbours[i].y);
        if (!n)continue;
        myPath = new Node(myNode, n);
        if (!AStar[myPath.value()]) {
          myPath.g = myNode.g + distance(n, myNode.hexagon) + (Math.abs((myNode.hexagon.y + myNode.hexagon.height) - (n.y + n.height)) * 5);
          myPath.f = myPath.g + distance(n, finish);
          Open.push(myPath);
          AStar[myPath.value()] = true;
        }
      }
      Closed.push(myNode);
    }
  }
  return result;
};