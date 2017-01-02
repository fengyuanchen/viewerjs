    open: function () {
      var body = this.body;

      addClass(body, CLASS_OPEN);
      body.style.paddingRight = this.scrollbarWidth + 'px';
    },

    close: function () {
      var body = this.body;

      removeClass(body, CLASS_OPEN);
      body.style.paddingRight = 0;
    },

    shown: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;

      _this.transitioning = false;
      _this.isFulled = true;
      _this.isShown = true;
      _this.isVisible = true;
      _this.render();
      _this.bind();

      if (isFunction(options.shown)) {
        addListener(element, EVENT_SHOWN, options.shown, true);
      }

      dispatchEvent(element, EVENT_SHOWN);
    },

    hidden: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;

      _this.transitioning = false;
      _this.isViewed = false;
      _this.isFulled = false;
      _this.isShown = false;
      _this.isVisible = false;
      _this.unbind();
      _this.close();
      addClass(_this.viewer, CLASS_HIDE);
      _this.resetList();
      _this.resetImage();

      if (isFunction(options.hidden)) {
        addListener(element, EVENT_HIDDEN, options.hidden, true);
      }

      dispatchEvent(element, EVENT_HIDDEN);
    },

    requestFullscreen: function () {
      var _this = this;
      var documentElement = document.documentElement;

      if (_this.isFulled && !document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (documentElement.requestFullscreen) {
          documentElement.requestFullscreen();
        } else if (documentElement.msRequestFullscreen) {
          documentElement.msRequestFullscreen();
        } else if (documentElement.mozRequestFullScreen) {
          documentElement.mozRequestFullScreen();
        } else if (documentElement.webkitRequestFullscreen) {
          documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
    },

    exitFullscreen: function () {
      var _this = this;

      if (_this.isFulled) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },

    change: function (e) {
      var _this = this;
      var pointers = _this.pointers;
      var pointer = pointers[Object.keys(pointers)[0]];
      var offsetX = pointer.endX - pointer.startX;
      var offsetY = pointer.endY - pointer.startY;

      switch (_this.action) {

        // Move the current image
        case 'move':
          _this.move(offsetX, offsetY);
          break;

        // Zoom the current image
        case 'zoom':
          _this.zoom(getMaxZoomRatio(pointers), false, e);
          break;

        case 'switch':
          _this.action = 'switched';

          if (abs(offsetX) > abs(offsetY)) {
            if (offsetX > 1) {
              _this.prev();
            } else if (offsetX < -1) {
              _this.next();
            }
          }

          break;

        // No default
      }

      // Override
      each(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    },

    isSwitchable: function () {
      var _this = this;
      var imageData = _this.imageData;
      var viewerData = _this.viewerData;

      return _this.length > 1 && imageData.left >= 0 && imageData.top >= 0 &&
        imageData.width <= viewerData.width &&
        imageData.height <= viewerData.height;
    }
  };
