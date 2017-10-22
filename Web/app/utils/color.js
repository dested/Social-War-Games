"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*[Serializable]*/
var Color = (function () {
    function Color(r, g, b, a) {
        if (a === void 0) { a = 1; }
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }
    return Color;
}());
exports.Color = Color;
var ColorUtils = (function () {
    function ColorUtils() {
    }
    /*
     blend two colors to create the color that is at the percentage away from the first color
     this is a 5 step process
     1: validate input
     2: convert input to 6 char hex
     3: convert hex to rgb
     4: take the percentage to create a ratio between the two colors
     5: convert blend to hex
     @param: color1      => the first color, hex (ie: #000000)
     @param: color2      => the second color, hex (ie: #ffffff)
     @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
     @returns: string    => the third color, hex, representation of the blend between color1 and color2 at the given percentage
     */
    ColorUtils.blend_colors = function (color1, color2, percentage) {
        // check input
        color1 = color1 || '#000000';
        color2 = color2 || '#ffffff';
        percentage = percentage || 0.5;
        // 1: validate input, make sure we have provided a valid hex
        if (color1.length != 4 && color1.length != 7)
            throw new Error('colors must be provided as hexes');
        if (color2.length != 4 && color2.length != 7)
            throw new Error('colors must be provided as hexes');
        if (percentage > 1 || percentage < 0)
            throw new Error('percentage must be between 0 and 1');
        // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
        //      the three character hex is just a representation of the 6 hex where each character is repeated
        //      ie: #060 => #006600 (green)
        if (color1.length == 4)
            color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
        else
            color1 = color1.substring(1);
        if (color2.length == 4)
            color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
        else
            color2 = color2.substring(1);
        // 3: we have valid input, convert colors to rgb
        var colorArray1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
        var colorArray2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
        // 4: blend
        var color3 = [
            (1 - percentage) * colorArray1[0] + percentage * colorArray2[0],
            (1 - percentage) * colorArray1[1] + percentage * colorArray2[1],
            (1 - percentage) * colorArray1[2] + percentage * colorArray2[2]
        ];
        // 5: convert to hex
        // return hex
        return '#' + ColorUtils.int_to_hex(color3[0]) + ColorUtils.int_to_hex(color3[1]) + ColorUtils.int_to_hex(color3[2]);
    };
    ColorUtils.int_to_hex = function (num) {
        var hex = Math.round(num).toString(16);
        if (hex.length == 1)
            hex = '0' + hex;
        return hex;
    };
    return ColorUtils;
}());
exports.ColorUtils = ColorUtils;
