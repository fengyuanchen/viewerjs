  function Viewer(element, options) {
    var _this = this;

    _this.element = element;
    _this.options = extend({}, Viewer.DEFAULTS, isPlainObject(options) && options);
    _this.isImg = false;
    _this.isBuilt = false;
    _this.isShown = false;
    _this.isViewed = false;
    _this.isFulled = false;
    _this.isPlayed = false;
    _this.wheeling = false;
    _this.playing = false;
    _this.fading = false;
    _this.tooltiping = false;
    _this.transitioning = false;
    _this.action = false;
    _this.target = false;
    _this.timeout = false;
    _this.index = 0;
    _this.length = 0;
    _this.init();
  }
