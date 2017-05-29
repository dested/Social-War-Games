/// <reference path="./typings/index.d.ts" />

import {AssetManager} from "./game/AssetManager";
import {GameManager} from "./game/gameManager";
import {PageManager} from "./pageManager";
import {GameController} from "./ui/gameController";
import {GridHexagonConstants} from "./game/gridHexagonConstants";
import {GameService} from "./ui/gameService";
import {AnimationUtils} from "./utils/animationUtils";
declare const angular: angular.IAngularStatic;


export class Main {
    static pageManager: PageManager;

    static run() {
        GridHexagonConstants.generate(60);



        this.loadAssets(() => {
            this.pageManager = new PageManager();
            this.pageManager.init();
        });

    }

    private static loadAssets(onComplete) {
        AssetManager.completed = onComplete;
        var size = {width: 80, height: 80};
        var base = {x: 40, y: 55};
        AssetManager.addAsset('MainBase', 'images/MainBase/up_1.png', size, base);


        AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
        AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);

        AssetManager.addAsset('Stone.Top', 'images/tile.png');
        AssetManager.addAsset('Stone.Left', 'images/tile.png');
        AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
        AssetManager.addAsset('Stone.Right', 'images/tile.png');

        AssetManager.addAsset('Grass.Top', 'images/grass.png');
        AssetManager.addAsset('Grass.Left', 'images/grass.png');
        AssetManager.addAsset('Grass.Bottom', 'images/grass.png');
        AssetManager.addAsset('Grass.Right', 'images/grass.png');


        AssetManager.addAsset('Water.Top', 'images/water.png');
        AssetManager.addAsset('Water.Left', 'images/water.png');
        AssetManager.addAsset('Water.Bottom', 'images/water.png');
        AssetManager.addAsset('Water.Right', 'images/water.png');

        /*
         AssetManager.addAsset('Stone.Top', 'images/tile.png');
         AssetManager.addAsset('Stone.Left', 'images/tile.png');
         AssetManager.addAsset('Stone.Bottom', 'images/tile.png');
         AssetManager.addAsset('Stone.Right', 'images/tile.png');
         */


        AssetManager.addAssetFrame('Heli', 0, 'images/Heli/up_1.png', null, null);
        AssetManager.addAssetFrame('Heli', 1, 'images/Heli/up_2.png', null, null);

        AssetManager.addAssetFrame('Tank', 0, 'images/Tank/up_1.png', null, null);
        AssetManager.addAssetFrame('Tank', 1, 'images/Tank/up_1.png', null, null);


        AssetManager.addAssetFrame('Missile', 0, 'images/Missile/up_1.png', null, null);
        AssetManager.addAssetFrame('Missile', 1, 'images/Missile/up_2.png', null, null);


        AssetManager.start();
    }

    //http://www.kenney.nl/assets/hexagon-pack
}

Main.run();


angular.module('swg', []).controller('GameController', GameController);
angular.element(function () {
    angular.bootstrap(document.getElementById('game-ui'), ['swg']);
});

