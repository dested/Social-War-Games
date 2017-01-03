import {BaseEntity} from "./entities/entityManager";
import {HexagonColorUtils, DrawingUtils} from "./utils/drawingUtilities";
import {HexUtils} from "./hexLibraries/hexUtils";
import {GridHexagon} from "./hexLibraries/gridHexagon";
import {HexBoard} from "./hexLibraries/hexBoard";
import {DataService} from "./dataServices";
import {AnimationManager} from "./animationManager";
import {GridHexagonConstants} from "./hexLibraries/gridHexagonConstants";
export class GameManager {
    hexBoard: HexBoard;
    animationManager: AnimationManager;
    viewPort = new ViewPort();
    private checking: boolean;

    constructor() {
    }

    async init() {

        HexagonColorUtils.setupColors();
        this.hexBoard = new HexBoard();
        this.animationManager = new AnimationManager(this.hexBoard);

        let state = await DataService.getGameState();
        this.hexBoard.initialize(state);


        let lx = localStorage.getItem("lastX");
        let ly = localStorage.getItem("lastY");

        if (lx && ly) {
            this.setView(parseInt(lx), parseInt(ly))
        }

        setTimeout(() => {
            this.randomTap();
        }, 1000);

        setInterval(async() => {
            await this.checkState();
        }, 1 * 1000);

    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(-this.viewPort.x, -this.viewPort.y);
        this.hexBoard.drawBoard(context, this.viewPort);
        context.restore();
    }

    tick() {
        this.hexBoard.entityManager.tick();
    }

    private selectedHex: GridHexagon;


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
                spot.setHighlightColor(HexagonColorUtils.moveHighlightColor);
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

    private async randomTap() {
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


    async tapHex(x: number, y: number) {

        /* if (this.menuManager.tap(x, y)) {
         return;
         }
         this.menuManager.closeMenu();*/


        for (let i = 0; i < this.hexBoard.hexList.length; i++) {
            let h = this.hexBoard.hexList[i];
            h.clearHighlightColor();
        }

        let item = this.getHexAtPoint(x, y);
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

    resize(width: number, height: number) {
        this.viewPort.width = width;
        this.viewPort.height = height;
        this.constrainViewPort();
    }

    offsetView(x: number, y: number) {
        this.setView(this.viewPort.x + x, this.viewPort.y + y);
    }

    setView(x: number, y: number) {
        this.viewPort.x = x;
        this.viewPort.y = y;
        this.constrainViewPort();
        localStorage.setItem("lastX", this.viewPort.x.toString());
        localStorage.setItem("lastY", this.viewPort.y.toString());
    }

    constrainViewPort() {
        this.viewPort.x = Math.max(this.viewPort.x, 0 - this.viewPort.padding);
        this.viewPort.y = Math.max(this.viewPort.y, 0 - this.viewPort.padding);
        const size = this.hexBoard.gameDimensions();
        this.viewPort.x = Math.min(this.viewPort.x, size.width + this.viewPort.padding - this.viewPort.width);
        this.viewPort.y = Math.min(this.viewPort.y, size.height + this.viewPort.padding - this.viewPort.height);
        this.hexBoard.resetVisibleHexList(this.viewPort);
    }

    getHexAtPoint(clickX, clickY): GridHexagon {
        let lastClick: GridHexagon = null;
        clickX += this.viewPort.x;
        clickY += this.viewPort.y;

        for (let i = 0; i < this.hexBoard.hexList.length; i++) {
            const gridHexagon = this.hexBoard.hexList[i];
            const x = GridHexagonConstants.width * 3 / 4 * gridHexagon.x;
            let z = gridHexagon.z * GridHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridHexagonConstants.height() / 2) : 0);
            z -= gridHexagon.getDepthHeight();
            z += gridHexagon.y * GridHexagonConstants.depthHeight();
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonTopPolygon())) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthLeftPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthBottomPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridHexagonConstants.hexagonDepthRightPolygon((gridHexagon.height + 1) * GridHexagonConstants.depthHeight()))) {
                lastClick = gridHexagon;
            }
        }

        return lastClick;
    }

    centerOnHex(gridHexagon: GridHexagon): void {
        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealZ();
        this.setView(x - this.viewPort.width / 2, y - this.viewPort.height / 2);
    }
}

export class ViewPort {
    x = 0;
    y = 0;
    width = 400;
    height = 400;
    padding = GridHexagonConstants.width * 2;
}