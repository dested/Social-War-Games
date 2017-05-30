import {GameMetricsVote} from "./models/hexBoard";
import {HexBoard} from "./game/hexBoard";
import {BaseEntity} from "./entities/baseEntity";

export class AnimationManager {
    private complete: () => void;
    private frames: AnimationFrame[][];
    private frameIndex: number = 0;
    public isRunning: boolean = false;

    constructor(private hexBoard: HexBoard) {


    }

    reset() {
        this.frames = [];
        this.frameIndex = 0;
        this.isRunning = false;
    }

    setVotes(votes: GameMetricsVote[]) {
        let allFrames = [];
        let maxLength = 0;
        for (let i = 0; i < votes.length; i++) {
            let vote = votes[i];
            let action = vote.action;
            let entity = this.hexBoard.entityManager.getEntityById(action.entityId);
            if (!entity) {
                //idk
                continue;
            }
            let actionFrames = entity.getActionFrames(action, this.hexBoard);
            if (actionFrames.length > maxLength) {
                maxLength = actionFrames.length;
            }
            allFrames.push(actionFrames);
        }
        this.frames = [];

        for (let c = 0; c < maxLength; c++) {
            let frameCollection: AnimationFrame[] = [];
            for (let i = 0; i < allFrames.length; i++) {
                if (allFrames[i][c]) {
                    frameCollection.push(allFrames[i][c]);
                }
            }
            this.frames.push(frameCollection);
        }
    }

    start() {
        this.isRunning = true;
        let duration = 400;

        let frames = this.frames[this.frameIndex++];

        if (!frames) {
            this.isRunning = false;
            this.complete();
            return;
        }

        for (let i = 0; i < frames.length; i++) {
            let frame = frames[i];
            frame.entity.onAnimationStart(frame);
            frame.entity.executeFrame(this.hexBoard, frame, duration);
        }

        setTimeout(() => {
            for (let i = 0; i < frames.length; i++) {
                let frame = frames[i];
                frame.entity.onAnimationComplete(frame);
            }
            this.start();
        }, duration);

    }

    onComplete(callback: () => void) {
        this.complete = callback;
    }
}

export interface AnimationFrame {
    frameType: AnimationFrameType;
    type: AnimationType;
    startX: number;
    startZ: number;
    endX?: number;
    endZ?: number;
    entity: BaseEntity;
}
export enum AnimationFrameType{
    Start,
    Tick,
    Stop,
}
export enum AnimationType{
    Move,
    Attack
}