  Viewer.prototype = {
    constructor: Viewer,

    init: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var isImg = element.tagName.toLowerCase() === 'img';
      var images = isImg ? [element] : getByTag(element, 'img');
      var length = images.length;
      var ready = proxy(_this.ready, _this);

      if (getData(element, NAMESPACE)) {
        return;
      }

      setData(element, NAMESPACE, _this);

      if (!length) {
        return;
      }

      if (isFunction(options.build)) {
        addListener(element, EVENT_BUILD, options.build, true);
      }

      if (dispatchEvent(element, EVENT_BUILD) === false) {
        return;
      }

      // Override `transition` option if it is not supported
      if (!SUPPORT_TRANSITION) {
        options.transition = false;
      }

      _this.isImg = isImg;
      _this.length = length;
      _this.count = 0;
      _this.images = images;
      _this.body = document.body;

      if (options.inline) {
        addListener(element, EVENT_BUILT, function () {
          _this.view();
        }, true);

        each(images, function (image) {
          if (image.complete) {
            ready();
          } else {
            addListener(image, EVENT_LOAD, ready, true);
          }
        });
      } else {
        addListener(element, EVENT_CLICK, (_this._start = proxy(_this.start, _this)));
      }
    },

    ready: function () {
      var _this = this;

      _this.count++;

      if (_this.count === _this.length) {
        _this.build();
      }
    },
