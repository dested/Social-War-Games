/// <reference path="./typings/index.d.ts" />

import {AssetManager} from "./game/AssetManager";
import {GameManager} from "./game/gameManager";
import {PageManager} from "./pageManager";
import {GameController} from "./ui/gameController";
declare const angular:angular.IAngularStatic;


export class Main {
    static pageManager: PageManager;

    static run() {
        this.loadAssets(() => {
            this.pageManager = new PageManager();
            this.pageManager.init();
        });

    }

    private static loadAssets(onComplete) {
        AssetManager.completed = onComplete;
        var size = {width: 80, height: 80};
        var base = {x: 40, y: 55};
        AssetManager.addAsset('Infantry', 'images/tower_10.png', size, base);
        AssetManager.addAsset('Tank', 'images/tower_40.png', size, base);
        AssetManager.addAsset('Base', 'images/tower_42.png', size, base);
        AssetManager.addAsset('MainBase', 'images/tower_42.png', size, base);


        AssetManager.addAsset('Icon.Move', 'images/icons/move.png', size, base);
        AssetManager.addAsset('Icon.Attack', 'images/icons/attack.png', size, base);

        AssetManager.addAsset('tile', 'images/tile.png', size, base);


        AssetManager.addAssetFrame('Heli.TopLeft', 0, 'images/heli/top_left_1.png', null, null);
        AssetManager.addAssetFrame('Heli.TopLeft', 1, 'images/heli/top_left_2.png', null, null);

        AssetManager.addAssetFrame('Heli.TopRight', 0, 'images/heli/top_right_1.png', null, null);
        AssetManager.addAssetFrame('Heli.TopRight', 1, 'images/heli/top_right_2.png', null, null);

        AssetManager.addAssetFrame('Heli.BottomLeft', 0, 'images/heli/bottom_left_1.png', null, null);
        AssetManager.addAssetFrame('Heli.BottomLeft', 1, 'images/heli/bottom_left_2.png', null, null);

        AssetManager.addAssetFrame('Heli.BottomRight', 0, 'images/heli/bottom_right_1.png', null, null);
        AssetManager.addAssetFrame('Heli.BottomRight', 1, 'images/heli/bottom_right_2.png', null, null);

        AssetManager.addAssetFrame('Heli.Bottom', 0, 'images/heli/down_1.png', null, null);
        AssetManager.addAssetFrame('Heli.Bottom', 1, 'images/heli/down_2.png', null, null);

        AssetManager.addAssetFrame('Heli.Top', 0, 'images/heli/up_1.png', null, null);
        AssetManager.addAssetFrame('Heli.Top', 1, 'images/heli/up_2.png', null, null);

        AssetManager.start();
    }

    //http://www.goldenskullstudios.com/2d-hexagonal-tile-pack/
    //http://www.kenney.nl/assets/hexagon-pack
    //https://s-media-cache-ak0.pinimg.com/originals/5a/d3/7f/5ad37f0b696c77dbe85bfb3b329de46f.jpg
    //Arpegglatura <3
}

Main.run();


angular.module('swg', []).controller('GameController', GameController);
angular.element(function () {
    angular.bootstrap(document.getElementById('game-ui'), ['swg']);
});

