import {DrawingUtils} from "../utils/drawingUtilities";
import {HexUtils, Vector3} from "./hexUtils";
import {GridHexagon} from "./gridHexagon";
import {HexBoard} from "./hexBoard";
import {DataService} from "../dataServices";
import {AnimationManager} from "../animationManager";
import {GridHexagonConstants, GridMiniHexagonConstants} from "./gridHexagonConstants";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
import {GameService} from "../ui/gameService";
import {GameState} from "../models/hexBoard";
import {DebounceUtils} from "../utils/debounceUtils";
import {ViewPort} from "./viewPort";
import {IPoint, Point} from "../utils/utils";
import {PageManager} from "../pageManager";
import {AssetManager} from "./assetManager";
import {BaseEntity} from "../entities/baseEntity";
import {EntityDetails} from "../entities/entityDetails";
import {PossibleActions} from "../entities/entityManager";
declare let Hammer: any;

export class GameManager {
    hexBoard: HexBoard;
    animationManager: AnimationManager;
    viewPort = new ViewPort();
    private checking: boolean;

    constructor(private pageManager: PageManager) {
        GameService.setGameManager(this);
    }

    async init() {

        HexagonColorUtils.setupColors();
        this.hexBoard = new HexBoard();
        this.animationManager = new AnimationManager(this.hexBoard);

        let state = await DataService.getGameState();
        GameService.secondsPerGeneration = state.tickIntervalSeconds;
        this.hexBoard.initialize(state);

        this.createMiniCanvas();
        this.rebuildMiniBoard(false);


        await this.checkState();

        GameService.hasData && GameService.hasData();


        let lx = localStorage.getItem("lastX");
        let ly = localStorage.getItem("lastY");

        if (lx && ly) {
            this.setView(parseInt(lx), parseInt(ly))
        }

        /*        setTimeout(() => {
         this.randomTap();
         }, 1000);*/
    }

    private createMiniCanvas() {
        let size = this.hexBoard.gameDimensionsMini();

        let canvas = document.createElement("canvas");
        canvas.width = size.width + 20;
        canvas.height = size.height + 20;
        let context = canvas.getContext("2d");

        this.miniCanvas = canvas;
        this.miniContext = context;

        let leftBubble = document.getElementById('leftBubble');

        leftBubble.appendChild(this.miniCanvas);

        let mc = new Hammer.Manager(leftBubble);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        mc.add(new Hammer.Tap());
        let tapStart = {x: 0, y: 0};
        mc.on('panstart', () => {
            tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
            tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
            tapStart.x = tapStart.x || 0;
            tapStart.y = tapStart.y || 0;
            return true;
        });

        mc.on('panmove', (ev: { deltaX: number; deltaY: number }) => {
            let width = leftBubble.clientWidth;
            let height = leftBubble.clientHeight;

            let rx = (tapStart.x + ev.deltaX);
            let ry = (tapStart.y + ev.deltaY);

            if (rx < width * 2 / 5 && rx > -size.width + width * 2 / 5) {
                canvas.style.marginLeft = rx + "px";
            }
            if (ry < height * 2 / 5 && ry > -size.height + height * 2 / 5) {
                canvas.style.marginTop = ry + "px";
            }
        });
        mc.on('tap', (ev: { center: IPoint }) => {
            let rect = leftBubble.getBoundingClientRect();

            tapStart.x = parseInt(canvas.style.marginLeft.replace("px", ''));
            tapStart.y = parseInt(canvas.style.marginTop.replace("px", ''));
            tapStart.x = tapStart.x || 0;
            tapStart.y = tapStart.y || 0;

            let x = <number> ev.center.x - tapStart.x - rect.left - 15;
            let y = <number> ev.center.y - tapStart.y - rect.top - 15;
            let item = this.getMiniHexAtPoint(x, y);
            if (item) {
                this.centerOnHex(item);
            }
        });
    }


    getMiniHexAtPoint(clickX: number, clickY: number): GridHexagon {
        let lastClick: GridHexagon = null;

        let hexListLength = this.hexBoard.hexListLength;
        for (let i = 0; i < hexListLength; i++) {
            const gridHexagon = this.hexBoard.hexList[i];
            const x = GridMiniHexagonConstants.width * 3 / 4 * gridHexagon.x;
            let z = gridHexagon.z * GridMiniHexagonConstants.height() + ((gridHexagon.x % 2 === 1) ? (-GridMiniHexagonConstants.height() / 2) : 0);
            if (DrawingUtils.pointInPolygon(clickX - x, clickY - z, GridMiniHexagonConstants.hexagonTopPolygon())) {
                lastClick = gridHexagon;
            }
        }

        return lastClick;
    }

    private miniCanvas: HTMLCanvasElement;
    private miniContext: CanvasRenderingContext2D;

    private rebuildMiniBoard(justEntities: boolean, entity?: BaseEntity) {
        let size = this.hexBoard.gameDimensionsMini();
        this.miniContext.save();
        if (!justEntities)
            this.miniContext.clearRect(0, 0, size.width + 20, size.height + 20);
        this.miniContext.translate(10, 10);
        let hexListLength = this.hexBoard.hexListLength;
        for (let i = 0; i < hexListLength; i++) {
            const gridHexagon = this.hexBoard.hexList[i];
            if (justEntities) {
                if (gridHexagon.hasEntities()) {
                    if (entity) {
                        if (!gridHexagon.getEntityById(entity.id)) {
                            continue;
                        }
                    }
                    gridHexagon.drawMini(this.miniContext, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ());
                }
            } else {
                gridHexagon.drawMini(this.miniContext, gridHexagon.getRealMiniX(), gridHexagon.getRealMiniZ());
            }

        }
        this.miniContext.restore();
    }


    draw(context: CanvasRenderingContext2D) {
        context.save();

        this.viewPort.zoom(context);

        context.translate(-this.viewPort.getX(), -this.viewPort.getY());

        this.hexBoard.drawBoard(context);
        context.restore();

        /*        context.save();
         context.strokeStyle='white';
         context.lineWidth=3;
         context.strokeRect(0, 0, this.viewPort.getWidth() / 2, this.viewPort.getHeight() / 2)
         context.restore();*/

    }

    tick() {
        this.hexBoard.entityManager.tick();
    }


    private cantAct(): boolean {
        return this.checking || !this.hexBoard || this.hexBoard.generation == -1 || this.animationManager.isRunning;
    }

    private async checkState() {
        // console.log('got state',+new Date());
        if (this.cantAct()) {
            DebounceUtils.debounce("checkState", 1000 * 5, () => this.checkState());
            return;
        }
        this.checking = true;
        let metrics = await DataService.getGameMetrics();
        if(!metrics){
            this.checking=false;
            DebounceUtils.debounce("checkState", 1000 * 5, () => this.checkState());
            return;
        }
        let seconds = (+metrics.nextGenerationDate - +new Date()) / 1000;


        GameService.setSecondsToNextGeneration(seconds);

        for (let i = 0; i < this.hexBoard.entityManager.entities.length; i++) {
            let ent = this.hexBoard.entityManager.entities[i];
            ent.resetVotes();
        }

        if (this.hexBoard.generation != metrics.generation) {
            console.log(`Gen - old: ${this.hexBoard.generation} new ${metrics.generation}`);
            let result = await DataService.getGenerationResult(this.hexBoard.generation);
            GameService.resetSelection();
            let hexListLength = this.hexBoard.hexListLength;
            for (let i = 0; i < hexListLength; i++) {
                let hex = this.hexBoard.hexList[i];
                hex.clearSecondaryVoteColor();
                hex.clearHighlightColor();
                hex.clearVoteColor();
                hex.setShowVotes(true);
            }

            if (!result) {
                console.log('getting new game state 1');
                DataService.getGameState().then((state: GameState) => {
                    console.log('game updated3 ');
                    this.hexBoard.updateFactionEntities(state);
                    this.rebuildMiniBoard(false);

                    this.checking = false;
                });
                return;
            }


            this.animationManager.reset();
            this.animationManager.setVotes(result.votes);
            this.animationManager.onComplete(() => {
                console.log('getting new game state 2');
                DataService.getGameState().then((state: GameState) => {
                    console.log('game updated4 ');
                    this.hexBoard.updateFactionEntities(state);
                    this.rebuildMiniBoard(false);


                    this.checking = false;
                    return this.checkState();
                });
            });
            this.animationManager.start();

        } else {
            for (let i = 0; i < metrics.votes.length; i++) {
                let vote = metrics.votes[i];
                let action = vote.action;
                let entity = this.hexBoard.entityManager.getEntityById(action.entityId);
                entity.pushVote(vote);
            }
            this.rebuildMiniBoard(true);
        }
        this.checking = false;
        DebounceUtils.debounce("checkState", 1000 * (seconds > 5 ? 5 : Math.max(seconds, .5) ), () => {
            this.checkState();
        });

    }

    startAction(): boolean {


        this.resetBoardColors();

        let entities = this.hexBoard.entityManager.getEntitiesAtTile(GameService.selectedHex);
        let selectedEntity = entities[0];
        if (!selectedEntity) {
            GameService.resetSelection();
            return false;
        }


        let hexListLength = this.hexBoard.hexListLength;
        for (let i = 0; i < hexListLength; i++) {
            let h = this.hexBoard.hexList[i];
            h.setShowVotes(false);
        }


        let radius = 0;

        let entityDetail = EntityDetails.instance.details[selectedEntity.entityType];

        if (!GameService.selectedAction) {
            GameService.selectedAction = entityDetail.defaultAction;
        }

        GameService.setSelectedEntity(selectedEntity);

        let selectedAction = GameService.selectedAction;

        switch (selectedAction) {
            case "move":
                radius = entityDetail.moveRadius;
                break;
            case "attack":
                radius = entityDetail.attackRadius;
                break;
            case "spawn":
                radius = entityDetail.spawnRadius;
                break;
        }

        let spots = this.findAvailableSpots(radius, GameService.selectedHex);
        GameService.selectedHex.setShowVotes(true);

        for (let i = 0; i < spots.length; i++) {
            let spot = spots[i];
            if (spot == GameService.selectedHex)continue;
            let entities = this.hexBoard.entityManager.getEntitiesAtTile(spot);

            switch (selectedAction) {
                case "move": {
                    if (entities.length > 0) continue;
                    let path = this.hexBoard.pathFind(GameService.selectedHex, spot);
                    if (path.length > 1 && path.length <= radius + 1) {
                        spot.setHighlightColor(HexagonColorUtils.moveHighlightColor);
                        spot.setShowVotes(true);
                        selectedEntity.setSecondaryVoteColor(spot);
                        // spot.setHeightOffset(.25);
                    }
                }
                    break;
                case "attack": {

                    if (entities[0] && entities[0].faction == GameService.selectedEntity.faction)continue;
                    let path = this.hexBoard.pathFind(GameService.selectedHex, spot);
                    if (path.length > 1 && path.length <= radius + 1) {
                        if (entities.length == 0) {
                            spot.setHighlightColor(HexagonColorUtils.moveHighlightColor);
                            spot.setShowVotes(true);
                            selectedEntity.setSecondaryVoteColor(spot);
                            // spot.setHeightOffset(.25);
                        } else {
                            spot.setHighlightColor(HexagonColorUtils.attackHighlightColor);
                            spot.setShowVotes(true);
                            selectedEntity.setSecondaryVoteColor(spot);
                            // spot.setHeightOffset(.25);
                        }

                    }
                }
                    break;
                case "spawn": {
                    if (entities.length > 0) continue;
                    let path = this.hexBoard.pathFind(GameService.selectedHex, spot);
                    if (path.length > 1 && path.length <= radius + 1) {
                        spot.setHighlightColor(HexagonColorUtils.spawnHighlightColor);
                        spot.setShowVotes(true);
                        selectedEntity.setSecondaryVoteColor(spot);
                        // spot.setHeightOffset(.25);
                    }
                }
                    break;
            }


        }
        return true;
    }

    async processAction(hex: GridHexagon) {

        let entityDetail = EntityDetails.instance.details[GameService.selectedEntity.entityType];
        this.resetBoardColors();

        let distance = HexUtils.distance(GameService.selectedHex, hex);
        if (distance == 0) {
            GameService.resetSelection();
            return;
        }
        let radius = 0;

        switch (GameService.selectedAction) {
            case "move":
                radius = entityDetail.moveRadius;
                break;
            case "attack":
                radius = entityDetail.attackRadius;
                break;
            case "spawn":
                radius = entityDetail.spawnRadius;
                break;
        }


        if (distance > radius) {
            GameService.resetSelection();
            GameService.selectedHex = hex;
            this.startAction();
            return;
        }


        switch (GameService.selectedAction) {
            case "move": {
                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                if (entities.length > 0) {
                    GameService.selectedHex = hex;
                    GameService.setSelectedEntity(null);
                    this.startAction();
                    return;
                }
            }
                break;
            case "attack": {
                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                if (entities.length == 0) {
                    GameService.selectedHex = hex;
                    GameService.setSelectedEntity(null);
                    this.startAction();
                    return;
                }
            }
                break;
            case "spawn": {
                let entities = this.hexBoard.entityManager.getEntitiesAtTile(hex);
                if (entities.length > 0) {
                    GameService.selectedHex = hex;
                    GameService.setSelectedEntity(null);
                    this.startAction();
                    return;
                }
            }
                break;
        }

        await this.vote(GameService.selectedEntity, GameService.selectedAction, hex.x, hex.z);
        GameService.resetSelection();
    }

    findAvailableSpots(radius: number, center: Vector3): GridHexagon[] {
        let items = [];
        let hexListLength = this.hexBoard.hexListLength;
        for (let q = 0; q < hexListLength; q++) {
            let item = this.hexBoard.hexList[q];

            if (HexUtils.distance(center, item) <= radius) {
                items.push(item);
            }
        }
        return items;
    }

    private async randomTap() {

        if (this.cantAct()) {
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
        await this.vote(ent, 'move', px, pz);
        setTimeout(() => {
            this.randomTap()
        }, Math.random() * 1000 + 100);
    }

    private async vote(entity: BaseEntity, action: PossibleActions, px: number, pz: number) {
        let result = await DataService.vote({
            entityId: entity.id,
            action: action,
            userId: 'foo',
            generation: this.hexBoard.generation,
            x: px,
            z: pz
        });
        if (result) {
            if (result.generationMismatch) {
                await this.checkState();
            } else if (result.issueVoting) {
                console.log('issue voting');
            } else {
                entity.resetVotes();
                for (let i = 0; i < result.votes.length; i++) {
                    let vote = result.votes[i];
                    entity.pushVote(vote);
                }
                this.rebuildMiniBoard(true, entity);
            }
        }
    }


    async tapHex(x: number, y: number) {
        if (this.cantAct()) {
            return;
        }


        let hex = this.getHexAtPoint(x, y);
        if (!hex) {
            GameService.resetSelection();
            return;
        }


        if (!GameService.selectedHex) {
            GameService.selectedHex = hex;
            this.startAction()
        } else {
            await this.processAction(hex);
        }
    }

    resize(width: number, height: number) {
        this.viewPort.setSize(width, height);
        this.constrainViewPort();
    }

    offsetView(x: number, y: number) {
        this.setView(this.viewPort.getX() + x, this.viewPort.getY() + y);
    }

    setView(x: number, y: number) {
        this.viewPort.setPosition(x, y);
        this.constrainViewPort();

        this.viewPort.setLocalStorage();
    }


    constrainViewPort() {

        this.viewPort.constrainViewPort(this.hexBoard.gameDimensions());
        this.hexBoard.resetVisibleHexList(this.viewPort);
    }

    getHexAtPoint(clickX: number, clickY: number): GridHexagon {
        let lastClick: GridHexagon = null;

        clickX /= this.viewPort.getScale().x;
        clickY /= this.viewPort.getScale().y;

        clickX += this.viewPort.getZoomedX();
        clickY += this.viewPort.getZoomedY();

        let hexWidth = GridHexagonConstants.width * 3 / 4;
        let gridHeight = GridHexagonConstants.height();


        let hexListLength = this.hexBoard.hexListLength;
        for (let i = 0; i < hexListLength; i++) {
            const gridHexagon = this.hexBoard.hexList[i];
            const x = hexWidth * gridHexagon.x;
            let z = gridHexagon.z * gridHeight + ((gridHexagon.x % 2 === 1) ? (-gridHeight / 2) : 0);
            z -= gridHexagon.getDepthHeight(true);
            z += gridHexagon.y * GridHexagonConstants.depthHeight();

            let depthHeight = gridHexagon.getDepthHeight(false);


            let offClickX = clickX - x;
            let offClickY = clickY - z;
            if (DrawingUtils.pointInPolygon(offClickX, offClickY, GridHexagonConstants.hexagonTopPolygon())) {
                lastClick = gridHexagon;
            } else if (DrawingUtils.pointInPolygon(offClickX, offClickY, GridHexagonConstants.hexagonDepthLeftPolygon(depthHeight))) {
                lastClick = gridHexagon;
            } else if (DrawingUtils.pointInPolygon(offClickX, offClickY, GridHexagonConstants.hexagonDepthBottomPolygon(depthHeight))) {
                lastClick = gridHexagon;
            } else if (DrawingUtils.pointInPolygon(offClickX, offClickY, GridHexagonConstants.hexagonDepthRightPolygon(depthHeight))) {
                lastClick = gridHexagon;
            }
        }
        console.log(lastClick.x, lastClick.z);
        return lastClick;
    }

    centerOnHex(gridHexagon: GridHexagon): void {
        const x = gridHexagon.getRealX();
        const y = gridHexagon.getRealZ();
        this.setView(x - this.viewPort.getWidth() / 2, y - this.viewPort.getHeight() / 2);
    }

    private resetBoardColors() {
        let length = this.hexBoard.hexListLength;
        for (let i = 0; i < length; i++) {
            let h = this.hexBoard.hexList[i];
            h.clearHighlightColor();
            h.clearSecondaryVoteColor();
            h.setShowVotes(true);
        }
    }
}

