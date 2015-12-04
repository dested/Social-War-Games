
var HexagonColor = function (color) {
  this.color = color;
  this.dark1 = DrawingUtilities.colorLuminance(color, -0.2);
  this.dark2 = DrawingUtilities.colorLuminance(color, -0.4);
  this.dark3 = DrawingUtilities.colorLuminance(color, -0.6);
};


var Point = function (x, y) {
  this.x = x;
  this.y = y;
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


