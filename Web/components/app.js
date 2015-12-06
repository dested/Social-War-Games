var module = angular.module('SocialWarGames.Client', [
  'ui.router'
]);

window.assetManager = new AssetManager(startApp);
var size = {width: 80, height: 80};
var base = {x: 40, y: 55};
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


  angular.bootstrap(document, ['SocialWarGames.Client']);
}


var maybePreventPullToRefresh = false;
var lastTouchY = 0;
var touchstartHandler = function (e) {
  if (e.touches.length != 1) return;
  lastTouchY = e.touches[0].clientY;
  // Pull-to-refresh will only trigger if the scroll begins when the
  // document's Y offset is zero.
  maybePreventPullToRefresh =    window.pageYOffset == 0;
};

var touchmoveHandler = function (e) {
  var touchY = e.touches[0].clientY;
  var touchYDelta = touchY - lastTouchY;
  lastTouchY = touchY;

  if (maybePreventPullToRefresh) {
    maybePreventPullToRefresh = false;
    if (touchYDelta > 0) {
      e.preventDefault();
      return;
    }
  }

  if (window.pageYOffset == 0 && touchYDelta > 0) {
    e.preventDefault();
    return;
  }
};

document.addEventListener('touchstart', touchstartHandler, false);
document.addEventListener('touchmove', touchmoveHandler, false);