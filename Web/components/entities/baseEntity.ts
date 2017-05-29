import {Direction} from "../game/hexUtils";
import {GridHexagon} from "../game/gridHexagon";
import {EntityManager, EntityUnits} from "./entityManager";
import {GameEntity, GameMetricAttackVoteAction, GameMetricMoveVoteAction, GameMetricSpawnVoteAction, GameMetricsVote, GameMetricVoteAction} from "../models/hexBoard";
import {Help} from "../utils/help";
import {AnimationFrame, AnimationFrameType, AnimationType} from "../animationManager";
import {HexagonColorUtils} from "../utils/hexagonColorUtils";
import {HexBoard} from "../game/hexBoard";


export abstract class BaseEntity {

    animationFrame: number = 0;
    drawTickNumber: number = (Math.random() * 1000) | 0;

    protected missileDirection: Direction = null;
    protected missileAnimationFrame: number = 0;
    protected missileAsset: string;
    protected missileX: number;
    protected missileZ: number;

    abstract realYOffset(): number;

    abstract realXOffset(): number;

    protected _move_animateFromHex: GridHexagon = null;
    protected _move_animateToHex: GridHexagon = null;
    protected _move_durationTicks: number = -1;
    protected _move_currentTick: number = -1;


    protected _attack_animateFromHex: GridHexagon = null;
    protected _attack_animateToHex: GridHexagon = null;
    protected _attack_durationTicks: number = -1;
    protected _attack_currentTick: number = -1;


    public x: number;
    public z: number;
    public entityType: EntityUnits;
    public id: string;
    public health: number;
    private tile: GridHexagon;
    public faction: number;

    public totalVoteCount: number;

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

        this.drawTickNumber++;

        if (this.drawTickNumber % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
        }

        if (this._move_currentTick != -1) {

            let percent = this._move_currentTick / this._move_durationTicks;
            if (percent < 1) {
                this.x = Help.lerp(this._move_animateFromHex.getRealX(), this._move_animateToHex.getRealX(), percent);
                this.z = Help.lerp(this._move_animateFromHex.getRealZ(), this._move_animateToHex.getRealZ(), percent);
                this._move_currentTick++;
            }
        }

        if (this._attack_currentTick != -1) {


            /*         if (this.drawTickNumber % this.animationSpeed === 0) {
             this.missileAnimationFrame = (this.missileAnimationFrame + 1) % this.totalFrames;
             }*/

            this.missileAsset = 'Missile';
            let percent = this._attack_currentTick / this._attack_durationTicks;
            if (percent < 1) {
                this.missileX = Help.lerp(this._attack_animateFromHex.getRealX(), this._attack_animateToHex.getRealX(), percent);
                this.missileZ = Help.lerp(this._attack_animateFromHex.getRealZ(), this._attack_animateToHex.getRealZ(), percent);
                this._attack_currentTick++;
            }
        }

    }

    public tick() {
    }

    public onAnimationComplete(frame: AnimationFrame): void {
        switch (frame.type) {
            case AnimationType.Move: {
                if (frame.frameType == AnimationFrameType.Stop) {
                    let tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                    tile.clearHighlightColor();
                    this._move_currentTick = -1;
                    this._move_durationTicks = -1;
                    this._move_animateToHex = null;
                    this._move_animateFromHex = null;
                    return;
                }

                let startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                startTile.clearHighlightColor();

                let tile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
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
                break;
            }
            case AnimationType.Attack: {
                if (frame.frameType == AnimationFrameType.Stop) {
                    this._attack_currentTick = -1;
                    this._attack_durationTicks = -1;
                    this._attack_animateToHex = null;
                    this._attack_animateFromHex = null;
                    this.missileAsset = null;
                    return;
                }
                break;
            }

        }
    }

    public onAnimationStart(frame: AnimationFrame): void {

        switch (frame.type) {
            case AnimationType.Move: {
                if (frame.frameType == AnimationFrameType.Start) {
                    this._move_currentTick = -1;
                    this._move_durationTicks = -1;
                    this._move_animateToHex = null;
                    this._move_animateFromHex = null;
                    return;
                }
                let startTile = this.entityManager.hexBoard.getHexAtSpot(frame.startX, frame.startZ);
                let nextTile = this.entityManager.hexBoard.getHexAtSpot(frame.endX || frame.startX, frame.endZ || frame.startZ);
                startTile.setHighlightColor(HexagonColorUtils.highlightColor);
                nextTile.setHighlightColor(HexagonColorUtils.highlightColor);
                break;
            }
            case AnimationType.Attack: {
                if (frame.frameType == AnimationFrameType.Start) {
                    this._attack_currentTick = -1;
                    this._attack_durationTicks = -1;
                    this._attack_animateToHex = null;
                    this._attack_animateFromHex = null;
                    return;
                }
                break;
            }
        }


    }

    abstract getActionFrames(action: GameMetricVoteAction, hexBoard: HexBoard): AnimationFrame[] ;

    abstract executeFrame(hexBoard: HexBoard, frame: AnimationFrame, duration: number): void;

    private currentVotes: GameMetricsVote[] = [];

    resetVotes() {
        this.currentVotes.length = 0;
        this.totalVoteCount = 0;
        this.getTile().clearVoteColor();
        this.getTile().clearSecondaryVoteColor();
    }

    pushVote(vote: GameMetricsVote) {
        this.currentVotes.push(vote);
        let votes = 0;
        for (let i = 0; i < this.currentVotes.length; i++) {
            votes += this.currentVotes[i].votes;
        }
        this.totalVoteCount = votes;
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
                case "Attack":
                    let attackAction = <GameMetricAttackVoteAction> currentVote.action;
                    if (attackAction.x == spot.x && attackAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
                case "Spawn":
                    let spawnAction = <GameMetricSpawnVoteAction> currentVote.action;
                    if (spawnAction.x == spot.x && spawnAction.z == spot.z) {
                        votes += currentVote.votes;
                    }
                    break;
            }
        }
        if (votes > 0) {
            spot.setSecondaryVoteColor(HexagonColorUtils.voteColor[Math.min(votes, 10)]);
        }
    }

    abstract getYOffset(): number;

    stillAlive: boolean = false;

    markAlive() {
        this.stillAlive = true;
    }
}
