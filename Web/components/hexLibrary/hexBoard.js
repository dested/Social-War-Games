function HexBoard() {
  this.hexList = [];
  this.hexBlock = {};
  this.boardSize = {width: 0, height: 0};
  this.viewPort = {x: 0, y: 0, width: 400, height: 400, padding: GridHexagonConstants.width * 2};
}

HexBoard.prototype.xyToHexIndex = function (x, y) {
  return this.hexBlock[x + y * 5000];
};

HexBoard.prototype.resize = function (width, height) {
  this.viewPort.width = width;
  this.viewPort.height = height;
};
HexBoard.prototype.setSize = function (width, height) {
  this.boardSize.width = width;
  this.boardSize.height = height;
};

HexBoard.prototype.offsetView = function (x, y) {
  this.viewPort.x += x;
  this.viewPort.y += y;
  this.constrainViewPort();
};
HexBoard.prototype.setView = function (x, y) {
  this.viewPort.x = x;
  this.viewPort.y = y;
};
HexBoard.prototype.constrainViewPort = function (x, y) {
  this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding)
  this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding)
  var size = this.gameDimensions();

  this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width)
  this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height)
};


HexBoard.prototype.gameDimensions = function () {
  var size = {};
  size.width = GridHexagonConstants.width * 3 / 4 * this.boardSize.width;
  size.height = GridHexagonConstants.height() * this.boardSize.height;
  return size;
};


HexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
  var lastClick = null;
  clickX += this.viewPort.x;
  clickY += this.viewPort.y;

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
};
HexBoard.prototype.reorderHexList = function () {
  this.hexList = orderBy(this.hexList, function (m) {
    return (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.height
  });
};
HexBoard.prototype.drawBoard = function (context) {
  context.save();
  context.translate(-this.viewPort.x, -this.viewPort.y);
  context.lineWidth = 1;
  for (var i = 0; i < this.hexList.length; i++) {
    var gridHexagon = this.hexList[i];
    this.drawHexagon(context, gridHexagon);
  }
  context.restore();
};
HexBoard.prototype.drawHexagon = function (context, gridHexagon) {

  var x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
  var z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);

  z -= gridHexagon.height * GridHexagonConstants.depthHeight();
  z += gridHexagon.y * GridHexagonConstants.depthHeight();

  if (!(x > this.viewPort.x - this.viewPort.padding &&
    x < this.viewPort.x + this.viewPort.width + this.viewPort.padding &&
    z > this.viewPort.y - this.viewPort.padding &&
    z < this.viewPort.y + this.viewPort.height + this.viewPort.padding)) {
    return;
  }

  context.save();
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
        if (Math.abs((node.item.y + node.item.height) - (n.y + n.height)) >= 2)
          continue;
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