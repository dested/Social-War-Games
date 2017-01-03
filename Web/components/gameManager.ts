import {HeliEntity, BaseEntity} from "./entities/entityManager";
import {HexagonColor} from "./utils/drawingUtilities";
import {MenuManager} from "./hexLibraries/menuManager";
import {HexUtils} from "./hexLibraries/hexUtils";
import {GridHexagon} from "./hexLibraries/gridHexagon";
import {HexBoard} from "./hexLibraries/hexBoard";
import {DataService} from "./dataServices";
import {GameMetricMoveVoteAction, GameEntity} from "./models/hexBoard";
import {AnimationManager} from "./animationManager";
declare let Hammer;
export class GameManager {
    private menuManager: MenuManager;
    hexBoard: HexBoard;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;


    private animationManager: AnimationManager;

    static baseColor = new HexagonColor('#FFFFFF');
    static highlightColor = new HexagonColor('#00F9FF');
    static selectedHighlightColor = new HexagonColor('#6B90FF');
    static moveHighlightColor = new HexagonColor('#BE9EFF');
    static attackHighlightColor = new HexagonColor('#91F9CF');


    swipeVelocity = {x: 0, y: 0};
    tapStart = {x: 0, y: 0};
    private fpsMeter;
    private checking: boolean;

    constructor() {
    }

    async init() {

        this.fpsMeter = new (<any>window).FPSMeter(document.body, {
            right: '5px',
            left: 'auto',
            heat: 1
        });
        HexBoard.setupColors();
        this.hexBoard = new HexBoard();
        this.animationManager = new AnimationManager(this.hexBoard);

        this.canvas = <HTMLCanvasElement>document.getElementById("hex");
        this.context = this.canvas.getContext("2d");
        let menu = document.getElementById("menu");
        this.menuManager = new MenuManager(menu);

        let overlay = document.getElementById("overlay");

        let mc = new Hammer.Manager(overlay);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Tap());
        window.onresize = () => {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
            this.hexBoard.resize(this.canvas.width, this.canvas.height);
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
            return true;
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

        let state = await DataService.getGameState();
        this.hexBoard.initialize(state);


        /*
         setTimeout(() => {
         this.animationManager.reset();
         var votes = [];
         for (var i = 0; i < this.hexBoard.state.entities.length; i++) {
         var entity = this.hexBoard.state.entities[i];
         votes.push({
         votes: 10,
         action: <GameMetricMoveVoteAction>{entityId: entity.id, actionType: 'Move', x: entity.x , z: 1}
         });
         }
         this.animationManager.setVotes(votes);
         this.animationManager.start();
         this.animationManager.onComplete(() => {
         console.log('getting new game state');
         });

         }, 1000);
         */

        setTimeout(() => {
            this.randomTap();
        }, 1000);

        setInterval(async() => {
            await this.checkState();
        }, 1 * 1000);


    }

    private async checkState() {
        if (this.checking || !this.hexBoard || this.hexBoard.generation == -1 || this.animationManager.isRunning)return;
        console.log('checking generation');
        this.checking = true;
        let metrics = await DataService.getGameMetrics();
        console.log(`Gen - old: ${this.hexBoard.generation} new ${metrics.generation}`);

        if (this.hexBoard.generation != metrics.generation) {
            let result = await DataService.getGenerationResult(this.hexBoard.generation);
            if (!result) {
                console.log('getting new game state 1');
                DataService.getGameState().then(state => {
                    console.log('game updated3 ');
                    this.hexBoard.updateFactionEntities(state);
                    this.checking = false;
                });
                return;
            }


            this.animationManager.reset();
            this.animationManager.setVotes(result.votes);
            this.animationManager.onComplete(() => {
                console.log('getting new game state 2');
                DataService.getGameState().then(state => {
                    console.log('game updated4 ');
                    this.hexBoard.updateFactionEntities(state);
                    this.checking = false;
                });
            });
            this.animationManager.start();

        }
        this.checking = false;


    }

    startAction(item: GridHexagon) {
        let radius = 5;
        let spots = this.findAvailableSpots(radius, item);
        for (let i = 0; i < spots.length; i++) {
            let spot = spots[i];
            let entities = this.hexBoard.entityManager.getEntitiesAtTile(spot);
            if (spot == item || !entities || entities.length == 0) continue;
            let path = this.hexBoard.pathFind(item, spot);
            if (path.length > 1 && path.length <= radius + 1) {
                spot.setHighlightColor(GameManager.moveHighlightColor);
                // spot.setHeightOffset(.25);
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

    draw() {
        requestAnimationFrame(() => {
            this.draw();
        });
        this.tick();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            this.hexBoard.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
        }
        this.hexBoard.entityManager.tick();

    }

    private selectedHex: GridHexagon;

    private async randomTap() {
        return;
        if (this.animationManager.isRunning) {
            setTimeout(() => {
                this.randomTap()
            }, Math.random() * 1000 + 100);
            return;
        }
        let ent: BaseEntity;
        let px: number;
        let pz: number;

        while (true) {
            let p = Math.round(this.hexBoard.entityManager.entities.length * Math.random());
            ent = this.hexBoard.entityManager.entities[p];
            if (!ent)continue;
            var tile = ent.getTile();
            px = Math.round(tile.x + Math.random() * 10 - 5);
            pz = Math.round(tile.z + Math.random() * 10 - 5);
            if (px == 0 && pz == 0)continue;

            if (HexUtils.distance({x: px, z: pz}, {x: tile.x, z: tile.z}) <= 5) {
                break;
            }
        }
        let result = await DataService.vote({
            entityId: ent.id,
            action: 'Move',
            userId: 'foo',
            generation: this.hexBoard.generation,
            x: px,
            z: pz
        });
        if (result && result.generationMismatch) {
            await this.checkState();
        }
        setTimeout(() => {
            this.randomTap()
        }, Math.random() * 1000 + 100);
    }

    private async tapHex(x: number, y: number) {
        this.swipeVelocity.x = this.swipeVelocity.y = 0;


        /* if (this.menuManager.tap(x, y)) {
         return;
         }
         this.menuManager.closeMenu();*/


        for (let i = 0; i < this.hexBoard.hexList.length; i++) {
            let h = this.hexBoard.hexList[i];
            h.clearHighlightColor();
        }

        let item = this.hexBoard.getHexAtPoint(x, y);
        if (!item) return;


        if (this.selectedHex) {
            let distance = HexUtils.distance(this.selectedHex, item);
            console.log(distance);
            if (distance > 5) {
                return;
            }
            let entities = this.hexBoard.entityManager.getEntitiesAtTile(this.selectedHex);
            if (!entities || entities.length == 0) {
                this.selectedHex = null;
                return;
            }
            let entity = entities[0];
            await DataService.vote({
                entityId: entity.id,
                action: 'Move',
                userId: 'foo',
                generation: this.hexBoard.generation,
                x: item.x,
                z: item.z
            });

            this.selectedHex = null;
            return;
        }

        let entities = this.hexBoard.entityManager.getEntitiesAtTile(item);
        if (entities && entities[0]) {
            this.selectedHex = item;
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