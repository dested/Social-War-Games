var module = angular.module('SocialWarGames.Client');
var baseColor = new HexagonColor('#FFFFFF');

var highlightColor = new HexagonColor('#51F9FF');
var selectedHighlightColor = new HexagonColor('#51F900');

var moveHighlightColor = new HexagonColor('#99F920');
var attackHighlightColor = new HexagonColor('#91F9CF');

module.controller('mainCtrl', function ($scope, $http, serviceUrl) {
  $scope.model = {};
  $scope.callback = {};
  var possiblePoints = [];

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
    if (menuManager.isOpen) {
      return false;
    }
    menuManager.closeMenu();
    swipeVelocity.x = swipeVelocity.y = 0;
    tapStart.x = hexBoard.viewPort.x;
    tapStart.y = hexBoard.viewPort.y;
    hexBoard.setView(tapStart.x - ev.deltaX, tapStart.y - ev.deltaY);
  });
  mc.on('panmove', function (ev) {
    if (menuManager.isOpen) {
      return false;
    }
    hexBoard.setView(tapStart.x - ev.deltaX, tapStart.y - ev.deltaY);
  });

  mc.on('swipe', function (ev) {
    if (menuManager.isOpen) {
      return false;
    }
    menuManager.closeMenu();
    swipeVelocity.x = ev.velocityX * 10;
    swipeVelocity.y = ev.velocityY * 10;
  });

  var selectedItem;
  var currentState = 'none';

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

    if (currentState == 'highlighting') {
      for (var p = 0; p < possiblePoints.length; p++) {
        var pItem = possiblePoints[p];
        if (pItem == item) {
          item.setUnit(selectedItem.unit);
          item.setColor(selectedItem.hexColor);
          selectedItem.setUnit(null);
          break;
        }
      }
      currentState = 'none';
      return;
    }


    selectedItem = null;
    currentState = 'none';
    if (item.unit) {
      currentState = 'highlighted';
      item.setHighlight(highlightColor);
      selectedItem = item;

      menuManager.openMenu([
        {image: window.assetManager.assets['Icon.Move'].image, action: 'Move'},
        {image: window.assetManager.assets['Icon.Attack'].image, action: 'Attack'}
      ], {x: x, y: y}, function (selectedItem) {
        item.setHighlight(selectedHighlightColor);
        menuManager.closeMenu();
        startAction(item, selectedItem.action);
        currentState = 'highlighting';
      });
    }
  });

  function startAction(item, action) {
    possiblePoints = [];
    switch (item.unit) {
      case 'Infantry':
        switch (action) {
          case "Move":
            var radius = 2;
            var spots = findAvailableSpots(radius, item);
            for (var i = 0; i < spots.length; i++) {
              var spot = spots[i];
              if (spot == item || spot.unit)continue;
              var path = hexBoard.pathFind(item, spot);

              if (path.length > 0 && path.length <= radius + 1) {
                possiblePoints.push(spot);
                spot.setHighlight(moveHighlightColor);
              }
            }
            break;
          case "Attack":
            var radius = 2;
            var spots = findAvailableSpots(radius, item);
            for (var i = 0; i < spots.length; i++) {
              var spot = spots[i];
              if (spot == item)continue;
              if (!spot.unit || item.hexColor == spot.hexColor) {
                continue;
              }
              var path = hexBoard.pathFind(item, spot);

              if (path.length > 1 && path.length <= radius + 1) {
                possiblePoints.push(spot);
                spot.setHighlight(attackHighlightColor);
              }
            }
            break;
        }
        break;
      case 'Tank':
        switch (action) {
          case "Move":
            var radius = 5;
            var spots = findAvailableSpots(radius, item);
            for (var i = 0; i < spots.length; i++) {
              var spot = spots[i];
              if (spot == item || spot.unit)continue;
              var path = hexBoard.pathFind(item, spot);

              if (path.length > 1 && path.length <= radius + 1) {
                possiblePoints.push(spot);
                spot.setHighlight(moveHighlightColor);
              }
            }
            break;
          case "Attack":
            var radius = 5;
            var spots = findAvailableSpots(radius, item);
            for (var i = 0; i < spots.length; i++) {
              var spot = spots[i];
              if (spot == item)continue;
              if (!spot.unit || item.hexColor == spot.hexColor) {
                continue;
              }


              var path = hexBoard.pathFind(item, spot);

              if (path.length > 1 && path.length <= radius + 1) {
                possiblePoints.push(spot);
                spot.setHighlight(attackHighlightColor);
              }
            }
            break;
        }
        break;
      case 'Base':
        break;
    }
  }

  function findAvailableSpots(radius, center) {
    var items = [];
    for (var q = 0; q < hexBoard.hexList.length; q++) {
      var item = hexBoard.hexList[q];
      if (distance(center, item) <= radius) {
        items.push(item);
      }
    }

    return items;

  }

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
