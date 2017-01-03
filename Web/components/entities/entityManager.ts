import {AssetManager} from "../hexLibraries/assetManager";
import {HexBoard} from "../hexLibraries/hexBoard";
import {GridHexagonConstants} from "../hexLibraries/gridHexagonConstants";
import {GridHexagon} from "../hexLibraries/gridHexagon";
import {Vector3, HexUtils} from "../hexLibraries/hexUtils";
import {GameMetricVoteAction, GameMetricMoveVoteAction, GameEntity, GameMetricsVote} from "../models/hexBoard";
import {AnimationFrame, AnimationFrameType} from "../animationManager";
import {Help} from "../utils/help";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
export class EntityManager {

    constructor(public hexBoard: HexBoard) {
    }


    public entities: BaseEntity[] = [];
    private entityKeys: {[entityId: number]: BaseEntity} = {};
    private entitiesMap: {[tileKey: number]: BaseEntity[]} = {};


    tick() {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            entity.tick();
        }
    }

    getEntitiesAtTile(item: Vector3): BaseEntity[] {
        return this.entitiesMap[item.x + item.z * 5000];
    }


    addEntity(entity: BaseEntity) {
        this.entities.push(entity);
        this.entityKeys[entity.id] = entity;
    }

    empty(): void {
        this.entities.length = 0;
        this.entitiesMap = {};
        this.entityKeys = {};
    }

    getEntityById(id: string): BaseEntity {
        return this.entityKeys[id];
    }

    removeEntityFromTile(tile: GridHexagon, entity: BaseEntity): void {
        let entities = this.entitiesMap[tile.x + tile.z * 5000];
        entities.splice(entities.indexOf(entity), 1);

        this.entitiesMap[tile.x + tile.z * 5000] = entities;
    }

    addEntityToTile(tile: GridHexagon, entity: BaseEntity): void {
        if (!this.entitiesMap[tile.x + tile.z * 5000]) {
            this.entitiesMap[tile.x + tile.z * 5000] = [];
        }
        this.entitiesMap[tile.x + tile.z * 5000].push(entity);
    }
}

export abstract class BaseEntity {

    animationFrame: number = 0;
    _drawTickNumber: number = (Math.random() * 1000) | 0;


    protected animateFromHex: GridHexagon = null;
    protected animateToHex: GridHexagon = null;
    protected durationTicks: number = -1;
    protected currentTick: number = -1;

    public x: number;
    public z: number;
    public key: string;
    public id: string;
    private health: number;
    private tile: GridHexagon;
    private faction: number;

    constructor(private entityManager: EntityManager, entity: GameEntity, private  totalFrames: number, private animationSpeed: number) {
        this.faction = entity.factionId;
        this.setHealth(entity.health);

    }

    setId(id: string) {
        this.id = id;
    }


    setHealth(health: number) {
        this.health = health;
    }

    setTile(tile: GridHexagon) {
        if (this.tile) {
            this.entityManager.removeEntityFromTile(this.tile, this);
            this.tile.removeEntity(this);
        }


        this.tile = tile;

        if (tile) {
            this.tile.addEntity(this);
            this.x = this.tile.getRealX();
            this.z = this.tile.getRealZ();
            this.entityManager.addEntityToTile(tile, this);
        }
    }

    getTile(): GridHexagon {
        return this.tile;
    }


    draw(context: CanvasRenderingContext2D) {

        this._drawTickNumber++;

        if (this._drawTickNumber % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
        }

        if (this.currentTick != -1) {

            let percent = this.currentTick / this.durationTicks;
            if (percent < 1) {
                this.x = Help.lerp(this.animateFromHex.getRealX(), this.animateToHex.getRealX(), percent);
                this.z = Help.lerp(this.animateFromHex.getRealZ(), this.animateToHex.getRealZ(), percent);
                this.currentTick++;
            }
        }
    }

    public tick() {
    }

    public onAnimationComplete(frame: AnimationFrame, tile: GridHexagon): void {
        if (frame.type == AnimationFrameType.Stop) {
            this.currentTick = -1;
            this.durationTicks = -1;
            this.animateToHex = null;
            this.animateFromHex = null;
        }
        let neighbors = tile.getNeighbors();
        tile.setFaction(this.faction);
        for (let j = 0; j < neighbors.length; j++) {
            let ne = neighbors[j];
            let tile = this.entityManager.hexBoard.getHexAtSpot(ne.x, ne.z);
            if (!tile)continue;
            tile.setFaction(this.faction);
        }
        this.x = tile.getRealX();
        this.z = tile.getRealZ();

        this.setTile(tile);
    }

    abstract getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] ;

    abstract executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number): void;

    private currentVotes: GameMetricsVote[] = [];

    resetVotes() {
        this.currentVotes.length = 0;
        this.getTile().clearVoteColor();
        this.getTile().clearSecondaryVoteColor();
    }

    pushVote(vote: GameMetricsVote) {
        this.currentVotes.push(vote);
        let votes = 0;
        for (let i = 0; i < this.currentVotes.length; i++) {
            votes += this.currentVotes[i].votes;
        }

        this.getTile().setVoteColor(HexagonColorUtils.voteColor[Math.min(votes, 10)]);
    }

    setSecondaryVoteColor(spot: GridHexagon) {
        let votes = 0;
        for (let i = 0; i < this.currentVotes.length; i++) {
            let currentVote = this.currentVotes[i];
            switch (currentVote.action.actionType) {
                case "Move":
                    let moveAction = <GameMetricMoveVoteAction> currentVote.action;
                    if (moveAction.x == spot.x && moveAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
            }
        }
        if (votes > 0) {
            spot.setSecondaryVoteColor(HexagonColorUtils.voteColor[Math.min(votes, 10)]);
        }
    }
}

export class SixDirectionEntity extends BaseEntity {

    currentDirection: number = (Math.random() * 6) | 0;

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.z);

        let assetName = this.key + '.' + this.currentDirectionToAssetName();
        let asset = AssetManager.assets[assetName];
        let image = asset.images[this.animationFrame];


        let ratio = (GridHexagonConstants.width / asset.size.width);


        let width = GridHexagonConstants.width;
        let height = asset.size.height * ratio;

        context.drawImage(image, -asset.base.x * ratio, -asset.base.y * ratio - this.hoverY(), width, height);


        context.restore();
    }

    currentDirectionToAssetName() {

        switch (this.currentDirection) {
            case 0:
                return "TopLeft";
            case 1:
                return "Top";
            case 2:
                return "TopRight";
            case 3:
                return "BottomRight";
            case 4:
                return "Bottom";
            case 5:
                return "BottomLeft";
            default :
                throw "Direction not found";
        }
    }

    private hoverY() {
        let offset = GridHexagonConstants.depthHeight();
        return -(Math.sin(this._drawTickNumber / 10)) * offset + offset * 1.5;
    }

    getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] {
        let frames: AnimationFrame[] = [];
        switch (action.actionType) {
            case "Move":
                let moveAction = <GameMetricMoveVoteAction>action;
                let tile = this.getTile();
                let path = hexBoard.pathFind(
                    hexBoard.getHexAtSpot(tile.x, tile.z),
                    hexBoard.getHexAtSpot(moveAction.x, moveAction.z)
                );
                frames.push({
                    type: AnimationFrameType.Start,
                    startX: path[0].x,
                    startZ: path[0].z,
                    entity: this
                });

                for (let i = 1; i < path.length; i++) {
                    let p = path[i];
                    let oldP = path[i - 1];

                    frames.push({
                        type: AnimationFrameType.Move,
                        startX: oldP.x,
                        startZ: oldP.z,
                        endX: p.x,
                        endZ: p.z,
                        entity: this
                    });
                }
                frames.push({
                    type: AnimationFrameType.Stop,
                    startX: path[path.length - 1].x,
                    startZ: path[path.length - 1].z,
                    entity: this
                });
                break;
        }

        return frames;
    }

    executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number) {
        switch (frame.type) {
            case AnimationFrameType.Move:
                let fromHex = hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                let toHex = hexBoard.getHexAtSpot(frame.endX, frame.endZ);
                this.currentDirection = HexUtils.getDirection(fromHex, toHex);
                this.animateFromHex = fromHex;
                this.animateToHex = toHex;
                this.durationTicks = Math.floor(duration / 16);
                this.currentTick = 0;

                break;
        }
    }


}

export class StationaryEntity extends BaseEntity {
    getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] {
        return [];
    }

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save();
        context.translate(this.x, this.z);

        let assetName = this.key;
        let asset = AssetManager.assets[assetName];
        let image = asset.image || asset.images[this.animationFrame];

        let ratio = (GridHexagonConstants.width / asset.size.width);

        let shrink = .75;
        let width = GridHexagonConstants.width * shrink;
        let height = asset.size.height * ratio * shrink;


        context.drawImage(image, -asset.base.x * ratio * shrink, -asset.base.y * ratio * shrink, width, height);
        context.restore();
    }

    executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number) {
    }
}

export class HeliEntity extends SixDirectionEntity {
    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 2, 10);
        this.key = 'Heli';
    }
}
export class MainBaseEntity extends StationaryEntity {
    constructor(entityManager: EntityManager, entity: GameEntity) {
        super(entityManager, entity, 0, 0);
        this.key = 'MainBase';
    }

}