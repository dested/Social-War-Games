
var HexBoard = function () {
  this.hexList = [];
  this.hexBlock = {};
};

HexBoard.prototype.xyToHexIndex = function (x, y) {
  return this.hexBlock[x + y * 5000];
};

HexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
  var lastClick = null;
  for (var i = 0; i < this.hexList.length; i++) {
    var gridHexagon = this.hexList[i];
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
HexBoard.prototype.addHexagon = function (hexagon) {
  this.hexList.push(hexagon);
  this.hexBlock[hexagon.x + hexagon.z * 5000] = hexagon;
  this.reorderHexList();
};
HexBoard.prototype.reorderHexList = function () {
  this.hexList = orderBy(this.hexList, function (m) {
    return (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height
  });
};
HexBoard.prototype.drawBoard = function (context) {
  context.save();
  context.lineWidth = 1;
  for (var i = 0; i < this.hexList.length; i++) {
    var gridHexagon = this.hexList[i];
    this.drawHexagon(context, gridHexagon);
  }
  context.restore();
};
HexBoard.prototype.drawHexagon = function (context, gridHexagon) {
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
  var aStar = [];
  var open = [mypathStart];
  var closed = [];
  var result = [];
  var neighbours;
  var node;
  var path;
  var length, max, min, i, j;
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
    if (node.x === mypathEnd.x && node.y === mypathEnd.y) {
      path = closed[closed.push(node) - 1];
      do
      {
        result.push(path.item);
      }
      while (path = path.parent);
      aStar = closed = open = [];
      result.reverse();
    }
    else {
      neighbours = node.item.getNeighbors();
      for (i = 0, j = neighbours.length; i < j; i++) {
        var n = this.xyToHexIndex(neighbours[i].x, neighbours[i].y);
        if (!n)continue;
        path = new Node(node, n);
        if (!aStar[path.value()]) {
          path.g = node.g + distance(n, node.item) + (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) * 2);
          path.f = path.g + distance(n, finish);
          open.push(path);
          aStar[path.value()] = true;
        }
      }
      closed.push(node);
    }
  }
  return result;
};