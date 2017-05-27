import {HexagonColor, DrawingUtils} from "./drawingUtilities";
import {ColorUtils} from "./color";
export class HexagonColorUtils {

    static baseColors: HexagonColor[];
    static factionHexColors: HexagonColor[][];
    static factionColors: string[];

    static entityHexColor = new HexagonColor("#FCFCFC");

    static baseColor = new HexagonColor('#FFFFFF');
    static highlightColor = new HexagonColor('#00F9FF');
    static selectedHighlightColor = new HexagonColor('#6B90FF');
    static moveHighlightColor = new HexagonColor('#BE9EFF');
    static attackHighlightColor = new HexagonColor('#f9a5b1');
    static spawnHighlightColor = new HexagonColor('#f7f966');
    static voteColor: HexagonColor[];
    static miniBaseColor: HexagonColor = new HexagonColor('#DCDCDC');

    public static setupColors() {
        this.baseColors = [new HexagonColor('#AFFFFF')];
        for (let i = 0; i < 6; i++) {
            this.baseColors.push(new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6))));
        }
        this.factionColors = ["#444EF0", "#D24257", "#009900"];
        this.factionHexColors = [];

        this.voteColor = [];
        this.voteColor.push(new HexagonColor("#cffffd"));
        this.voteColor.push(new HexagonColor("#7bfffd"));
        this.voteColor.push(new HexagonColor("#13dfff"));
        this.voteColor.push(new HexagonColor("#1bc1ff"));
        this.voteColor.push(new HexagonColor("#63b2ff"));
        this.voteColor.push(new HexagonColor("#a3a0ff"));
        this.voteColor.push(new HexagonColor("#b66aff"));
        this.voteColor.push(new HexagonColor("#ffb0ec"));
        this.voteColor.push(new HexagonColor("#ffcd68"));
        this.voteColor.push(new HexagonColor("#FF6638"));
        this.voteColor.push(new HexagonColor("#FF0000"));


        for (let f = 0; f < this.factionColors.length; f++) {
            this.factionHexColors[f] = [];
            for (let i = 0; i < this.baseColors.length; i++) {
                this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.baseColors[i].color, DrawingUtils.colorLuminance(this.factionColors[f], i==0?1:((i - 1) / 6)), 1)));
            }
        }

    }
}
