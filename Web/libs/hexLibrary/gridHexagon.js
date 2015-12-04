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
  return (this.height ) * GridHexagonConstants.depthHeight();
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
  context.strokeStyle = this.hexColor.darkBorder;
  context.stroke(this.$topPath);
  context.fillStyle = this.hexColor.color;
  context.fill(this.$topPath);
};
GridHexagon.prototype.drawIcon = function (context) {

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

