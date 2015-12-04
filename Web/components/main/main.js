var module = angular.module('Social.Client');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var canvas = document.getElementById("hex");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvas.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;

    var item = hexBoard.getHexAtPoint(x, y);
    if (!item)return;
    var path = hexBoard.getPath(hexBoard.xyToHexIndex(10, 10), item);

    for (var i = 0; i < hexBoard.hexList.length; i++) {
      var h = hexBoard.hexList[i];
      h.onPath = false;
    }
    for (var i = 0; i < path.length; i++) {
      path[i].onPath = true;
    }

  };


  var context = canvas.getContext("2d");

  setInterval(function () {
    canvas.width = canvas.width;
    hexBoard.drawBoard(context);
  }, 1000 / 60);


  $http({
    method: "GET",
    url: serviceUrl.path('${api}game/state'),
    extractResponse: 'stateData'
  }).then(function (state) {
    var str = state.board.boardStr;
    var ys = str.split('|');

    for (var y = 0; y < ys.length; y++) {
      var yItem = ys[y].split('');
      for (var x = 0; x < yItem.length; x++) {
        var xItem = parseInt(yItem[x]);
        if (x == 10 && y == 10)
          xItem = 1;
        if (xItem == 0)continue;

        var gridHexagon = new GridHexagon();
        gridHexagon.board = hexBoard;
        gridHexagon.x = x;
        gridHexagon.y = 0;
        gridHexagon.z = y;
        gridHexagon.height = xItem;

        if (x == 10 && y == 10) {
          gridHexagon.hexColor = new HexagonColor('#00FFFF');
        } else {
          gridHexagon.hexColor = new HexagonColor('#FF0000');
        }
        gridHexagon.buildPaths();
        hexBoard.$addHexagon(gridHexagon);
      }

      hexBoard.$reorderHexList();
    }
  })

});

module.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('main', {
      //abstract: true,
      url: '/',
      controller: 'mainCtrl',
      templateUrl: 'components/main/main.tpl.html'
    })
});