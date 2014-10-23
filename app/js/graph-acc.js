function Graph(canvasId, options) {
  this.$canvas = $(canvasId);
  this.context = this.$canvas[0].getContext('2d');
  this.values = [];
  this.options = options;

  var $wrapper = this.$canvas.parent();
  this.$canvas.attr({ width: $wrapper.width(), height: $wrapper.height() });
}

Graph.prototype.add = function(value) {
  this.values.push(value);
  if (this.values.length > this.$canvas.width()) {
    this.values.shift();
  }
  this.draw();
};

Graph.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
}

Graph.prototype.setOptions = function(options) {
  if (_.has(this.options, 'color')) {
    this.context.strokeStyle = this.options.color;
  }
  this.context.lineWidth = 1;
}

Graph.prototype.draw = function() {
  var self = this;
  self.setOptions();
  self.clearCanvas();
  var t = 0;
  _.each(self.values, function(v) {
    var y = v;
    if (_.has(self.options, 'max') && _.has(self.options.max, 'y')) {
      y = v * self.$canvas.height() / self.options.max.y;
    }
    if (t < 1) {
      self.context.moveTo(t, self.$canvas.height() - y);
    } else {
      self.context.lineTo(t, self.$canvas.height() - y);
    }
    t += 1;
  });
  self.context.stroke();
}
