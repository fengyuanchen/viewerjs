    start: function (event) {
      var _this = this;
      var e = getEvent(event);
      var target = e.target;

      if (target.tagName.toLowerCase() === 'img') {
        _this.target = target;
        _this.show();
      }
    },

    click: function (event) {
      var _this = this;
      var e = getEvent(event);
      var target = e.target;
      var action = getData(target, 'action');
      var imageData = _this.imageData;

      switch (action) {
        case 'mix':
          if (_this.isPlayed) {
            _this.stop();
          } else {
            if (_this.options.inline) {
              if (_this.isFulled) {
                _this.exit();
              } else {
                _this.full();
              }
            } else {
              _this.hide();
            }
          }

          break;

        case 'view':
          _this.view(getData(target, 'index'));
          break;

        case 'zoom-in':
          _this.zoom(0.1, true);
          break;

        case 'zoom-out':
          _this.zoom(-0.1, true);
          break;

        case 'one-to-one':
          _this.toggle();
          break;

        case 'reset':
          _this.reset();
          break;

        case 'prev':
          _this.prev();
          break;

        case 'play':
          _this.play();
          break;

        case 'next':
          _this.next();
          break;

        case 'rotate-left':
          _this.rotate(-90);
          break;

        case 'rotate-right':
          _this.rotate(90);
          break;

        case 'flip-horizontal':
          _this.scaleX(-imageData.scaleX || -1);
          break;

        case 'flip-vertical':
          _this.scaleY(-imageData.scaleY || -1);
          break;

        default:
          if (_this.isPlayed) {
            _this.stop();
          }
      }
    },

    load: function () {
      var _this = this;
      var options = _this.options;
      var image = _this.image;
      var index = _this.index;
      var viewerData = _this.viewerData;

      if (_this.timeout) {
        clearTimeout(_this.timeout);
        _this.timeout = false;
      }

      removeClass(image, CLASS_INVISIBLE);

      image.style.cssText = (
        'width:0;' +
        'height:0;' +
        'margin-left:' + viewerData.width / 2 + 'px;' +
        'margin-top:' + viewerData.height / 2 + 'px;' +
        'max-width:none!important;' +
        'visibility:visible;'
      );

      _this.initImage(function () {
        toggleClass(image, CLASS_TRANSITION, options.transition);
        toggleClass(image, CLASS_MOVE, options.movable);

        _this.renderImage(function () {
          _this.isViewed = true;
          dispatchEvent(_this.element, EVENT_VIEWED, {
            originalImage: _this.images[index],
            index: index,
            image: image
          });
        });
      });
    },

    loadImage: function (event) {
      var e = getEvent(event);
      var image = e.target;
      var parent = image.parentNode;
      var parentWidth = parent.offsetWidth || 30;
      var parentHeight = parent.offsetHeight || 50;
      var filled = !!getData(image, 'filled');

      getImageSize(image, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = parentWidth;
        var height = parentHeight;

        if (parentHeight * aspectRatio > parentWidth) {
          if (filled) {
            width = parentHeight * aspectRatio;
          } else {
            height = parentWidth / aspectRatio;
          }
        } else {
          if (filled) {
            height = parentWidth / aspectRatio;
          } else {
            width = parentHeight * aspectRatio;
          }
        }

        setStyle(image, {
          width: width,
          height: height,
          marginLeft: (parentWidth - width) / 2,
          marginTop: (parentHeight - height) / 2
        });
      });
    },

    resize: function () {
      var _this = this;

      _this.initContainer();
      _this.initViewer();
      _this.renderViewer();
      _this.renderList();

      if (_this.isViewed) {
        _this.initImage(function () {
          _this.renderImage();
        });
      }

      if (_this.isPlayed) {
        each(getByTag(_this.player, 'img'), function (image) {
          addListener(image, EVENT_LOAD, proxy(_this.loadImage, _this), true);
          dispatchEvent(image, EVENT_LOAD);
        });
      }
    },

    wheel: function (event) {
      var _this = this;
      var e = getEvent(event);
      var ratio = Number(_this.options.zoomRatio) || 0.1;
      var delta = 1;

      if (!_this.isViewed) {
        return;
      }

      preventDefault(e);

      // Limit wheel speed to prevent zoom too fast
      if (_this.wheeling) {
        return;
      }

      _this.wheeling = true;

      setTimeout(function () {
        _this.wheeling = false;
      }, 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      _this.zoom(-delta * ratio, true, e);
    },

    keydown: function (event) {
      var _this = this;
      var e = getEvent(event);
      var options = _this.options;
      var key = e.keyCode || e.which || e.charCode;

      if (!_this.isFulled || !options.keyboard) {
        return;
      }

      switch (key) {

        // (Key: Esc)
        case 27:
          if (_this.isPlayed) {
            _this.stop();
          } else {
            if (options.inline) {
              if (_this.isFulled) {
                _this.exit();
              }
            } else {
              _this.hide();
            }
          }

          break;

        // (Key: Space)
        case 32:
          if (_this.isPlayed) {
            _this.stop();
          }

          break;

        // View previous (Key: ←)
        case 37:
          _this.prev();
          break;

        // Zoom in (Key: ↑)
        case 38:

          // Prevent scroll on Firefox
          preventDefault(e);

          _this.zoom(options.zoomRatio, true);
          break;

        // View next (Key: →)
        case 39:
          _this.next();
          break;

        // Zoom out (Key: ↓)
        case 40:

          // Prevent scroll on Firefox
          preventDefault(e);

          _this.zoom(-options.zoomRatio, true);
          break;

        // Zoom out to initial size (Key: Ctrl + 0)
        case 48:
          // Go to next

        // Zoom in to natural size (Key: Ctrl + 1)
        case 49:
          if (e.ctrlKey || e.shiftKey) {
            preventDefault(e);
            _this.toggle();
          }

          break;

        // No default
      }
    },

    mousedown: function (event) {
      var _this = this;
      var options = _this.options;
      var e = getEvent(event);
      var action = options.movable ? 'move' : false;
      var touches = e.touches;
      var touchesLength;
      var touch;

      if (!_this.isViewed) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && touchesLength === 2) {
            touch = touches[1];
            _this.startX2 = touch.pageX;
            _this.startY2 = touch.pageY;
            action = 'zoom';
          } else {
            return;
          }
        } else {
          if (_this.isSwitchable()) {
            action = 'switch';
          }
        }

        touch = touches[0];
      }

      if (action) {
        preventDefault(e);
        _this.action = action;
        _this.startX = touch ? touch.pageX : e.pageX;
        _this.startY = touch ? touch.pageY : e.pageY;
      }
    },

    mousemove: function (event) {
      var _this = this;
      var options = _this.options;
      var e = getEvent(event);
      var action = _this.action;
      var image = _this.image;
      var touches = e.touches;
      var touchesLength;
      var touch;

      if (!_this.isViewed) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && touchesLength === 2) {
            touch = touches[1];
            _this.endX2 = touch.pageX;
            _this.endY2 = touch.pageY;
          } else {
            return;
          }
        }

        touch = touches[0];
      }

      if (action) {
        preventDefault(e);

        if (action === 'move' && options.transition && hasClass(image, CLASS_TRANSITION)) {
          removeClass(image, CLASS_TRANSITION);
        }

        _this.endX = touch ? touch.pageX : e.pageX;
        _this.endY = touch ? touch.pageY : e.pageY;

        _this.change(e);
      }
    },

    mouseup: function (event) {
      var _this = this;
      var e = getEvent(event);
      var action = _this.action;

      if (action) {
        preventDefault(e);

        if (action === 'move' && _this.options.transition) {
          addClass(_this.image, CLASS_TRANSITION);
        }

        _this.action = false;
      }
    },
