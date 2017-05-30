import {AnimationInstance, AnimationUtils} from "../utils/animationUtils";
import {IPoint} from "../utils/utils";
import {GridHexagonConstants} from "./gridHexagonConstants";
import {DebounceUtils} from "../utils/debounceUtils";
import {GridHexagon} from "./gridHexagon";
import {GameService} from "../ui/gameService";
export class ViewPort {
    private scaleFactor: IPoint;

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getZoomedX() {
        return this.x;
    }

    getZoomedY() {
        return this.y;

    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    private x = 0;
    private y = 0;
    private width = 400;
    private height = 400;
    private padding = GridHexagonConstants.width * 2;

    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    constrainViewPort(size: { width: number; height: number }) {
        let scale = this.getScale();
        this.x = Math.max(this.x, 0 - this.padding * scale.x);
        this.y = Math.max(this.y, 0 - this.padding * scale.y);
        this.x = Math.min(this.x, size.width + this.padding * scale.x - this.width);
        this.y = Math.min(this.y, size.height + this.padding * scale.y - this.height);
    }

    setLocalStorage() {
        localStorage.setItem("lastX", this.x.toString());
        localStorage.setItem("lastY", this.y.toString());
    }

    shouldDraw(x: number, y: number) {

        let x2 = this.x;
        let padding = this.padding;
        let y2 = this.y;
        let width = this.width;
        let height = this.height;

        return x > x2 - padding &&
            x < x2 + width + padding &&
            y > y2 - padding &&
            y < y2 + height + padding;
    }


    curAnimation: AnimationInstance;

    animateZoom(scale: number, center: GridHexagon) {

        DebounceUtils.debounce("animateZoom", 10, () => {
            if (this.curAnimation) {
                this.curAnimation.cancel = true
            }

            if (scale === 1) {
                if (!this.scaleFactor)return;
                this.curAnimation = AnimationUtils.start({
                    start: this.scaleFactor.x,
                    finish: 1,
                    callback: (c) => {
                        this.scaleFactor = {x: c, y: c};
                    },
                    duration: 600,
                    easing: AnimationUtils.easings.easeOutQuint,
                    complete: () => {
                        this.curAnimation = null;
                        this.scaleFactor = null;
                    }
                });
            } else {

                AnimationUtils.start({
                    start: this.x,
                    finish: center.getRealX() - this.getWidth() / scale / 2,
                    callback: (c) => {
                        this.x = c;
                    },
                    duration: 600,
                    easing: AnimationUtils.easings.easeOutQuint,
                });
                AnimationUtils.start({
                    start: this.y,
                    finish: center.getRealZ() - this.getHeight() / scale / 2,
                    callback: (c) => {
                        this.y = c;
                        GameService.getGameManager().constrainViewPort()
                    },
                    duration: 600,
                    easing: AnimationUtils.easings.easeOutQuint,
                });


                if (!this.scaleFactor) {
                    this.curAnimation = AnimationUtils.start({
                        start: 1,
                        finish: scale,
                        callback: (c) => {
                            this.scaleFactor = {x: c, y: c};
                        },
                        duration: 600,
                        easing: AnimationUtils.easings.easeOutQuint,
                        complete: () => {
                            this.curAnimation = null;
                        }
                    });

                }

            }
        })

    }

    offset(context: CanvasRenderingContext2D) {
        if (this.scaleFactor) {
            context.scale(this.scaleFactor.x, this.scaleFactor.y);
        }
        context.translate(-this.getX(), -this.getY());

    }

    static defaultScaleFactor = {x: 1, y: 1};

    getScale() {
        return this.scaleFactor || ViewPort.defaultScaleFactor;
    }
}