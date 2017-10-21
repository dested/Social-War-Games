/// <reference path="./typings/index.d.ts" />
import React from "react";
import ReactDOM from "react-dom";

import {AssetManager} from "./game/assetManager";
import {PageManager} from "./pageManager";
import {GridHexagonConstants} from "./game/gridHexagonConstants";
import {GameUI} from "./ui/gameController";


export class Main {
    static pageManager: PageManager;

    static run() {
        GridHexagonConstants.generate(80);

        ReactDOM.render(<GameUI />, document.getElementById('game-ui'));

        this.loadAssets(() => {
            this.pageManager = new PageManager();
            this.pageManager.init();
        });

    }

    private static loadAssets(onComplete: () => void) {
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


