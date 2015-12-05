function AssetManager(completed) {
  this.assetQueue = {};
  this.assets = {};
  this.completed = completed;
  this.$assetsLoaded = 0;
  this.$assetsRequested = 0;
}
AssetManager.prototype.start = function () {
  for (var name in this.assetQueue) {
    if (this.assetQueue.hasOwnProperty(name)) {
      var img = new Image();
      img.src = this.assetQueue[name];
      img.onload = this.$imageLoaded.call(this, img, name);
    }
  }
};


AssetManager.prototype.addAsset = function (name, url) {
  this.assetQueue[name] = url;
  this.$assetsRequested++;
};
AssetManager.prototype.$imageLoaded = function (img, name) {
  this.assets[name] = img;
  this.$assetsLoaded++;
  if (this.$assetsLoaded == this.$assetsRequested) {
    this.completed();
  }
};