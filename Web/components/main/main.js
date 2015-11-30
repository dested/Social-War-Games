var module = angular.module('ACG.Client');

module.controller('mainCtrl', function ($scope,$http,serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var flat = Layout(layout_flat, Point(1, 1), Point(50, 50));

debugger;
  $http({
    method:"GET",
    url:serviceUrl.path('${api}game/state'),
    extractResponse:'stateData'
  }).then(function(d){
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