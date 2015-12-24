    bind: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var viewer = _this.viewer;

      if (isFunction(options.view)) {
        addListener(element, EVENT_VIEW, options.view);
      }

      if (isFunction(options.viewed)) {
        addListener(element, EVENT_VIEWED, options.viewed);
      }

      addListener(viewer, EVENT_CLICK, (_this._click = proxy(_this.click, _this)));
      addListener(viewer, EVENT_WHEEL, (_this._wheel = proxy(_this.wheel, _this)));
      addListener(_this.canvas, EVENT_MOUSEDOWN, (_this._mousedown = proxy(_this.mousedown, _this)));
      addListener(document, EVENT_MOUSEMOVE, (_this._mousemove = proxy(_this.mousemove, _this)));
      addListener(document, EVENT_MOUSEUP, (_this._mouseup = proxy(_this.mouseup, _this)));
      addListener(document, EVENT_KEYDOWN, (_this._keydown = proxy(_this.keydown, _this)));
      addListener(window, EVENT_RESIZE, (_this._resize = proxy(_this.resize, _this)));
    },

    unbind: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var viewer = _this.viewer;

      if (isFunction(options.view)) {
        removeListener(element, EVENT_VIEW, options.view);
      }

      if (isFunction(options.viewed)) {
        removeListener(element, EVENT_VIEWED, options.viewed);
      }

      removeListener(viewer, EVENT_CLICK, _this._click);
      removeListener(viewer, EVENT_WHEEL, _this._wheel);
      removeListener(_this.canvas, EVENT_MOUSEDOWN, _this._mousedown);
      removeListener(document, EVENT_MOUSEMOVE, _this._mousemove);
      removeListener(document, EVENT_MOUSEUP, _this._mouseup);
      removeListener(document, EVENT_KEYDOWN, _this._keydown);
      removeListener(window, EVENT_RESIZE, _this._resize);
    },
