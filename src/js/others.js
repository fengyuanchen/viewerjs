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
      removeClass(_this.body, CLASS_OPEN);
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

    change: function (originalEvent) {
      var _this = this;
      var offsetX = _this.endX - _this.startX;
      var offsetY = _this.endY - _this.startY;

      switch (_this.action) {

        // Move the current image
        case 'move':
          _this.move(offsetX, offsetY);
          break;

        // Zoom the current image
        case 'zoom':
          _this.zoom(function (x1, y1, x2, y2) {
            var z1 = sqrt(x1 * x1 + y1 * y1);
            var z2 = sqrt(x2 * x2 + y2 * y2);

            return (z2 - z1) / z1;
          }(
            abs(_this.startX - _this.startX2),
            abs(_this.startY - _this.startY2),
            abs(_this.endX - _this.endX2),
            abs(_this.endY - _this.endY2)
          ), false, originalEvent);

          _this.startX2 = _this.endX2;
          _this.startY2 = _this.endY2;
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
      _this.startX = _this.endX;
      _this.startY = _this.endY;
    },

    isSwitchable: function () {
      var _this = this;
      var imageData = _this.imageData;
      var viewerData = _this.viewerData;

      return imageData.left >= 0 && imageData.top >= 0 &&
        imageData.width <= viewerData.width &&
        imageData.height <= viewerData.height;
    }
  };
