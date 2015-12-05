window.assetManager = new AssetManager(startApp);
window.assetManager.addAsset('castle', 'images/castle.png');
window.assetManager.start();




function startApp() {
  var module = angular.module('Social.Client', [
    'ui.router'
  ]);


  module.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });

  module.config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
}