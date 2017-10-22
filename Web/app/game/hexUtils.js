"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node = (function () {
    function Node(parent, piece) {
        this.parent = null;
        this.x = 0;
        this.z = 0;
        this.item = null;
        this.f = 0;
        this.g = 0;
        this.parent = parent;
        // array index of this Node in the world linear array
        // the location coordinates of this Node
        this.x = piece.x;
        this.z = piece.z;
        this.item = piece;
        // the distanceFunction cost to get
        // TO this Node from the START
        this.f = 0;
        // the distanceFunction cost to get
        // from this Node to the GOAL
        this.g = 0;
    }
    Node.prototype.value = function () {
        return this.x + (this.z * 5000);
    };
    return Node;
}());
exports.Node = Node;
var HexUtils = (function () {
    function HexUtils() {
    }
    HexUtils.distance = function (p1, p2) {
        var x1 = p1.x;
        var y1 = p1.z;
        var x2 = p2.x;
        var y2 = p2.z;
        var du = x2 - x1;
        var dv = (y2 + ((x2 / 2) | 0)) - (y1 + ((x1 / 2) | 0));
        if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0))
            return Math.max(Math.abs(du), Math.abs(dv));
        else
            return Math.abs(du) + Math.abs(dv);
    };
    HexUtils.orderBy = function (list, callback) {
        var itms = [];
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            itms.push({ item: obj, val: callback(obj) });
        }
        itms.sort(function (a, b) { return (a.val - b.val); });
        list = [];
        for (var i = 0; i < itms.length; i++) {
            var obj1 = itms[i];
            list.push(obj1.item);
        }
        return list;
    };
    HexUtils.mathSign = function (f) {
        if (f < 0)
            return -1;
        else if (f > 0)
            return 1;
        return 0;
    };
    HexUtils.getDirection = function (p1, p2) {
        // console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
        var upDown;
        var leftRight;
        if (p1.x % 2 == 0) {
            if (p1.z === p2.z) {
                upDown = 'up';
            }
            else if (p1.z < p2.z) {
                upDown = 'down';
            }
            else if (p1.z > p2.z) {
                upDown = 'up';
            }
        }
        else {
            if (p1.z === p2.z) {
                upDown = 'down';
            }
            else if (p1.z < p2.z) {
                upDown = 'down';
            }
            else if (p1.z > p2.z) {
                upDown = 'up';
            }
        }
        if (p1.x < p2.x) {
            leftRight = "right";
        }
        else if (p1.x > p2.x) {
            leftRight = "left";
        }
        else {
            leftRight = "neither";
        }
        switch (leftRight) {
            case "left":
                switch (upDown) {
                    case "up":
                        return Direction.TopLeft;
                    case "down":
                        return Direction.BottomLeft;
                }
                break;
            case "right":
                switch (upDown) {
                    case "up":
                        return Direction.TopRight;
                    case "down":
                        return Direction.BottomRight;
                }
                break;
            case "neither":
                switch (upDown) {
                    case "up":
                        return Direction.Top;
                    case "down":
                        return Direction.Bottom;
                }
                break;
        }
    };
    return HexUtils;
}());
exports.HexUtils = HexUtils;
var Direction;
(function (Direction) {
    Direction[Direction["Top"] = 0] = "Top";
    Direction[Direction["TopRight"] = 1] = "TopRight";
    Direction[Direction["BottomRight"] = 2] = "BottomRight";
    Direction[Direction["Bottom"] = 3] = "Bottom";
    Direction[Direction["BottomLeft"] = 4] = "BottomLeft";
    Direction[Direction["TopLeft"] = 5] = "TopLeft";
})(Direction = exports.Direction || (exports.Direction = {}));
