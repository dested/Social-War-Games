var module = angular.module('Social.Client');
var baseColor = new HexagonColor('#00C0C2');
var selectedColor = new HexagonColor('#005500');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var canvas = document.getElementById("hex");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  var lItem;
  canvas.onclick = function (e) {
    var x = e.offsetX;
    var y = e.offsetY;

    var item = hexBoard.getHexAtPoint(x, y);
    if (!item)return;



    if(!lItem){
      lItem=item;
      return;
    }

    var path = hexBoard.getPath(lItem, item);
    lItem=item;

    for (var i = 0; i < hexBoard.hexList.length; i++) {
      var h = hexBoard.hexList[i];
      h.hexColor = baseColor;
    }
    for (var i = 0; i < path.length; i++) {
      path[i].hexColor = selectedColor;
    }

  };


  var context = canvas.getContext("2d");

  setInterval(function () {
    canvas.width = canvas.width;
    hexBoard.drawBoard(context);
  }, 1000 / 60);


/*  $http({
    method: "GET",
    url: serviceUrl.path('${api}game/state'),
    extractResponse: 'stateData'
  }).then(function (state) {
    var str = state.board.boardStr;*/
  var str='1111121112013010111322112101221211112212|1121113110130110112131231111121113212111|1121111131111211222111131111103121212131|1211123122231112111111111121111111131112|1112122001111011212321111121121111121211|1111111211113111110111111121121012111212|3101011121132110101221101112111300111122|3111111123112120211211111111311111121112|0020111111111113211111111211110211113311|1111111021111102131111110211113111112121|1111111312111111121111132321101211111101|0112121121021231122112231111301112111112|1201110111111111031212131110101201111011|2321311221111112311121121111130321112110|1111212331113120111121111011002121110101|1232111111011111111131312031111122111110|1121121230111111111122101311112111212111|1011311110113113112010131211121131121231|1111211223121213110113111013211231110211|3111111100110113111112111111012120112130|1101201110222121111111011102111112131113|1113211122000211112111111121111111210013|1111112101111111211221111011113112111121|1302111311111111111113111112101111111011|1313211212111220113321321212112011212110|2211111133102112111112010011112110111111|1100111101001111111101101011011111102012|2111111231111101112233111111111210202201|1111111112113111021311121111112321101111|1132120110111101211121300101311113121113|2121322211111121101122112121212111111211|2110111111112111211201310121121111111111|1111101211011102111111112211111110101111|1111012131121231112321111111110111112111|1113101010011121101110111031222021123121|1211111111211332112123121313211110211211|0313132311212111121113113211201111131220|1311111111111111111111203101311131112111|2111212102111011112111112102023012110120|2111211113231212111011121212121131011210|';

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
  /*})*/

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