var module = angular.module('SocialWarGames.Client');
var baseColor = new HexagonColor('#FFFFFF');

var selectedColor = new HexagonColor('#005500');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var canvas = document.getElementById("hex");


  var hammertime = new Hammer(canvas);


  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  hexBoard.resize(canvas.width, canvas.height);


  var swipeVelocity = {x: 0, y: 0};

  hammertime.on('pan', function (ev) {
    //hexBoard.offsetView(-ev.deltaX/10, -ev.deltaY/10);
    swipeVelocity.x = ev.velocityX*10;
    swipeVelocity.y = ev.velocityY*10;

    if(Math.abs(swipeVelocity.y)>60){
      //swipeVelocity.y=10*Math.sign(swipeVelocity.y);
    }
    if(Math.abs(swipeVelocity.x)>60){
      //swipeVelocity.x=10*Math.sign(swipeVelocity.x);
    }
  });

  setInterval(function () {
    //return;
    if (swipeVelocity.x != 0) {

      hexBoard.offsetView(swipeVelocity.x, 0);

      if (swipeVelocity.x > 0) {
        swipeVelocity.x -= 0.6;
        if (swipeVelocity.x < 0) {
          swipeVelocity.x = 0;
        }
      }


      if (swipeVelocity.x < 0) {
        swipeVelocity.x += 0.6;
        if (swipeVelocity.x > 0) {
          swipeVelocity.x = 0;
        }
      }

    }


    if (swipeVelocity.y != 0) {

      hexBoard.offsetView(0, swipeVelocity.y);

      if (swipeVelocity.y > 0) {
        swipeVelocity.y -= 0.6;
        if (swipeVelocity.y < 0) {
          swipeVelocity.y = 0;
        }
      }

      if (swipeVelocity.y < 0) {
        swipeVelocity.y += 0.6;
        if (swipeVelocity.y > 0) {
          swipeVelocity.y = 0;
        }
      }

    }


  }, 1000 / 60);


  var lItem;
  hammertime.on('tap', function (ev) {
    var x = ev.center.x;
    var y = ev.center.y;

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
  });


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


    var factionColors = [];
    for (var i = 0; i < state.factions.length; i++) {
      var faction = state.factions[i];
      factionColors[i] = new HexagonColor(faction.color);
    }


    var ys = str.split('|');

    for (var y = 0; y < ys.length; y++) {
      var yItem = ys[y].split('');
      for (var x = 0; x < yItem.length; x += 2) {
        var xItem = parseInt(yItem[x]);
        if (xItem == 0)continue;
        var factionIndex = parseInt(yItem[x + 1]);


        var gridHexagon = new GridHexagon();
        gridHexagon.board = hexBoard;
        gridHexagon.x = x / 2;
        gridHexagon.y = 0;
        gridHexagon.z = y;
        gridHexagon.height = xItem;
        if (factionIndex == 0) {
          gridHexagon.hexColor = baseColor;

        } else {
          gridHexagon.hexColor = factionColors[factionIndex - 1];
        }
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