var module=angular.module('ACG.Client',[
  'ui.router'
]);


module.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});

module.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});