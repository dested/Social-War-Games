import {Point} from "./utils";
export class HexagonColor {
    color = "";
    darkBorder = "";
    dark1 = "";
    dark2 = "";
    dark3 = "";

    constructor(color: string) {
        this.color = color;
        this.darkBorder = DrawingUtils.colorLuminance(color, -0.45);
        this.dark1 = DrawingUtils.colorLuminance(color, -0.4);
        this.dark2 = DrawingUtils.colorLuminance(color, -0.55);
        this.dark3 = DrawingUtils.colorLuminance(color, -0.65);
    }

}

export class DrawingUtils {

    static drawCircle(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(0, 0, 5, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.lineWidth = 5;
        context.stroke();
    };

    static colorLuminance(hex: string, lum: number) {
        // validate hex string
        hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
        // convert to decimal and change luminosity
        let rgb = '#';
        for (let i = 0; i < 3; i++) {
            const c = parseInt(hex.substr(i * 2, 2), 16);
            const cs = (Math.round(Math.min(Math.max(0, c + c * lum), 255)) | 0).toString(16);
            rgb += (`00${cs}`).substr(cs.length);
        }
        return rgb;
    };


    static makeTransparent(hex: string, opacitiy: number): string {
        // validate hex string
        hex = hex.replace(new RegExp('[^0-9a-f]', 'gi'), '');
        // convert to decimal and change luminosity
        let rgb = 'rgba(';
        for (let i = 0; i < 3; i++) {
            const c = parseInt(hex.substr(i * 2, 2), 16);

            rgb += c + ',';
        }
        rgb += opacitiy + ")";
        return rgb;
    };

    static pointInPolygon(pointX: number, pointY: number, polygon: Point[]) {
        let isInside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (polygon[i].y > pointY !== polygon[j].y > pointY &&
                pointX < (polygon[j].x - polygon[i].x) * (pointY - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
                isInside = !isInside;
            }
        }
        return isInside;
    };

}
