import {HeliSprite} from "./sprites/spriteManager";
import {HexagonColor} from "./utils/drawingUtilities";
import {MenuManager} from "./hexLibraries/menuManager";
import {HexUtils} from "./hexLibraries/hexUtils";
import {GridHexagon} from "./hexLibraries/gridHexagon";
import {HexBoard} from "./hexLibraries/hexBoard";
import {DataService} from "./dataServices";
import {GameMetricMoveVoteAction, GameEntity} from "./models/hexBoard";
declare let Hammer;
export class GameManager {
    private menuManager: MenuManager;
    hexBoard: HexBoard;
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
    }

    async init() {
        this.fpsMeter = new (<any>window).FPSMeter(document.body, {
            right: '5px',
            left: 'auto',
            heat: 1
        });
        HexBoard.setupColors();
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

        setTimeout(() => {
            this.randomTap();
        }, 1000);

        setInterval(async() => {
            console.log('checking generation');
            if (!this.hexBoard || !this.hexBoard.state || this.animating)return;


            let metrics = await DataService.getGameMetrics();

            if (this.hexBoard.state.generation != metrics.generation) {
                let result = await  DataService.getGenerationResult(this.hexBoard.state.generation);
                if (!result) {
                    console.log('getting new game state');
                    DataService.getGameState().then(state => {
                        console.log('game updated');
                        this.hexBoard.updateFactionEntities(state);
                    });
                    return;
                }
                this.animating = true;
                let totalAnimations = 0;
                let doneAnimations = 0;
                let doneAnimating = async() => {
                    doneAnimations++;
                    if (doneAnimations == totalAnimations) {
                        console.log('getting new game state');
                        DataService.getGameState().then(state => {
                            console.log('game updated');
                            this.animating = false;
                            this.hexBoard.updateFactionEntities(state);
                        });
                    }
                };
                console.log(result.votes);
                for (let i = 0; i < result.votes.length; i++) {
                    let vote = result.votes[i];
                    let action = vote.action;
                    let selectedEntity: GameEntity;
                    for (let j = 0; j < this.hexBoard.state.entities.length; j++) {
                        let entity = this.hexBoard.state.entities[j];
                        if (entity.id == action.entityId) {
                            selectedEntity = entity;
                            break;
                        }
                    }
                    if (!selectedEntity)continue;
                    let sprite = this.hexBoard.spriteManager.spritesMap[selectedEntity.x + selectedEntity.z * 5000].filter(a => a.id == selectedEntity.id)[0];
                    console.log('executing action: ', action);

                    switch (action.actionType) {
                        case "Move":
                            let moveAction = <GameMetricMoveVoteAction>action;
                            let path = this.hexBoard.pathFind(
                                this.hexBoard.getHexAtSpot(selectedEntity.x, 0, selectedEntity.z),
                                this.hexBoard.getHexAtSpot(moveAction.x, 0, moveAction.z)
                            );

                            for (let i = 1; i < path.length; i++) {
                                let p = path[i];
                                let oldP = path[i - 1];
                                setTimeout(() => {
                                    sprite.tile.clearHighlight();

                                    sprite.currentDirection = HexUtils.getDirection(oldP, p);
                                    console.log('ticking animation ');
                                    let hex = this.hexBoard.getHexAtSpot(p.x, p.y, p.z);
                                    hex.faction = selectedEntity.factionId;
                                    hex.setColor(HexBoard.factionHexColors[hex.faction - 1][hex.height], false);
                                    let neighbors = hex.getNeighbors();
                                    for (let j = 0; j < neighbors.length; j++) {
                                        let ne = neighbors[j];
                                        let tile = this.hexBoard.getHexAtSpot(ne.x, 0, ne.y);
                                        tile.faction = selectedEntity.factionId;
                                        if (selectedEntity.factionId > 0) {
                                            tile.setColor(HexBoard.factionHexColors[tile.faction - 1][hex.height], false);
                                        }

                                    }
                                    sprite.setTile(hex);
                                    doneAnimating();
                                }, i * 500);
                                totalAnimations++;
                            }
                            break;
                    }

                }


            }

        }, 10 * 1000);

    }

    animating: boolean = false;

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

    private async randomTap() {

        if (this.animating) {
            setTimeout(() => {
                this.randomTap()
            }, Math.random() * 1000 + 100);
            return;
        }
        let ent;
        let px;
        let pz;

        while (true) {
            let p = Math.round(this.hexBoard.state.entities.length * Math.random());
            ent = this.hexBoard.state.entities[p];
            if (!ent)continue;
            px = Math.round(ent.x + Math.random() * 10 - 5);
            pz = Math.round(ent.z + Math.random() * 10 - 5);
            if (px == 0 && pz == 0)continue;

            if (HexUtils.distance({x: px, z: pz}, {x: ent.x, z: ent.z}) <= 5) {
                break;
            }
        }
        await DataService.vote({
            entityId: ent.id,
            action: 'Move',
            userId: 'foo',
            generation: this.hexBoard.state.generation,
            x: px,
            z: pz
        });
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
            h.clearHighlight(GameManager.moveHighlightColor);
        }

        let item = this.hexBoard.getHexAtPoint(x, y);
        if (!item) return;


        if (this.selectedHex) {

            let sprite = this.hexBoard.spriteManager.getSpritesAtTile(this.selectedHex)[0];
            let distance = HexUtils.distance(this.selectedHex, item);
            console.log(distance);
            if (distance > 5) {
                sprite.tile.setHighlight(new HexagonColor("#f0c2bc"));
                return;
            }
            if (!sprite) {
                this.selectedHex = null;
                return;
            }
            sprite.tile.setHighlight(new HexagonColor("#f0c2bc"));
            await DataService.vote({
                entityId: sprite.id,
                action: 'Move',
                userId: 'foo',
                generation: this.hexBoard.state.generation,
                x: item.x,
                z: item.z
            });

            this.selectedHex = null;
            return;
        }

        this.selectedHex = item;

        let sprites = this.hexBoard.spriteManager.getSpritesAtTile(item);
        if (sprites && sprites.length > 0) {
            let sprite = sprites[0];
            item.setHighlight(GameManager.selectedHighlightColor);
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