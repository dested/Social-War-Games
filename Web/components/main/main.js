var module = angular.module('SocialWarGames.Client');
var baseColor = new HexagonColor('#FFFFFF');

var highlightColor = new HexagonColor('#51F9FF');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};

  var hexBoard = new HexBoard();

  var canvas = document.getElementById("hex");
  var menu = document.getElementById("menu");

  var menuManager = new MenuManager(menu);

  var overlay = document.getElementById("overlay");

  var mc = new Hammer.Manager(overlay);
  mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
  mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
  mc.add(new Hammer.Tap());

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';

  hexBoard.resize(canvas.width, canvas.height);


  var swipeVelocity = {x: 0, y: 0};
  var tapStart = {x: 0, y: 0};

  mc.on('panstart', function (ev) {
    menuManager.closeMenu();

    //hexBoard.offsetView(-ev.deltaX/10, -ev.deltaY/10);
    swipeVelocity.x = swipeVelocity.y = 0;
    tapStart.x = hexBoard.viewPort.x;
    tapStart.y = hexBoard.viewPort.y;
    hexBoard.setView(tapStart.x - ev.deltaX, tapStart.y - ev.deltaY);
  });
  mc.on('panmove', function (ev) {
    hexBoard.setView(tapStart.x - ev.deltaX, tapStart.y - ev.deltaY);
  });

  mc.on('swipe', function (ev) {
    menuManager.closeMenu();
    swipeVelocity.x = ev.velocityX * 10;
    swipeVelocity.y = ev.velocityY * 10;
  });


  var lItem;
  mc.on('tap', function (ev) {
    var x = ev.center.x;
    var y = ev.center.y;
    swipeVelocity.x = swipeVelocity.y = 0;


    if (menuManager.tap(x, y)) {
      return;
    }
    menuManager.closeMenu();

    for (var i = 0; i < hexBoard.hexList.length; i++) {
      var h = hexBoard.hexList[i];
      h.setHighlight(null);
    }

    var item = hexBoard.getHexAtPoint(x, y);
    if (!item)return;

    if (item.unit) {
      menuManager.openMenu([
        {image: window.assetManager.assets['Icon.Move'].image, action: 'move'},
        {image: window.assetManager.assets['Icon.Attack'].image, action: 'attack'}
      ], {x: x, y: y}, function (selectedItem) {
        console.log(selectedItem.action);
        item.setHighlight(highlightColor);
        menuManager.closeMenu();
      });
      return;
    } else {
      return;
    }
    if (!lItem) {
      lItem = item;
    }

    var path = hexBoard.pathFind(lItem, item);

    if (path.length == 0) {
      path.push(item);
    }

    lItem = item;


    for (var i = 0; i < path.length; i++) {
      path[i].setHighlight(highlightColor);
    }
  });


  var context = canvas.getContext("2d");

  function draw() {
    requestAnimationFrame(draw);
    tick();
    canvas.width = canvas.width;
    hexBoard.drawBoard(context);
    menuManager.draw();
  }

  function tick() {
    if (Math.abs(swipeVelocity.x) > 0) {
      var sign = Math.sign(swipeVelocity.x);
      swipeVelocity.x += 0.7 * -sign;
      if (Math.sign(swipeVelocity.x) != sign) {
        swipeVelocity.x = 0;
      }
    }

    if (Math.abs(swipeVelocity.y) > 0) {
      var sign = Math.sign(swipeVelocity.y);
      swipeVelocity.y += 0.7 * -sign;
      if (Math.sign(swipeVelocity.y) != sign) {
        swipeVelocity.y = 0;
      }
    }
    hexBoard.offsetView(swipeVelocity.x, swipeVelocity.y);

  }

  draw();


  $http({
    method: "GET",
    url: serviceUrl.path('${api}game/state'),
    extractResponse: 'stateData'
  }).then(function (state) {


    hexBoard.initialize(state);

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
