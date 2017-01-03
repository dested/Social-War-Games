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
    static attackHighlightColor = new HexagonColor('#91F9CF');
    static voteColor: HexagonColor[];

    public static setupColors() {
        this.baseColors = [new HexagonColor('#AFFFFF')];
        for (let i = 0; i < 6; i++) {
            this.baseColors.push(new HexagonColor(DrawingUtils.colorLuminance('#AFF000', (i / 6))));
        }
        this.factionColors = ["#4953FF", "#FF4F66", "#00FF43"];
        this.factionHexColors = [];

        this.voteColor = [];
        this.voteColor.push(new HexagonColor("#cffffd"));
        this.voteColor.push(new HexagonColor("#7bfffd"));
        this.voteColor.push(new HexagonColor("#13dfff"));
        this.voteColor.push(new HexagonColor("#1bc1ff"));
        this.voteColor.push(new HexagonColor("#63b2ff"));
        this.voteColor.push(new HexagonColor("#4559ff"));
        this.voteColor.push(new HexagonColor("#b66aff"));
        this.voteColor.push(new HexagonColor("#ff3adc"));
        this.voteColor.push(new HexagonColor("#ffcd68"));
        this.voteColor.push(new HexagonColor("#FF6638"));
        this.voteColor.push(new HexagonColor("#FF0000"));



        for (let f = 0; f < this.factionColors.length; f++) {
            this.factionHexColors[f] = [];
            this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.baseColors[0].color, this.factionColors[f], 0.6)));
            for (let i = 0; i < 6; i++) {
                this.factionHexColors[f].push(new HexagonColor(ColorUtils.blend_colors(this.baseColors[i + 1].color, DrawingUtils.colorLuminance(this.factionColors[f], (i / 6)), 0.6)));
            }
        }

    }
}
