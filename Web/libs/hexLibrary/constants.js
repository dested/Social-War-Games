
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



GridHexagonConstants.width = 70;
GridHexagonConstants.heightSkew = .7;
GridHexagonConstants.depthHeightSkew = .3;
GridHexagonConstants.depthHeightSkew = .3;