

import {Point, IntersectingRectangle } from "./Utils";
import {Color} from "./Color";

export class Help {

    public static mod(j: number, n: number): number {
        return ((j % n) + n) % n;
    }
    private static getBase64Image(data: ImageData): string {
        let canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;
        let ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        let dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
    public static getImageData(image: HTMLImageElement): ImageData {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let data = ctx.getImageData(0, 0, image.width, image.height);
        return data;
    }
    public static isLoaded(element: HTMLImageElement): boolean {
        return element.getAttribute("loaded") == "true";
    }
    public static loaded(element: HTMLImageElement, set: boolean ): void {
        element.setAttribute("loaded", set ? "true" : "false");
    }
    public static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        let sprite1 = new Image();
        sprite1.addEventListener("load",
            e => {
                Help.loaded(sprite1, true);
                if (complete)
                    complete(sprite1);
            },
            false);
        sprite1.src = src;
        return sprite1;
    }
    public static degToRad(angle: number): number {
        return angle * Math.PI / 180;
    }
    public static sign(m: number): number {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    }
    public static floor(spinDashSpeed: number): number {
        if (spinDashSpeed > 0)
            return ~~spinDashSpeed;
        return Math.floor(spinDashSpeed) | 0;
    }
    public static max(f1: number, f2: number): number {
        return f1 < f2 ? f2 : f1;
    }
    public static min(f1: number, f2: number): number {
        return f1 > f2 ? f2 : f1;
    }
    public static getCursorPosition(ev: JQueryEventObject): Point {
        if (ev.originalEvent && (<any>ev.originalEvent).targetTouches && (<any>ev.originalEvent).targetTouches.length > 0)
            ev = <any>((<any>ev.originalEvent).targetTouches[0]);
        if (ev.pageX && ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        return new Point(ev.clientX, ev.clientY/*, 0, ev.Which == 3*/);
    }
    public static getQueryString(): { [key: string]: string } {
        let result: { [key: string]: string } = {};
        let queryString: string = window.location.search.substring(1);
        let re = new RegExp("/([^&=]+)=([^&]*)/g");
        let m;
        while ((m = re.exec(queryString)) != null) {
            result[(<any>window).decodeURIComponent(m[1])] = (<any>window).decodeURIComponent(m[2]);
        }
        return result;
    }
    static merge<T>(base: T, update: any ): T {
        for (let i in update) {
            base[i] = update[i];
        }
        return base;
    }

}

