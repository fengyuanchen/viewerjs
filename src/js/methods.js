    // Show the viewer (only available in modal mode)
    show: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var viewer;

      if (options.inline || _this.transitioning) {
        return _this;
      }

      if (!_this.isBuilt) {
        _this.build();
      }

      viewer = _this.viewer;

      if (isFunction(options.show)) {
        addListener(element, EVENT_SHOW, options.show, true);
      }

      if (dispatchEvent(element, EVENT_SHOW) === false) {
        return _this;
      }

      addClass(_this.body, CLASS_OPEN);
      removeClass(viewer, CLASS_HIDE);

      addListener(element, EVENT_SHOWN, function () {
        _this.view(_this.target ? inArray(_this.target, toArray(_this.images)) : _this.index);
        _this.target = false;
      }, true);

      if (options.transition) {
        _this.transitioning = true;
        addClass(viewer, CLASS_TRANSITION);
        forceReflow(viewer);
        addListener(viewer, EVENT_TRANSITIONEND, proxy(_this.shown, _this), true);
        addClass(viewer, CLASS_IN);
      } else {
        addClass(viewer, CLASS_IN);
        _this.shown();
      }

      return _this;
    },

    // Hide the viewer (only available in modal mode)
    hide: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var viewer = _this.viewer;

      if (options.inline || _this.transitioning || !_this.isShown) {
        return _this;
      }

      if (isFunction(options.hide)) {
        addListener(element, EVENT_HIDE, options.hide, true);
      }

      if (dispatchEvent(element, EVENT_HIDE) === false) {
        return _this;
      }

      if (_this.isViewed && options.transition) {
        _this.transitioning = true;
        addListener(_this.image, EVENT_TRANSITIONEND, function () {
          addListener(viewer, EVENT_TRANSITIONEND, proxy(_this.hidden, _this), true);
          removeClass(viewer, CLASS_IN);
        }, true);
        _this.zoomTo(0, false, false, true);
      } else {
        removeClass(viewer, CLASS_IN);
        _this.hidden();
      }

      return _this;
    },

    /**
     * View one of the images with image's index
     *
     * @param {Number} index
     */
    view: function (index) {
      var _this = this;
      var element = _this.element;
      var title = _this.title;
      var canvas = _this.canvas;
      var image;
      var item;
      var img;
      var url;
      var alt;

      index = Number(index) || 0;

      if (!_this.isShown || _this.isPlayed || index < 0 || index >= _this.length ||
        _this.isViewed && index === _this.index) {
        return _this;
      }

      item = _this.items[index];
      img = getByTag(item, 'img')[0];
      url = getData(img, 'originalUrl');
      alt = img.getAttribute('alt');

      image = document.createElement('img');
      image.src = url;
      image.alt = alt;

      if (dispatchEvent(element, EVENT_VIEW, {
        originalImage: _this.images[index],
        index: index,
        image: image
      }) === false) {
        return _this;
      }

      _this.image = image;

      if (_this.isViewed) {
        removeClass(_this.items[_this.index], CLASS_ACTIVE);
      }

      addClass(item, CLASS_ACTIVE);

      _this.isViewed = false;
      _this.index = index;
      _this.imageData = null;

      addClass(image, CLASS_INVISIBLE);
      empty(canvas);
      appendChild(canvas, image);

      // Center current item
      _this.renderList();

      // Clear title
      empty(title);

      // Generate title after viewed
      addListener(element, EVENT_VIEWED, function () {
        var imageData = _this.imageData;
        var width = imageData.naturalWidth;
        var height = imageData.naturalHeight;

        setText(title, alt + ' (' + width + ' × ' + height + ')');
      }, true);

      if (image.complete) {
        _this.load();
      } else {
        addListener(image, EVENT_LOAD, proxy(_this.load, _this), true);

        if (_this.timeout) {
          clearTimeout(_this.timeout);
        }

        // Make the image visible if it fails to load within 1s
        _this.timeout = setTimeout(function () {
          removeClass(image, CLASS_INVISIBLE);
          _this.timeout = false;
        }, 1000);
      }

      return _this;
    },

    // View the previous image
    prev: function () {
      var _this = this;

      _this.view(max(_this.index - 1, 0));

      return _this;
    },

    // View the next image
    next: function () {
      var _this = this;

      _this.view(min(_this.index + 1, _this.length - 1));

      return _this;
    },

    /**
     * Move the image with relative offsets
     *
     * @param {Number} offsetX
     * @param {Number} offsetY (optional)
     */
    move: function (offsetX, offsetY) {
      var _this = this;
      var imageData = _this.imageData;

      _this.moveTo(
        isUndefined(offsetX) ? offsetX : imageData.left + Number(offsetX),
        isUndefined(offsetY) ? offsetY : imageData.top + Number(offsetY)
      );

      return _this;
    },

    /**
     * Move the image to an absolute point
     *
     * @param {Number} x
     * @param {Number} y (optional)
     */
    moveTo: function (x, y) {
      var _this = this;
      var imageData = _this.imageData;
      var changed = false;

      // If "y" is not present, its default value is "x"
      if (isUndefined(y)) {
        y = x;
      }

      x = Number(x);
      y = Number(y);

      if (_this.isViewed && !_this.isPlayed && _this.options.movable) {
        if (isNumber(x)) {
          imageData.left = x;
          changed = true;
        }

        if (isNumber(y)) {
          imageData.top = y;
          changed = true;
        }

        if (changed) {
          _this.renderImage();
        }
      }

      return _this;
    },

    /**
     * Zoom the image with a relative ratio
     *
     * @param {Number} ratio
     * @param {Boolean} hasTooltip (optional)
     * @param {Event} _originalEvent (private)
     */
    zoom: function (ratio, hasTooltip, _originalEvent) {
      var _this = this;
      var imageData = _this.imageData;

      ratio = Number(ratio);

      if (ratio < 0) {
        ratio =  1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      _this.zoomTo(imageData.width * ratio / imageData.naturalWidth, hasTooltip, _originalEvent);

      return _this;
    },

    /**
     * Zoom the image to an absolute ratio
     *
     * @param {Number} ratio
     * @param {Boolean} hasTooltip (optional)
     * @param {Event} _originalEvent (private)
     * @param {Boolean} _zoomable (private)
     */
    zoomTo: function (ratio, hasTooltip, _originalEvent, _zoomable) {
      var _this = this;
      var options = _this.options;
      var minZoomRatio = 0.01;
      var maxZoomRatio = 100;
      var imageData = _this.imageData;
      var newWidth;
      var newHeight;
      var offset;
      var center;

      ratio = max(0, ratio);

      if (isNumber(ratio) && _this.isViewed && !_this.isPlayed && (_zoomable || options.zoomable)) {
        if (!_zoomable) {
          minZoomRatio = max(minZoomRatio, options.minZoomRatio);
          maxZoomRatio = min(maxZoomRatio, options.maxZoomRatio);
          ratio = min(max(ratio, minZoomRatio), maxZoomRatio);
        }

        if (ratio > 0.95 && ratio < 1.05) {
          ratio = 1;
        }

        newWidth = imageData.naturalWidth * ratio;
        newHeight = imageData.naturalHeight * ratio;

        if (_originalEvent) {
          offset = getOffset(_this.viewer);
          center = _originalEvent.touches ? getTouchesCenter(_originalEvent.touches) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          };

          // Zoom from the triggering point of the event
          imageData.left -= (newWidth - imageData.width) * (
            ((center.pageX - offset.left) - imageData.left) / imageData.width
          );
          imageData.top -= (newHeight - imageData.height) * (
            ((center.pageY - offset.top) - imageData.top) / imageData.height
          );
        } else {

          // Zoom from the center of the image
          imageData.left -= (newWidth - imageData.width) / 2;
          imageData.top -= (newHeight - imageData.height) / 2;
        }

        imageData.width = newWidth;
        imageData.height = newHeight;
        imageData.ratio = ratio;
        _this.renderImage();

        if (hasTooltip) {
          _this.tooltip();
        }
      }

      return _this;
    },

    /**
     * Rotate the image with a relative degree
     *
     * @param {Number} degree
     */
    rotate: function (degree) {
      var _this = this;

      _this.rotateTo((_this.imageData.rotate || 0) + Number(degree));

      return _this;
    },

    /**
     * Rotate the image to an absolute degree
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
     *
     * @param {Number} degree
     */
    rotateTo: function (degree) {
      var _this = this;
      var imageData = _this.imageData;

      degree = Number(degree);

      if (isNumber(degree) && _this.isViewed && !_this.isPlayed && _this.options.rotatable) {
        imageData.rotate = degree;
        _this.renderImage();
      }

      return _this;
    },

    /**
     * Scale the image
     * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
     *
     * @param {Number} scaleX
     * @param {Number} scaleY (optional)
     */
    scale: function (scaleX, scaleY) {
      var _this = this;
      var imageData = _this.imageData;
      var changed = false;

      // If "scaleY" is not present, its default value is "scaleX"
      if (isUndefined(scaleY)) {
        scaleY = scaleX;
      }

      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (_this.isViewed && !_this.isPlayed && _this.options.scalable) {
        if (isNumber(scaleX)) {
          imageData.scaleX = scaleX;
          changed = true;
        }

        if (isNumber(scaleY)) {
          imageData.scaleY = scaleY;
          changed = true;
        }

        if (changed) {
          _this.renderImage();
        }
      }

      return _this;
    },

    /**
     * Scale the abscissa of the image
     *
     * @param {Number} scaleX
     */
    scaleX: function (scaleX) {
      var _this = this;

      _this.scale(scaleX, _this.imageData.scaleY);

      return _this;
    },

    /**
     * Scale the ordinate of the image
     *
     * @param {Number} scaleY
     */
    scaleY: function (scaleY) {
      var _this = this;

      _this.scale(_this.imageData.scaleX, scaleY);

      return _this;
    },

    // Play the images
    play: function () {
      var _this = this;
      var options = _this.options;
      var player = _this.player;
      var load = proxy(_this.loadImage, _this);
      var list = [];
      var total = 0;
      var index = 0;
      var playing;

      if (!_this.isShown || _this.isPlayed) {
        return _this;
      }

      if (options.fullscreen) {
        _this.requestFullscreen();
      }

      _this.isPlayed = true;
      addClass(player, CLASS_SHOW);

      each(_this.items, function (item, i) {
        var img = getByTag(item, 'img')[0];
        var image = document.createElement('img');

        image.src = getData(img, 'originalUrl');
        image.alt = img.getAttribute('alt');
        total++;

        addClass(image, CLASS_FADE);
        toggleClass(image, CLASS_TRANSITION, options.transition);

        if (hasClass(item, CLASS_ACTIVE)) {
          addClass(image, CLASS_IN);
          index = i;
        }

        list.push(image);
        addListener(image, EVENT_LOAD, load, true);
        appendChild(player, image);
      });

      if (isNumber(options.interval) && options.interval > 0) {
        playing = function () {
          _this.playing = setTimeout(function () {
            removeClass(list[index], CLASS_IN);
            index++;
            index = index < total ? index : 0;
            addClass(list[index], CLASS_IN);

            playing();
          }, options.interval);
        };

        if (total > 1) {
          playing();
        }
      }

      return _this;
    },

    // Stop play
    stop: function () {
      var _this = this;
      var player = _this.player;

      if (!_this.isPlayed) {
        return _this;
      }

      if (_this.options.fullscreen) {
        _this.exitFullscreen();
      }

      _this.isPlayed = false;
      clearTimeout(_this.playing);
      removeClass(player, CLASS_SHOW);
      empty(player);

      return _this;
    },

    // Enter modal mode (only available in inline mode)
    full: function () {
      var _this = this;
      var options = _this.options;
      var viewer = _this.viewer;
      var image = _this.image;
      var list = _this.list;

      if (!_this.isShown || _this.isPlayed || _this.isFulled || !options.inline) {
        return _this;
      }

      _this.isFulled = true;
      addClass(_this.body, CLASS_OPEN);
      addClass(_this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(image, CLASS_TRANSITION);
        removeClass(list, CLASS_TRANSITION);
      }

      addClass(viewer, CLASS_FIXED);
      viewer.setAttribute('style', '');
      setStyle(viewer, {
        zIndex: options.zIndex
      });

      _this.initContainer();
      _this.viewerData = extend({}, _this.containerData);
      _this.renderList();
      _this.initImage(function () {
        _this.renderImage(function () {
          if (options.transition) {
            setTimeout(function () {
              addClass(image, CLASS_TRANSITION);
              addClass(list, CLASS_TRANSITION);
            }, 0);
          }
        });
      });

      return _this;
    },

    // Exit modal mode (only available in inline mode)
    exit: function () {
      var _this = this;
      var options = _this.options;
      var viewer = _this.viewer;
      var image = _this.image;
      var list = _this.list;

      if (!_this.isFulled) {
        return _this;
      }

      _this.isFulled = false;
      removeClass(_this.body, CLASS_OPEN);
      removeClass(_this.button, CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        removeClass(image, CLASS_TRANSITION);
        removeClass(list, CLASS_TRANSITION);
      }

      removeClass(viewer, CLASS_FIXED);
      setStyle(viewer, {
        zIndex: options.zIndexInline
      });

      _this.viewerData = extend({}, _this.parentData);
      _this.renderViewer();
      _this.renderList();
      _this.initImage(function () {
        _this.renderImage(function () {
          if (options.transition) {
            setTimeout(function () {
              addClass(image, CLASS_TRANSITION);
              addClass(list, CLASS_TRANSITION);
            }, 0);
          }
        });
      });

      return _this;
    },

    // Show the current ratio of the image with percentage
    tooltip: function () {
      var _this = this;
      var options = _this.options;
      var tooltipBox = _this.tooltipBox;
      var imageData = _this.imageData;

      if (!_this.isViewed || _this.isPlayed || !options.tooltip) {
        return _this;
      }

      setText(tooltipBox, round(imageData.ratio * 100) + '%');

      if (!_this.tooltiping) {
        if (options.transition) {
          if (_this.fading) {
            dispatchEvent(tooltipBox, EVENT_TRANSITIONEND);
          }

          addClass(tooltipBox, CLASS_SHOW);
          addClass(tooltipBox, CLASS_FADE);
          addClass(tooltipBox, CLASS_TRANSITION);
          forceReflow(tooltipBox);
          addClass(tooltipBox, CLASS_IN);
        } else {
          addClass(tooltipBox, CLASS_SHOW);
        }
      } else {
        clearTimeout(_this.tooltiping);
      }

      _this.tooltiping = setTimeout(function () {
        if (options.transition) {
          addListener(tooltipBox, EVENT_TRANSITIONEND, function () {
            removeClass(tooltipBox, CLASS_SHOW);
            removeClass(tooltipBox, CLASS_FADE);
            removeClass(tooltipBox, CLASS_TRANSITION);
            _this.fading = false;
          }, true);

          removeClass(tooltipBox, CLASS_IN);
          _this.fading = true;
        } else {
          removeClass(tooltipBox, CLASS_SHOW);
        }

        _this.tooltiping = false;
      }, 1000);

      return _this;
    },

    // Toggle the image size between its natural size and initial size
    toggle: function () {
      var _this = this;

      if (_this.imageData.ratio === 1) {
        _this.zoomTo(_this.initialImageData.ratio, true);
      } else {
        _this.zoomTo(1, true);
      }

      return _this;
    },

    // Reset the image to its initial state
    reset: function () {
      var _this = this;

      if (_this.isViewed && !_this.isPlayed) {
        _this.imageData = extend({}, _this.initialImageData);
        _this.renderImage();
      }

      return _this;
    },

    // Update viewer when images changed
    update: function () {
      var _this = this;
      var indexes = [];
      var index;

      // Destroy viewer if the target image was deleted
      if (_this.isImg && !_this.element.parentNode) {
        return _this.destroy();
      }

      _this.length = _this.images.length;

      if (_this.isBuilt) {
        each(_this.items, function (item, i) {
          var img = getByTag(item, 'img')[0];
          var image = _this.images[i];

          if (image) {
            if (image.src !== img.src) {
              indexes.push(i);
            }
          } else {
            indexes.push(i);
          }
        });

        setStyle(_this.list, {
          width: 'auto'
        });

        _this.initList();

        if (_this.isShown) {
          if (_this.length) {
            if (_this.isViewed) {
              index = inArray(_this.index, indexes);

              if (index >= 0) {
                _this.isViewed = false;
                _this.view(max(_this.index - (index + 1), 0));
              } else {
                addClass(_this.items[_this.index], CLASS_ACTIVE);
              }
            }
          } else {
            _this.image = null;
            _this.isViewed = false;
            _this.index = 0;
            _this.imageData = null;
            empty(_this.canvas);
            empty(_this.title);
          }
        }
      }

      return _this;
    },

    // Destroy the viewer
    destroy: function () {
      var _this = this;
      var element = _this.element;

      if (_this.options.inline) {
        _this.unbind();
      } else {
        if (_this.isShown) {
          _this.unbind();
        }

        removeListener(element, EVENT_CLICK, _this._start);
      }

      _this.unbuild();
      removeData(element, NAMESPACE);

      return _this;
    },
