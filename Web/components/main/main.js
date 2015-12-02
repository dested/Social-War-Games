var module = angular.module('Social.Client');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var flat = new Layout(layout_flat, new Point(1, 1), new Point(0, 0));

  var canvas = document.getElementById("hex");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvas.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;



    var item = hexBoard.getHexAtPoint(x, y);
    item.hexagon.distance = distance(new Point(20, 20),new Point(item.x, item.z));
    console.log(distance);
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
        if (xItem == 0)continue;

        var $t2 = new GridHexagon();
        $t2.x = x;
        $t2.y = 0;
        $t2.z = y;
        var $t3 = new Hexagon();

        if (x == 20 && y == 20) {
          $t3.hexColor = new HexagonColor('#00FFFF');
        } else {
          $t3.hexColor = new HexagonColor('#FF0000');
        }
        $t3.enabled = true;
        $t3.set_height(xItem);
        $t2.hexagon = $t3;
        hexBoard.$addHexagon($t2);
      }

      hexBoard.$reorderHexList();
    }
  })

});

function distance(p1, p2) {
  var x1 = p1.x;
  var y1 = p1.y;

  var x2 = p2.x;
  var y2 = p2.y;

  var du = x2 - x1;
  var dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
  if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
    return Math.max(Math.abs(du), Math.abs(dv));
  else
    return Math.abs(du) + Math.abs(dv);
}


module.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('main', {
      //abstract: true,
      url: '/',
      controller: 'mainCtrl',
      templateUrl: 'components/main/main.tpl.html'
    })
});