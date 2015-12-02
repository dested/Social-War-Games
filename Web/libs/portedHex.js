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
    if (polygon[i].y > pointY !== polygon[j].y > pointY && pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
      isInside = !isInside;
    }
  }
  return isInside;
};

function GridHexagon() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.hexagon = null;
}
GridHexagon.prototype.click = function () {
  if (this.hexagon.enabled) {
    this.hexagon.set_height(this.hexagon.get_height() + 0.5);
  } else {
    this.hexagon.enabled = true;
  }
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


function Hexagon() {
  this.hexColor = null;
  this.enabled = false;
  this.$height = 0;
  this.$topPath = null;
  this.$leftDepthPath = null;
  this.$bottomDepthPath = null;
  this.$rightDepthPath = null;
}

Hexagon.prototype.get_height = function () {
  return this.$height;
};
Hexagon.prototype.set_height = function (value) {
  this.$height = value;
  this.buildPaths();
};
Hexagon.prototype.get_$depthHeight = function () {
  return (this.$height + 1) * GridHexagonConstants.depthHeight();
};
Hexagon.prototype.buildPaths = function () {
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
Hexagon.prototype.drawLeftDepth = function (context) {
  context.strokeStyle = this.hexColor.dark1;
  context.stroke(this.$leftDepthPath);
  context.fillStyle = this.hexColor.dark1;
  context.fill(this.$leftDepthPath);
};
Hexagon.prototype.drawBottomDepth = function (context) {
  context.strokeStyle = this.hexColor.dark2;
  context.stroke(this.$bottomDepthPath);
  context.fillStyle = this.hexColor.dark2;
  context.fill(this.$bottomDepthPath);
};
Hexagon.prototype.drawRightDepth = function (context) {
  context.strokeStyle = this.hexColor.dark3;
  context.stroke(this.$rightDepthPath);
  context.fillStyle = this.hexColor.dark3;
  context.fill(this.$rightDepthPath);
};
Hexagon.prototype.drawTop = function (context) {
  context.strokeStyle = 'black';
  context.stroke(this.$topPath);
  context.fillStyle = this.hexColor.color;
  context.fill(this.$topPath);
};
Hexagon.prototype.drawIcon = function (context) {
  if(!this.distance)return;
  context.save();
  context.font="10px Georgia";
  context.fillStyle="white";
  context.fillText(this.distance,-5,0);
  context.restore();
};
Hexagon.prototype.draw = function (context) {
  if (this.enabled) {
    context.save();
    this.drawLeftDepth(context);
    this.drawBottomDepth(context);
    this.drawRightDepth(context);
    this.drawTop(context);
    this.drawIcon(context);
    context.restore();
  }
};


var HexagonColor = function (color) {
  this.color = color;
  this.dark1 = DrawingUtilities.colorLuminance(color, -0.2);
  this.dark2 = DrawingUtilities.colorLuminance(color, -0.4);
  this.dark3 = DrawingUtilities.colorLuminance(color, -0.6);
};

var HexBoard = function () {
  this.hexList = [];
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
HexBoard.prototype.getHexAtPoint = function (clickX, clickY) {
  var lastClick = null;
  var ff = this.xyToHex(clickX, clickY);
  for (var $t1 = 0; $t1 < this.hexList.length; $t1++) {
    var gridHexagon = this.hexList[$t1];
    var x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
    var z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
    z -= gridHexagon.hexagon.get_height() * GridHexagonConstants.depthHeight();
    z += gridHexagon.y * GridHexagonConstants.depthHeight();
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonTopPolygon())) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.hexagon.get_height() + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.hexagon.get_height() + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
    if (DrawingUtilities.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.hexagon.get_height() + 1) * GridHexagonConstants.depthHeight()))) {
      lastClick = gridHexagon;
    }
  }

  return lastClick;
};
HexBoard.prototype.$addHexagon = function (hexagon) {
  this.hexList.push(hexagon);
  this.$reorderHexList();
};
HexBoard.prototype.$reorderHexList = function () {
  this.hexList = OrderBy(this.hexList, function (m) {
    return (m.z - m.y) * 1000 + (m.x % 2) * -200 + m.hexagon.get_height()
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
  z += -gridHexagon.hexagon.get_height() * GridHexagonConstants.depthHeight();
  z += gridHexagon.y * GridHexagonConstants.depthHeight();
  context.translate(x, z);
  gridHexagon.hexagon.draw(context);
  context.restore();
};


var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

GridHexagonConstants.heightSkew = 0;
GridHexagonConstants.depthHeightSkew = 0;
GridHexagonConstants.width = 0;
GridHexagonConstants.width = 90;
GridHexagonConstants.heightSkew = .5;
GridHexagonConstants.depthHeightSkew = .2;