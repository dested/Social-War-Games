import {HeliSprite} from "./sprites/spriteManager";
import {HexagonColor} from "./utils/drawingUtilities";
import {MenuManager} from "./hexLibraries/menuManager";
import {HexUtils} from "./hexLibraries/hexUtils";
import {GridHexagon} from "./hexLibraries/gridHexagon";
import {HexBoard} from "./hexLibraries/hexBoard";
declare let Hammer;
declare let fetch;
export class GameManager {
    private menuManager: MenuManager;
    private hexBoard: HexBoard;
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
    // private voteServer: string='https://vote.socialwargames.com/';
    private voteServer: string = 'http://localhost:3568/';

    constructor() {
        this.fpsMeter = new (<any>window).FPSMeter(document.body, {
            right: '5px',
            left: 'auto',
            heat: 1
        });

        this.hexBoard = new HexBoard();

        this.canvas = <HTMLCanvasElement>document.getElementById("hex");
        this.context = this.canvas.getContext("2d");
        let menu = document.getElementById("menu");
        this.menuManager = new MenuManager(menu);

        let overlay = document.getElementById("overlay");

        let mc = new Hammer.Manager(overlay);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Tap());
        overlay.onmousemove = (ev) => {
            let x = <number> ev.pageX;
            let y = <number> ev.pageY;
            // this.tapHex(x, y);
        };

        window.onresize = () => {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
        };
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';

        this.hexBoard.resize(this.canvas.width, this.canvas.height);


        mc.on('panstart', (ev) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            this.swipeVelocity.x = this.swipeVelocity.y = 0;
            this.tapStart.x = this.hexBoard.viewPort.x;
            this.tapStart.y = this.hexBoard.viewPort.y;
            this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
        });
        mc.on('panmove', (ev) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.hexBoard.setView(this.tapStart.x - ev.deltaX, this.tapStart.y - ev.deltaY);
        });

        mc.on('swipe', (ev) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            this.swipeVelocity.x = ev.velocityX * 10;
            this.swipeVelocity.y = ev.velocityY * 10;
        });

        mc.on('tap', (ev) => {
            let x = <number> ev.center.x;
            let y = <number> ev.center.y;

            this.tapHex(x, y)

        });


        this.draw();


        fetch(this.voteServer + 'api/game/state', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            response.json()
                .then(data => {
                    this.hexBoard.initialize(data.data.state);
                });
        }).catch((err) => {
            console.log('Fetch Error :-S', err);
        });


       setInterval(()=>{
           console.log('checking generation');
           if (!this.hexBoard || !this.hexBoard.state)return;

           fetch(this.voteServer + 'api/game/generation', {
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
               }
           }).then(response => {
               response.json()
                   .then(data => {
                       if (this.hexBoard.state.generation != data.data.generation) {
                           console.log('getting new game state');
                           fetch(this.voteServer + 'api/game/state', {
                               headers: {
                                   'Accept': 'application/json',
                                   'Content-Type': 'application/json',
                               }
                           }).then(response => {
                               response.json()
                                   .then(data => {
                                       console.log('game updated');
                                       this.hexBoard.updateFactionEntities(data.data.state);
                                   });
                           }).catch((err) => {
                               console.log('Fetch Error :-S', err);
                           });
                       }
                   });
           }).catch((err) => {
               console.log('Fetch Error :-S', err);
           });
       },10*1000);
    }

    startAction(item: GridHexagon) {
        let radius = 5;
        let spots = this.findAvailableSpots(radius, item);
        for (let i = 0; i < spots.length; i++) {
            let spot = spots[i];
            let sprites = this.hexBoard.spriteManager.spritesMap[spot.x + spot.z * 5000];
            if (spot == item || (sprites && sprites.length > 0)) continue;
            let path = this.hexBoard.pathFind(item, spot);
            if (path.length > 1 && path.length <= radius + 1) {
                spot.setHighlight(GameManager.moveHighlightColor);
                spot.setHeightOffset(.25);
            }
        }
    }


    findAvailableSpots(radius, center): GridHexagon[] {
        let items = [];
        for (let q = 0; q < this.hexBoard.hexList.length; q++) {
            let item = this.hexBoard.hexList[q];

            if (HexUtils.distance(center, item) <= radius) {
                items.push(item);
            }
        }

        return items;

    }

    drawIndex = 0;

    draw() {
        requestAnimationFrame(() => {
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
            let sign = HexUtils.mathSign(this.swipeVelocity.x);
            this.swipeVelocity.x += 0.7 * -sign;
            if (HexUtils.mathSign(this.swipeVelocity.x) != sign) {
                this.swipeVelocity.x = 0;
            }
        }

        if (Math.abs(this.swipeVelocity.y) > 0) {
            let sign = HexUtils.mathSign(this.swipeVelocity.y);
            this.swipeVelocity.y += 0.7 * -sign;
            if (HexUtils.mathSign(this.swipeVelocity.y) != sign) {
                this.swipeVelocity.y = 0;
            }
        }
        // if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0)
        {
            this.hexBoard.offsetView(this.swipeVelocity.x, this.swipeVelocity.y);
        }
        this.hexBoard.spriteManager.tick();

    }

    private selectedHex: GridHexagon;

    private tapHex(x: number, y: number) {
        this.swipeVelocity.x = this.swipeVelocity.y = 0;


        /* if (this.menuManager.tap(x, y)) {
         return;
         }
         this.menuManager.closeMenu();*/


        for (let i = 0; i < this.hexBoard.hexList.length; i++) {
            let h = this.hexBoard.hexList[i];
            h.setHighlight(null);
            h.setHeightOffset(0);
        }

        let item = this.hexBoard.getHexAtPoint(x, y);
        if (!item) return;


        if (this.selectedHex) {
            let sprite = <HeliSprite> this.hexBoard.spriteManager.getSpritesAtTile(this.selectedHex)[0];
            if (!sprite) {
                this.selectedHex = null;
                return;
            }

            fetch(this.voteServer + 'api/game/vote', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    entityId: sprite.id,
                    action: 'Move',
                    userId: 'foo',
                    generation: this.hexBoard.state.generation,
                    x: item.x,
                    z: item.z
                })
            })
                .then(response => {
                    response.text()
                        .then(data => {
                            console.log(JSON.parse(data));
                        });
                })
                .catch((err) => {
                    console.log('Fetch Error :-S', err);
                });

            /*
             let path = this.hexBoard.pathFind(this.selectedHex, item);
             for (let i = 1; i < path.length; i++) {
             let p = path[i];
             let oldP = path[i - 1];
             // let direction = HexUtils.getDirection(oldP,p);
             // sprite.currentDirection = direction;
             setTimeout(() => {
             sprite.currentDirection = HexUtils.getDirection(oldP, p);
             sprite.setTile(this.hexBoard.getHexAtSpot(p.x, p.y, p.z));
             }, i * 500);
             }*/
            this.selectedHex = null;
            return;
        }

        this.selectedHex = item;

        let sprites = this.hexBoard.spriteManager.getSpritesAtTile(item);
        if (sprites && sprites.length > 0) {
            let sprite = sprites[0];
            item.setHighlight(GameManager.selectedHighlightColor);
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