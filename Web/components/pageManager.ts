import {MenuManager} from "./game/menuManager";
import {HexUtils} from "./game/hexUtils";
import {GameManager} from "./game/gameManager";
import {HexagonColorUtils} from "./utils/hexagonColorUtils";
import {IPoint} from "./utils/utils";
declare let Hammer: any;
export class PageManager {
    menuManager: MenuManager;
    private gameManager: GameManager;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private swipeVelocity = {x: 0, y: 0};
    private tapStart = {x: 0, y: 0};
    private fpsMeter: any;

    constructor() {
    }

    async init() {
        this.gameManager = new GameManager(this);

        await this.gameManager.init();

        this.fpsMeter = new (<any>window).FPSMeter(document.body, {
            right: '5px',
            left: 'auto',
            heat: 1
        });
        HexagonColorUtils.setupColors();

        this.canvas = <HTMLCanvasElement>document.getElementById("hex");
        this.context = this.canvas.getContext("2d");
        let menu = <HTMLCanvasElement> document.getElementById("menu");
        this.menuManager = new MenuManager(menu);

        let overlay = document.getElementById("overlay");

        let mc = new Hammer.Manager(overlay);
        mc.add(new Hammer.Pan({threshold: 0, pointers: 0}));
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Tap());
        window.onresize = () => {
            this.canvas.width = document.body.clientWidth;
            this.canvas.height = document.body.clientHeight;
            this.gameManager.resize(this.canvas.width, this.canvas.height);
        };
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';

        this.gameManager.resize(this.canvas.width, this.canvas.height);


        mc.on('panstart', (ev: { deltaX: number, deltaY: number }) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            this.swipeVelocity.x = this.swipeVelocity.y = 0;
            this.tapStart.x = this.gameManager.viewPort.getX();
            this.tapStart.y = this.gameManager.viewPort.getY();
            var scaleFactor = this.gameManager.viewPort.getScale();
            this.gameManager.setView(this.tapStart.x - ev.deltaX / scaleFactor.x, this.tapStart.y - ev.deltaY / scaleFactor.y);
            return true;
        });
        mc.on('panmove', (ev: { deltaX: number, deltaY: number }) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            var scaleFactor = this.gameManager.viewPort.getScale();
            this.gameManager.setView(this.tapStart.x - ev.deltaX / scaleFactor.x, this.tapStart.y - ev.deltaY / scaleFactor.y);
        });

        mc.on('swipe', (ev: { velocityX: number, velocityY: number }) => {
            if (this.menuManager.isOpen) {
                return false;
            }
            this.menuManager.closeMenu();
            var scaleFactor = this.gameManager.viewPort.getScale();
            this.swipeVelocity.x = ev.velocityX * 10 / scaleFactor.x;
            this.swipeVelocity.y = ev.velocityY * 10 / scaleFactor.y;
        });

        mc.on('tap', (ev: { center: IPoint }) => {
            let x = <number> ev.center.x;
            let y = <number> ev.center.y;
            this.swipeVelocity.x = this.swipeVelocity.y = 0;
            if (!this.menuManager.tap(x, y)) {
                this.gameManager.tapHex(x, y)
            }
        });
        this.draw();
    }

    draw() {
        this.tick();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gameManager.draw(this.context);
        this.menuManager.draw();
        this.fpsMeter.tick();
        requestAnimationFrame(() => {
            this.draw();
        });
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
        if (Math.abs(this.swipeVelocity.x) > 0 || Math.abs(this.swipeVelocity.y) > 0) {
            this.gameManager.offsetView(-this.swipeVelocity.x, -this.swipeVelocity.y);
        }
        /*else {
            this.gameManager.hexBoard.resetVisibleHexList()
        }*/
        this.gameManager.tick();
    }
}