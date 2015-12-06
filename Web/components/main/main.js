var module = angular.module('SocialWarGames.Client');
var baseColor = new HexagonColor('#FFFFFF');

var selectedColor = new HexagonColor('#005500');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var canvas = document.getElementById("hex");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  hexBoard.resize(canvas.width, canvas.height);

  var lItem;
  canvas.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;

    var item = hexBoard.getHexAtPoint(x, y);
    if (!item)return;


    if (!lItem) {
      lItem = item;
      return;
    }

    var path = hexBoard.getPath(lItem, item);
    lItem = item;

    for (var i = 0; i < hexBoard.hexList.length; i++) {
      var h = hexBoard.hexList[i];
      h.setHighlight(null);
    }
    for (var i = 0; i < path.length; i++) {
      path[i].setHighlight(selectedColor);
    }

  };


  var context = canvas.getContext("2d");

  setInterval(function () {
    canvas.width = canvas.width;
    //hexBoard.offsetView(10,10);
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

        if (xItem == 0)continue;

        var gridHexagon = new GridHexagon();
        gridHexagon.board = hexBoard;
        gridHexagon.x = x;
        gridHexagon.y = 0;
        gridHexagon.z = y;
        gridHexagon.height = xItem;
        gridHexagon.hexColor = baseColor;
        gridHexagon.buildPaths();
        hexBoard.addHexagon(gridHexagon);
      }
    }

    for (var i = 0; i < state.factions.length; i++) {
      var faction = state.factions[i];
      var fColor = new HexagonColor(faction.color);
      for (var j = 0; j < faction.units.length; j++) {
        var unit = faction.units[j];
        var gridHexagon = hexBoard.xyToHexIndex(unit.x, unit.y);
        if (!gridHexagon)continue;
        gridHexagon.setColor(fColor);
        gridHexagon.setIcon(unit.unitType);
      }
    }

  });

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