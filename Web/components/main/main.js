var module = angular.module('Social.Client');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard=new HexBoard();




  var canvas = document.getElementById("hex");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  canvas.onclick = function (e)
  {
    var x = e.offsetX;
    var y = e.offsetY;
    hexBoard.clickBoard(x, y);
  };



  var context = canvas.getContext("2d");


  setInterval(function(){
    canvas.width=canvas.width;
    hexBoard.drawBoard(context);
  },1000/60);



  var flat = Layout(layout_flat, Point(1, 1), Point(50, 50));

  $http({
    method: "GET",
    url: serviceUrl.path('${api}game/state'),
    extractResponse: 'stateData'
  }).then(function (d) {
    console.log(d);
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