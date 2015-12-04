DrawingUtilities = {};
DrawingUtilities.drawCircle = function (context) {
  context.beginPath();
  context.arc(0, 0, 5, 0, 2 * Math.PI, false);
  context.fillStyle = 'black';
  context.fill();
  context.lineWidth = 5;
  context.stroke();
};
DrawingUtilities.colorLuminance = function (hex, lum) {
  // validate hex string
  hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
  // convert to decimal and change luminosity
  var rgb = '#';
  for (var i = 0; i < 3; i++) {
    var c = parseInt(hex.substr(i * 2, 2), 16);
    var cs = (Math.round(Math.min(Math.max(0, c + c * lum), 255)) | 0).toString(16);
    rgb += ('00' + cs).substr(cs.length);
  }
  return rgb;
};
DrawingUtilities.pointInPolygon = function (pointX, pointY, polygon) {
  var isInside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (polygon[i].y > pointY !== polygon[j].y > pointY &&
      pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
      isInside = !isInside;
    }
  }
  return isInside;
};

function GridHexagon() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.height = 0;

  this.hexColor = null;
  this.$topPath = null;
  this.$leftDepthPath = null;
  this.$bottomDepthPath = null;
  this.$rightDepthPath = null;
}


GridHexagon.prototype.get_$depthHeight = function () {
  return (this.height + 1) * GridHexagonConstants.depthHeight();
};
GridHexagon.prototype.buildPaths = function () {
  this.$topPath = new Path2D();
  var $t1 = GridHexagonConstants.hexagonTopPolygon();
  for (var $t2 = 0; $t2 < $t1.length; $t2++) {
    var point = $t1[$t2];
    this.$topPath.lineTo(point.x, point.y);
  }
  this.$leftDepthPath = new Path2D();
  var $t3 = GridHexagonConstants.hexagonDepthLeftPolygon(this.get_$depthHeight());
  for (var $t4 = 0; $t4 < $t3.length; $t4++) {
    var point1 = $t3[$t4];
    this.$leftDepthPath.lineTo(point1.x, point1.y);
  }
  this.$bottomDepthPath = new Path2D();
  var $t5 = GridHexagonConstants.hexagonDepthBottomPolygon(this.get_$depthHeight());
  for (var $t6 = 0; $t6 < $t5.length; $t6++) {
    var point2 = $t5[$t6];
    this.$bottomDepthPath.lineTo(point2.x, point2.y);
  }
  this.$rightDepthPath = new Path2D();
  var $t7 = GridHexagonConstants.hexagonDepthRightPolygon(this.get_$depthHeight());
  for (var $t8 = 0; $t8 < $t7.length; $t8++) {
    var point3 = $t7[$t8];
    this.$rightDepthPath.lineTo(point3.x, point3.y);
  }
};
GridHexagon.prototype.drawLeftDepth = function (context) {
  context.strokeStyle = this.hexColor.dark1;
  context.stroke(this.$leftDepthPath);
  context.fillStyle = this.hexColor.dark1;
  context.fill(this.$leftDepthPath);
};
GridHexagon.prototype.drawBottomDepth = function (context) {
  context.strokeStyle = this.hexColor.dark2;
  context.stroke(this.$bottomDepthPath);
  context.fillStyle = this.hexColor.dark2;
  context.fill(this.$bottomDepthPath);
};
GridHexagon.prototype.drawRightDepth = function (context) {
  context.strokeStyle = this.hexColor.dark3;
  context.stroke(this.$rightDepthPath);
  context.fillStyle = this.hexColor.dark3;
  context.fill(this.$rightDepthPath);
};
GridHexagon.prototype.drawTop = function (context) {
  context.strokeStyle = 'black';
  context.stroke(this.$topPath);
  context.fillStyle = this.hexColor.color;
  context.fill(this.$topPath);
};
GridHexagon.prototype.drawIcon = function (context) {
  if (!this.onPath)return;

  context.strokeStyle = 'black';
  context.stroke(this.$topPath);
  context.fillStyle = "blue";
  context.fill(this.$topPath);
};
GridHexagon.prototype.draw = function (context) {
  context.save();
  this.drawLeftDepth(context);
  this.drawBottomDepth(context);
  this.drawRightDepth(context);
  this.drawTop(context);
  this.drawIcon(context);
  context.restore();
};
GridHexagon.prototype.getNeighbors = function () {

  var neighbors = [];

  if ((this.x % 2 === 0)) {
    neighbors.push({x: this.x - 1, y: this.z});
    neighbors.push({x: this.x, y: this.z - 1});
    neighbors.push({x: this.x + 1, y: this.z});

    neighbors.push({x: this.x - 1, y: this.z + 1});
    neighbors.push({x: this.x, y: this.z + 1});
    neighbors.push({x: this.x + 1, y: this.z + 1});
  } else {
    neighbors.push({x: this.x - 1, y: this.z - 1});
    neighbors.push({x: this.x, y: this.z - 1});
    neighbors.push({x: this.x + 1, y: this.z - 1});

    neighbors.push({x: this.x - 1, y: this.z});
    neighbors.push({x: this.x, y: this.z + 1});
    neighbors.push({x: this.x + 1, y: this.z});
  }
  return neighbors;
};


GridHexagonConstants = {};


GridHexagonConstants.height = function () {
  return Math.sqrt(3) / 2 * GridHexagonConstants.width * GridHexagonConstants.heightSkew;
};
GridHexagonConstants.depthHeight = function () {
  return GridHexagonConstants.height() * GridHexagonConstants.depthHeightSkew;
};
GridHexagonConstants.hexagonTopPolygon = function () {
  return [new Point(-GridHexagonConstants.width / 2, 0), new Point(-GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, -GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 2, 0), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 2, 0)];
};
GridHexagonConstants.hexagonDepthLeftPolygon = function (depthHeight) {
  return [new Point(-GridHexagonConstants.width / 2, 0), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight), new Point(-GridHexagonConstants.width / 2, depthHeight), new Point(-GridHexagonConstants.width / 2, 0)];
};
GridHexagonConstants.hexagonDepthBottomPolygon = function (depthHeight) {
  return [new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2 + depthHeight), new Point(-GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
};
GridHexagonConstants.hexagonDepthRightPolygon = function (depthHeight) {
  return [new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 2, 0), new Point(GridHexagonConstants.width / 2, depthHeight), new Point(GridHexagonConstants.width / 4, depthHeight + GridHexagonConstants.height() / 2), new Point(GridHexagonConstants.width / 4, GridHexagonConstants.height() / 2)];
};





var HexagonColor = function (color) {
  this.color = color;
  this.dark1 = DrawingUtilities.colorLuminance(color, -0.2);
  this.dark2 = DrawingUtilities.colorLuminance(color, -0.4);
  this.dark3 = DrawingUtilities.colorLuminance(color, -0.6);
};

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


// create Nodes from the Start and End x,y coordinates
  var mypathStart = new Node(null, start);
  var mypathEnd = new Node(null, finish);
// create an array that will contain all world cells
  var AStar = [];
// list of currently open Nodes
  var Open = [mypathStart];
// list of closed Nodes
  var Closed = [];
// list of the final output array
  var result = [];
// reference to a Node (that is nearby)
  var myNeighbours;
// reference to a Node (that we are considering now)
  var myNode;
// reference to a Node (that starts a path in question)
  var myPath;
// temp integer variables used in the calculations
  var length, max, min, i, j;
// iterate through the open list until none are left
  while (length = Open.length) {
    max = Infinity;
    min = -1;
    for (i = 0; i < length; i++) {
      if (Open[i].f < max) {
        max = Open[i].f;
        min = i;
      }
    }
    // grab the next node and remove it from Open array
    myNode = Open.splice(min, 1)[0];
    // is it the destination node?
    if (myNode.x === mypathEnd.x && myNode.y === mypathEnd.y) {
      myPath = Closed[Closed.push(myNode) - 1];
      do
      {
        result.push(myPath.hexagon);
      }
      while (myPath = myPath.parent);
      // clear the working arrays
      AStar = Closed = Open = [];
      // we want to return start to finish
      result.reverse();
    }
    else // not the destination
    {
      // find which nearby nodes are walkable
      myNeighbours = myNode.hexagon.getNeighbors();
      // test each one that hasn't been tried already
      for (i = 0, j = myNeighbours.length; i < j; i++) {

        var n = this.xyToHexIndex(myNeighbours[i].x, myNeighbours[i].y);
        if (!n)continue;

        myPath = new Node(myNode, n);
        if (!AStar[myPath.value()]) {
          // estimated cost of this particular route so far
          myPath.g = myNode.g + distance(n, myNode.hexagon)+(Math.abs((myNode.hexagon.y+myNode.hexagon.height)- (n.y+n.height))*5);
          // estimated cost of entire guessed route to the destination
          myPath.f = myPath.g + distance(n, finish);
          // remember this new path for testing above
          Open.push(myPath);
          // mark this node in the world graph as visited
          AStar[myPath.value()] = true;
        }
      }
      // remember this route as having no more untested options
      Closed.push(myNode);
    }
  } // keep iterating until until the Open list is empty
  return result;


};
function Node(parent, piece) {
  this.parent = parent;
  // array index of this Node in the world linear array

  // the location coordinates of this Node
  this.x = piece.x;
  this.y = piece.z;
  this.hexagon = piece;
  // the distanceFunction cost to get
  // TO this Node from the START
  this.f = 0;
  // the distanceFunction cost to get
  // from this Node to the GOAL
  this.g = 0
}

Node.prototype.value = function () {
  return this.x + (this.y * 5000)
};

function distance(p1, p2) {
  var x1 = p1.x;
  var y1 = p1.z;

  var x2 = p2.x;
  var y2 = p2.z;

  var du = x2 - x1;
  var dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
  if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
    return Math.max(Math.abs(du), Math.abs(dv));
  else
    return Math.abs(du) + Math.abs(dv);
}


var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

GridHexagonConstants.width = 70;
GridHexagonConstants.heightSkew = .7;
GridHexagonConstants.depthHeightSkew = .2;