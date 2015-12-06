function GridHexagon() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.height = 0;

  this.icon = null;

  this.highlightColor = null;
  this.hexColor = null;
  this.topPath = null;
  this.leftDepthPath = null;
  this.bottomDepthPath = null;
  this.rightDepthPath = null;
  this.drawCache = null;
}

GridHexagon.prototype.getDepthHeight = function () {
  return (this.height ) * GridHexagonConstants.depthHeight();
};

GridHexagon.prototype.setIcon = function (name) {
  this.icon = window.assetManager.assets[name];
  this.invalidate();
};

GridHexagon.prototype.setColor = function (hexColor) {
  if (this.hexColor != hexColor) {
    this.hexColor = hexColor;
    this.invalidate();
  }
};

GridHexagon.prototype.setHighlight = function (hexColor) {
  if (this.highlightColor != hexColor) {
    this.highlightColor = hexColor;
    this.invalidate();
  }
};

GridHexagon.prototype.buildPaths = function () {
  var depthHeight = this.getDepthHeight();
  this.topPath = buildPath(GridHexagonConstants.hexagonTopPolygon());
  this.leftDepthPath = buildPath(GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight));
  this.bottomDepthPath = buildPath(GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight));
  this.rightDepthPath = buildPath(GridHexagonConstants.hexagonDepthRightPolygon(depthHeight));
};

function buildPath(path) {
  var p2d = new Path2D();
  for (var i = 0; i < path.length; i++) {
    var point = path[i];
    p2d.lineTo(point.x, point.y);
  }
  return p2d;
}

GridHexagon.prototype.$getDrawingColor = function () {
  return this.highlightColor || this.hexColor;
};

GridHexagon.prototype.drawLeftDepth = function (context) {
  context.strokeStyle = this.$getDrawingColor().dark1;
  context.stroke(this.leftDepthPath);
  context.fillStyle = this.$getDrawingColor().dark1;
  context.fill(this.leftDepthPath);
};
GridHexagon.prototype.drawBottomDepth = function (context) {
  context.strokeStyle = this.$getDrawingColor().dark2;
  context.stroke(this.bottomDepthPath);
  context.fillStyle = this.$getDrawingColor().dark2;
  context.fill(this.bottomDepthPath);
};
GridHexagon.prototype.drawRightDepth = function (context) {
  context.strokeStyle = this.$getDrawingColor().dark3;
  context.stroke(this.rightDepthPath);
  context.fillStyle = this.$getDrawingColor().dark3;
  context.fill(this.rightDepthPath);
};
GridHexagon.prototype.drawTop = function (context) {
  /*
   if ((this.y + this.height) != 1)
   context.strokeStyle = this.$getDrawingColor().darkBorder;
   else
   context.strokeStyle = this.$getDrawingColor().color;
   */
  context.strokeStyle = this.$getDrawingColor().darkBorder;
  context.stroke(this.topPath);
  context.fillStyle = this.$getDrawingColor().color;
  context.fill(this.topPath);
};
GridHexagon.prototype.drawIcon = function (context) {
  if (this.icon) {
    context.save();
    context.translate(-this.icon.base.x, -this.icon.base.y);
    context.drawImage(this.icon.image, 0, 0, this.icon.size.width, this.icon.size.height);
    context.restore();
  }
};
GridHexagon.prototype.invalidate = function () {
  this.drawCache = null;
};

GridHexagon.prototype.envelope = function () {
  var size = {};
  size.width = GridHexagonConstants.width;
  size.height = GridHexagonConstants.height();

  if (this.icon) {
    size.height = Math.max(size.height, this.icon.base.y + size.height / 2);
  }

  size.height += this.getDepthHeight();
  return size;
};

GridHexagon.prototype.hexCenter = function () {
  var center = GridHexagonConstants.height() / 2;
  if (this.icon) {
    return Math.max(center, this.icon.base.y);
  }

  return center;
};

var caches = {};
function getCacheImage(height, icon, hexColor) {
  var c = (icon?icon.name:'') + "-" + height + "-" + hexColor.color;
  return caches[c]
}
function setCacheImage(height, icon, hexColor, img) {
  var c = (icon?icon.name:'') + "-" + height + "-" + hexColor.color;
  caches[c] = img;
}

GridHexagon.prototype.draw = function (context) {

  if (this.drawCache) {
    context.drawImage(this.drawCache, -this.drawCache.width / 2, -this.hexCenter());
    //this.drawCache=null;
  } else {
    var c = getCacheImage(this.height, this.icon ? this.icon.name : '', this.highlightColor||this.hexColor);
    if (!c) {
      var can = document.createElement('canvas');
      var ctx = can.getContext('2d');

      var size = this.envelope();
      can.width = size.width;
      can.height = size.height;
      ctx.save();

      ctx.translate(size.width / 2, this.hexCenter());
      this.drawLeftDepth(ctx);
      this.drawBottomDepth(ctx);
      this.drawRightDepth(ctx);
      this.drawTop(ctx);
      this.drawIcon(ctx);
      ctx.restore();

      setCacheImage(this.height, this.icon ? this.icon.name : '', this.hexColor.color,can);
      /*
       ctx.strokeStyle='black';
       ctx.lineWidth=1;
       ctx.strokeRect(0,0,can.width,can.height);*/
      this.drawCache = can;

    }else{
      this.drawCache = c;
    }
    this.draw(context);
  }
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

