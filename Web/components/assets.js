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

      img.onload = (function (that, img, name) {
        return (function () {
          that.$imageLoaded(img, name);
        })
      })(this, img, name);


      img.src = this.assetQueue[name].url;
    }
  }
};

AssetManager.prototype.addAsset = function (name, url, size, base) {
  this.assetQueue[name] = {base: base, size: size, url: url};
  this.$assetsRequested++;
};
AssetManager.prototype.$imageLoaded = function (img, name) {
  this.assets[name] = {
    image: img
  };
  this.assets[name].size = this.assetQueue[name].size || {width: img.width, height: img.height};
  this.assets[name].base = this.assetQueue[name].base || {x: this.assets[name].size.width / 2, y: this.assets[name].size.height / 2};

  this.$assetsLoaded++;
  if (this.$assetsLoaded == this.$assetsRequested) {
    setTimeout((function(){
      this.completed();
    }).bind(this),100);

  }
};