import {Point} from "./utils";
import {ColorUtils} from "./color";
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


export class HexagonColorUtils{

    static baseColors: HexagonColor[];
    static factionHexColors: HexagonColor[][];
    static factionColors: string[];

    static entityHexColor = new HexagonColor("#f0c2bc");

    static baseColor = new HexagonColor('#FFFFFF');
    static highlightColor = new HexagonColor('#00F9FF');
    static selectedHighlightColor = new HexagonColor('#6B90FF');
    static moveHighlightColor = new HexagonColor('#BE9EFF');
    static attackHighlightColor = new HexagonColor('#91F9CF');

    public static setupColors() {
        this.baseColors = [new HexagonColor('#AFFFFF')];
        for (let i = 0; i < 6; i++) {
            this.baseColors.push(new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6))));
        }
        this.factionColors = ["#4953FF", "#FF4F66", "#00FF43"];
        this.factionHexColors = [];

        for (let f = 0; f < this.factionColors.length; f++) {
            this.factionHexColors[f] = [];
            this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.baseColors[0].color, this.factionColors[f], 0.6)));
            for (let i = 0; i < 6; i++) {
                this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.baseColors[i + 1].color, DrawingUtils.colorLuminance(this.factionColors[f], (i / 6)), 0.6)));
            }
        }

    }
}
