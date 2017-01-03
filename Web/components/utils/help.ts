import {Point, IntersectingRectangle} from "./utils";
import {Color} from "./color";

export class Help {

    public static lerp(start: number, end: number, amt: number): number {
        return start + (end - start) * amt;
    }

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

    public static loaded(element: HTMLImageElement, set: boolean): void {
        element.setAttribute("loaded", set ? "true" : "false");
    }

    public static loadSprite(src: string, complete: (_: HTMLImageElement) => void): HTMLImageElement {
        let image = new Image();
        image.addEventListener("load",
            e => {
                Help.loaded(image, true);
                if (complete)
                    complete(image);
            },
            false);
        image.src = src;
        return image;
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


    public static getQueryString(): {[key: string]: string} {
        let result: {[key: string]: string} = {};
        let queryString: string = window.location.search.substring(1);
        let re = new RegExp("/([^&=]+)=([^&]*)/g");
        let m;
        while ((m = re.exec(queryString)) != null) {
            result[(<any>window).decodeURIComponent(m[1])] = (<any>window).decodeURIComponent(m[2]);
        }
        return result;
    }

    static merge<T>(base: T, update: any): T {
        for (let i in update) {
            base[i] = update[i];
        }
        return base;
    }

}

