var module = angular.module('SocialWarGames.Client', [
  'ui.router'
]);

window.assetManager = new AssetManager(startApp);
var size = {width:50,height:50};
var base = {x:25,y:32};
window.assetManager.addAsset('Infantry', 'images/tower_10.png', size, base);
window.assetManager.addAsset('Tank', 'images/tower_40.png', size, base);
window.assetManager.addAsset('Base', 'images/tower_42.png', size, base);
window.assetManager.start();


function startApp() {

  module.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });

  module.config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
}