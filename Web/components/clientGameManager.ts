import {ClientHeliSprite} from "./clientSpriteManager";
import {HexagonColor} from "./utils/drawingUtilities";
import {MenuManager} from "./hexLibraries/menuManager";
import {HexUtils} from "./hexLibraries/hexUtils";
import {ClientGridHexagon} from "./hexLibraries/clientGridHexagon";
import {ClientHexBoard} from "./hexLibraries/clientHexBoard";
import {GridHexagon} from "./gridHexagon";
declare var Hammer;
declare var fetch;
export class ClientGameManager {
    private menuManager: MenuManager;
    private hexBoard: ClientHexBoard;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    static baseColor = new HexagonColor('#FFFFFF');
    static highlightColor = new HexagonColor('#00F9FF');
    static selectedHighlightColor = new HexagonColor('#6B90FF');
    static moveHighlightColor = new HexagonColor('#BE9EFF');
    static attackHighlightColor = new HexagonColor('#91F9CF');


    swipeVelocity = {x: 0, y: 0};
    tapStart = {x: 0, y: 0};
    private fpsMeter;

    constructor() {
        this.fpsMeter = new (<any>window).FPSMeter(document.body, {
            right: '5px',
            left: 'auto',
            heat: 1
        });

        this.hexBoard = new ClientHexBoard();

        this.canvas = <HTMLCanvasElement>document.getElementById("hex");
        this.context = this.canvas.getContext("2d");
        var menu = document.getElementById("menu");
        this.menuManager = new MenuManager(menu);

        var overlay = document.getElementById("overlay");

        var mc = new Hammer.Manager(overlay);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Tap());
        overlay.onmousemove = (ev)=> {
            var x = <number> ev.pageX;
            var y = <number> ev.pageY;
            // this.tapHex(x, y);
        };

        window.onresize = ()=> {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
        };
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';

        this.hexBoard.resize(this.canvas.width, this.canvas.height);


        mc.on('panstart', (ev)=> {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            this.swipeVelocity.x = this.swipeVelocity.y = 0;
            this.tapStart.x = this.hexBoard.viewPort.x;
            this.tapStart.y = this.hexBoard.viewPort.y;
            this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
        });
        mc.on('panmove', (ev)=> {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
        });

        mc.on('swipe', (ev)=> {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            this.swipeVelocity.x = ev.velocityX * 10;
            this.swipeVelocity.y = ev.velocityY * 10;
        });

        mc.on('tap', (ev) => {
            var x = <number> ev.center.x;
            var y = <number> ev.center.y;

            this.tapHex(x, y)

        });


        this.draw();


        fetch('http://localhost:9847/game-state', {})
            .then(response => {
                response.text()
                    .then(data => {
                        this.hexBoard.initialize(JSON.parse(new Compressor().DecompressText(data)));
                    });
            })
            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }

    startAction(item: ClientGridHexagon) {
        var radius = 5;
        var spots = this.findAvailableSpots(radius, item);
        for (var i = 0; i < spots.length; i++) {
            var spot = <ClientGridHexagon> spots[i];
            var sprites = this.hexBoard.clientSpriteManager.spritesMap[spot.x + spot.z * 5000];
            if (spot == item || (sprites && sprites.length > 0)) continue;
            var path = this.hexBoard.pathFind(item, spot);
            if (path.length > 1 && path.length <= radius + 1) {
                spot.setHighlight(ClientGameManager.moveHighlightColor);
                spot.setHeightOffset(.25);
            }
        }
    }


    findAvailableSpots(radius, center): GridHexagon[] {
        var items = [];
        for (var q = 0; q < this.hexBoard.hexList.length; q++) {
            var item = this.hexBoard.hexList[q];

            if (HexUtils.distance(center, item) <= radius) {
                items.push(item);
            }
        }

        return items;

    }

    drawIndex = 0;

    draw() {
        requestAnimationFrame(()=> {
            this.draw();
        });
        this.tick();
        this.canvas.width = this.canvas.width;
        this.hexBoard.drawBoard(this.context);
        this.menuManager.draw();

        this.fpsMeter.tick();
    }

    tick() {
        if (Math.abs(this.swipeVelocity.x) > 0) {
            var sign = HexUtils.mathSign(this.swipeVelocity.x);
            this.swipeVelocity.x += 0.7 * -sign;
            if (HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                this.swipeVelocity.x = 0;
            }
        }

        if (Math.abs(this.swipeVelocity.y) > 0) {
            var sign = HexUtils.mathSign(this.swipeVelocity.y);
            this.swipeVelocity.y += 0.7 * -sign;
            if (HexUtils.mathSign(this.swipeVelocity.y) != sign) {
                this.swipeVelocity.y = 0;
            }
        }
        // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
        {
            this.hexBoard.offsetView(this.swipeVelocity.x, this.swipeVelocity.y);
        }
        this.hexBoard.clientSpriteManager.tick();

    }

    private selectedHex: GridHexagon;

    private tapHex(x: number, y: number) {
        this.swipeVelocity.x = this.swipeVelocity.y = 0;


        /* if (this.menuManager.tap(x, y)) {
         return;
         }
         this.menuManager.closeMenu();*/


        for (var i = 0; i < this.hexBoard.hexList.length; i++) {
            var h = <ClientGridHexagon> this.hexBoard.hexList[i];
            h.setHighlight(null);
            h.setHeightOffset(0);
        }

        var item = this.hexBoard.getHexAtPoint(x, y);
        if (!item) return;


        if (this.selectedHex) {
            let sprite = <ClientHeliSprite> this.hexBoard.clientSpriteManager.getSpritesAtTile(this.selectedHex)[0];
            if (!sprite) {
                this.selectedHex = null;
                return;
            }

            var path = this.hexBoard.pathFind(this.selectedHex, item);
            for (let i = 1; i < path.length; i++) {
                let p = path[i];
                let oldP = path[i - 1];
                // var direction = HexUtils.getDirection(oldP,p);
                // sprite.currentDirection = direction;
                setTimeout(()=> {
                    var direction = HexUtils.getDirection(oldP,p);
                    sprite.currentDirection = direction;
                    sprite.setTile(this.hexBoard.getHexAtSpot(p.x, p.y, p.z));
                }, i * 500);
            }
            this.selectedHex = null;
            return;
        }

        this.selectedHex = item;

        var sprites = this.hexBoard.clientSpriteManager.getSpritesAtTile(item);
        if (sprites && sprites.length > 0) {
            var sprite = sprites[0];
            item.setHighlight(ClientGameManager.selectedHighlightColor);
            item.setHeightOffset(.25);
            this.startAction(item);
        }


        /*
         this.menuManager.openMenu([
         {image: AssetManager.instance.assets['Icon.Move'].image, action: 'Move'},
         {image: AssetManager.instance.assets['Icon.Attack'].image, action: 'Attack'}
         ],
         new Point(x, y),
         (selectedItem) => {
         item.setHighlight(ClientGameManager.selectedHighlightColor);
         this.menuManager.closeMenu();
         this.startAction(item);
         currentState = 'highlighting';
         });
         */
    }
}