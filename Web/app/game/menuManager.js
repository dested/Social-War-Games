"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* this.pageManager.menuManager.openMenu([
 {
 image: AssetManager.getAsset("Missile").images[0],
 action: "do this"
 }, {
 image: AssetManager.getAsset("Tank").images[0],
 action: "do that"
 }], new Point(100, 100), (item) => {
 console.log(item);
 });*/
var MenuManager = (function () {
    function MenuManager(canvas) {
        this.canvas = null;
        this.context = null;
        this.items = [];
        this.selectedItem = null;
        this.isOpen = false;
        this.iconSize = 0;
        this.location = null;
        this.onClick = null;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.items = [];
        this.selectedItem = null;
        this.isOpen = false;
        this.iconSize = 100;
    }
    MenuManager.prototype.openMenu = function (items, location, onClick) {
        this.isOpen = true;
        this.location = location;
        this.items = items;
        this.onClick = onClick;
        this.selectedItem = null;
    };
    MenuManager.prototype.closeMenu = function () {
        this.canvas.width = this.canvas.width;
        this.isOpen = false;
        this.location = null;
        this.items = null;
        this.onClick = null;
        this.selectedItem = null;
    };
    MenuManager.prototype.size = function () {
        var size = { width: this.iconSize * this.items.length, height: this.iconSize };
        return size;
    };
    MenuManager.prototype.tap = function (x, y) {
        if (!this.isOpen)
            return false;
        var size = this.size();
        if (x >= this.location.x && y >= this.location.y &&
            x <= this.location.x + size.width && y <= this.location.y + size.height) {
            x -= this.location.x;
            y -= this.location.y;
            var ind = (x / this.iconSize) | 0;
            this.selectedItem = this.items[ind];
            this.onClick && this.onClick(this.selectedItem);
            return true;
        }
        return false;
    };
    MenuManager.prototype.draw = function () {
        if (!this.isOpen)
            return;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.context.translate(this.location.x, this.location.y);
        var size = this.size();
        this.context.lineWidth = 15;
        this.context.lineJoin = "round";
        this.context.strokeStyle = 'grey';
        this.context.strokeRect(0, 0, size.width, size.height);
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, size.width, size.height);
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (this.selectedItem == item) {
                this.context.fillStyle = 'red';
                this.context.fillRect(i * (this.iconSize), 0, this.iconSize, this.iconSize);
            }
        }
        for (var i = 0; i < this.items.length - 1; i++) {
            this.context.fillStyle = 'grey';
            this.context.fillRect(this.iconSize + i * (this.iconSize), 0, 2, this.iconSize);
        }
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            this.context.drawImage(item.image, i * (this.iconSize) + 5, 0 + 5, this.iconSize - 10, this.iconSize - 10);
        }
        this.context.restore();
    };
    return MenuManager;
}());
exports.MenuManager = MenuManager;
