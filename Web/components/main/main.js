var module = angular.module('SocialWarGames.Client');
var baseColor = new HexagonColor('#FFFFFF');

var selectedColor = new HexagonColor('#BCFFF2');

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
  var tapStart = {x: 0, y: 0};

  hammertime.on('panstart', function (ev) {
    //hexBoard.offsetView(-ev.deltaX/10, -ev.deltaY/10);
    tapStart.x=hexBoard.viewPort.x;
    tapStart.y=hexBoard.viewPort.y;
    hexBoard.viewPort.x=tapStart.x-ev.deltaX;
    hexBoard.viewPort.y=tapStart.y-ev.deltaY;
  });
  hammertime.on('panmove', function (ev) {
    hexBoard.viewPort.x=tapStart.x-ev.deltaX;
    hexBoard.viewPort.y=tapStart.y-ev.deltaY;
  });



  var lItem;
  hammertime.on('tap', function (ev) {
    var x = ev.center.x;
    var y = ev.center.y;

    var item = hexBoard.getHexAtPoint(x, y);
    if (!item)return;


    if (!lItem) {
      lItem = item;
    }

    var path = hexBoard.getPath(lItem, item);

    if(path.length==0){
      path.push(item);
    }

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

  function draw(){
    requestAnimationFrame(draw);

    canvas.width = canvas.width;
    hexBoard.drawBoard(context);
  }
  draw();


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