import * as $ from './utilities';

export default {
  // Show the viewer (only available in modal mode)
  show() {
    const self = this;
    const options = self.options;
    const element = self.element;

    if (options.inline || self.transitioning) {
      return self;
    }

    if (!self.ready) {
      self.build();
    }

    if ($.isFunction(options.show)) {
      $.addListener(element, 'show', options.show, true);
    }

    if ($.dispatchEvent(element, 'show') === false) {
      return self;
    }

    self.open();

    const viewer = self.viewer;

    $.removeClass(viewer, 'viewer-hide');
    $.addListener(element, 'shown', () => {
      self.view(self.target ? $.inArray(self.target, $.toArray(self.images)) : self.index);
      self.target = false;
    }, true);

    if (options.transition) {
      self.transitioning = true;
      $.addClass(viewer, 'viewer-transition');
      $.forceReflow(viewer);
      $.addListener(viewer, 'transitionend', $.proxy(self.shown, self), true);
      $.addClass(viewer, 'viewer-in');
    } else {
      $.addClass(viewer, 'viewer-in');
      self.shown();
    }

    return self;
  },

  // Hide the viewer (only available in modal mode)
  hide() {
    const self = this;
    const options = self.options;
    const element = self.element;
    const viewer = self.viewer;

    if (options.inline || self.transitioning || !self.visible) {
      return self;
    }

    if ($.isFunction(options.hide)) {
      $.addListener(element, 'hide', options.hide, true);
    }

    if ($.dispatchEvent(element, 'hide') === false) {
      return self;
    }

    if (self.viewed && options.transition) {
      self.transitioning = true;
      $.addListener(self.image, 'transitionend', () => {
        $.addListener(viewer, 'transitionend', $.proxy(self.hidden, self), true);
        $.removeClass(viewer, 'viewer-in');
      }, true);
      self.zoomTo(0, false, false, true);
    } else {
      $.removeClass(viewer, 'viewer-in');
      self.hidden();
    }

    return self;
  },

  /**
   * View one of the images with image's index
   *
   * @param {Number} index
   */
  view(index) {
    const self = this;
    const element = self.element;
    const title = self.title;
    const canvas = self.canvas;

    index = Number(index) || 0;

    if (!self.ready || !self.visible || self.played || index < 0 || index >= self.length ||
      (self.viewed && index === self.index)) {
      return self;
    }

    const item = self.items[index];
    const img = $.getByTag(item, 'img')[0];
    const url = $.getData(img, 'originalUrl');
    const alt = img.getAttribute('alt');
    const image = document.createElement('img');

    image.src = url;
    image.alt = alt;

    if ($.dispatchEvent(element, 'view', {
      originalImage: self.images[index],
      index,
      image,
    }) === false) {
      return self;
    }

    self.image = image;

    if (self.viewed) {
      $.removeClass(self.items[self.index], 'viewer-active');
    }

    $.addClass(item, 'viewer-active');

    self.viewed = false;
    self.index = index;
    self.imageData = null;

    $.addClass(image, 'viewer-invisible');
    $.empty(canvas);
    $.appendChild(canvas, image);

    // Center current item
    self.renderList();

    // Clear title
    $.empty(title);

    // Generate title after viewed
    $.addListener(element, 'viewed', () => {
      const imageData = self.imageData;

      $.setText(title, `${alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`);
    }, true);

    if (image.complete) {
      self.load();
    } else {
      $.addListener(image, 'load', $.proxy(self.load, self), true);

      if (self.timeout) {
        clearTimeout(self.timeout);
      }

      // Make the image visible if it fails to load within 1s
      self.timeout = setTimeout(() => {
        $.removeClass(image, 'viewer-invisible');
        self.timeout = false;
      }, 1000);
    }

    return self;
  },

  // View the previous image
  prev() {
    const self = this;

    self.view(Math.max(self.index - 1, 0));

    return self;
  },

  // View the next image
  next() {
    const self = this;

    self.view(Math.min(self.index + 1, self.length - 1));

    return self;
  },

  /**
   * Move the image with relative offsets
   *
   * @param {Number} offsetX
   * @param {Number} offsetY (optional)
   */
  move(offsetX, offsetY) {
    const self = this;
    const imageData = self.imageData;

    self.moveTo(
      $.isUndefined(offsetX) ? offsetX : imageData.left + Number(offsetX),
      $.isUndefined(offsetY) ? offsetY : imageData.top + Number(offsetY)
    );

    return self;
  },

  /**
   * Move the image to an absolute point
   *
   * @param {Number} x
   * @param {Number} y (optional)
   */
  moveTo(x, y) {
    const self = this;
    const imageData = self.imageData;

    // If "y" is not present, its default value is "x"
    if ($.isUndefined(y)) {
      y = x;
    }

    x = Number(x);
    y = Number(y);

    if (self.viewed && !self.played && self.options.movable) {
      let changed = false;

      if ($.isNumber(x)) {
        imageData.left = x;
        changed = true;
      }

      if ($.isNumber(y)) {
        imageData.top = y;
        changed = true;
      }

      if (changed) {
        self.renderImage();
      }
    }

    return self;
  },

  /**
   * Zoom the image with a relative ratio
   *
   * @param {Number} ratio
   * @param {Boolean} hasTooltip (optional)
   * @param {Event} _originalEvent (private)
   */
  zoom(ratio, hasTooltip, _originalEvent) {
    const self = this;
    const imageData = self.imageData;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    self.zoomTo((imageData.width * ratio) / imageData.naturalWidth, hasTooltip, _originalEvent);

    return self;
  },

  /**
   * Zoom the image to an absolute ratio
   *
   * @param {Number} ratio
   * @param {Boolean} hasTooltip (optional)
   * @param {Event} _originalEvent (private)
   * @param {Boolean} _zoomable (private)
   */
  zoomTo(ratio, hasTooltip, _originalEvent, _zoomable) {
    const self = this;
    const options = self.options;
    const pointers = self.pointers;
    const imageData = self.imageData;

    ratio = Math.max(0, ratio);

    if ($.isNumber(ratio) && self.viewed && !self.played && (_zoomable || options.zoomable)) {
      if (!_zoomable) {
        const minZoomRatio = Math.max(0.01, options.minZoomRatio);
        const maxZoomRatio = Math.min(100, options.maxZoomRatio);

        ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
      }

      if (ratio > 0.95 && ratio < 1.05) {
        ratio = 1;
      }

      const newWidth = imageData.naturalWidth * ratio;
      const newHeight = imageData.naturalHeight * ratio;

      if (_originalEvent) {
        const offset = $.getOffset(self.viewer);
        const center = pointers && Object.keys(pointers).length ? $.getPointersCenter(pointers) : {
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
      self.renderImage();

      if (hasTooltip) {
        self.tooltip();
      }
    }

    return self;
  },

  /**
   * Rotate the image with a relative degree
   *
   * @param {Number} degree
   */
  rotate(degree) {
    const self = this;

    self.rotateTo((self.imageData.rotate || 0) + Number(degree));

    return self;
  },

  /**
   * Rotate the image to an absolute degree
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
   *
   * @param {Number} degree
   */
  rotateTo(degree) {
    const self = this;
    const imageData = self.imageData;

    degree = Number(degree);

    if ($.isNumber(degree) && self.viewed && !self.played && self.options.rotatable) {
      imageData.rotate = degree;
      self.renderImage();
    }

    return self;
  },

  /**
   * Scale the image
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
   *
   * @param {Number} scaleX
   * @param {Number} scaleY (optional)
   */
  scale(scaleX, scaleY) {
    const self = this;
    const imageData = self.imageData;

    // If "scaleY" is not present, its default value is "scaleX"
    if ($.isUndefined(scaleY)) {
      scaleY = scaleX;
    }

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (self.viewed && !self.played && self.options.scalable) {
      let changed = false;

      if ($.isNumber(scaleX)) {
        imageData.scaleX = scaleX;
        changed = true;
      }

      if ($.isNumber(scaleY)) {
        imageData.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        self.renderImage();
      }
    }

    return self;
  },

  /**
   * Scale the abscissa of the image
   *
   * @param {Number} scaleX
   */
  scaleX(scaleX) {
    const self = this;

    self.scale(scaleX, self.imageData.scaleY);

    return self;
  },

  /**
   * Scale the ordinate of the image
   *
   * @param {Number} scaleY
   */
  scaleY(scaleY) {
    const self = this;

    self.scale(self.imageData.scaleX, scaleY);

    return self;
  },

  // Play the images
  play() {
    const self = this;
    const options = self.options;
    const player = self.player;
    const load = $.proxy(self.loadImage, self);
    const list = [];
    let total = 0;
    let index = 0;

    if (!self.visible || self.played) {
      return self;
    }

    if (options.fullscreen) {
      self.requestFullscreen();
    }

    self.played = true;
    $.addClass(player, 'viewer-show');

    $.each(self.items, (item, i) => {
      const img = $.getByTag(item, 'img')[0];
      const image = document.createElement('img');

      image.src = $.getData(img, 'originalUrl');
      image.alt = img.getAttribute('alt');
      total++;

      $.addClass(image, 'viewer-fade');
      $.toggleClass(image, 'viewer-transition', options.transition);

      if ($.hasClass(item, 'viewer-active')) {
        $.addClass(image, 'viewer-in');
        index = i;
      }

      list.push(image);
      $.addListener(image, 'load', load, true);
      $.appendChild(player, image);
    });

    if ($.isNumber(options.interval) && options.interval > 0) {
      const playing = () => {
        self.playing = setTimeout(() => {
          $.removeClass(list[index], 'viewer-in');
          index++;
          index = index < total ? index : 0;
          $.addClass(list[index], 'viewer-in');

          playing();
        }, options.interval);
      };

      if (total > 1) {
        playing();
      }
    }

    return self;
  },

  // Stop play
  stop() {
    const self = this;
    const player = self.player;

    if (!self.played) {
      return self;
    }

    if (self.options.fullscreen) {
      self.exitFullscreen();
    }

    self.played = false;
    clearTimeout(self.playing);
    $.removeClass(player, 'viewer-show');
    $.empty(player);

    return self;
  },

  // Enter modal mode (only available in inline mode)
  full() {
    const self = this;
    const options = self.options;
    const viewer = self.viewer;
    const image = self.image;
    const list = self.list;

    if (!self.visible || self.played || self.fulled || !options.inline) {
      return self;
    }

    self.fulled = true;
    self.open();
    $.addClass(self.button, 'viewer-fullscreen-exit');

    if (options.transition) {
      $.removeClass(image, 'viewer-transition');
      $.removeClass(list, 'viewer-transition');
    }

    $.addClass(viewer, 'viewer-fixed');
    viewer.setAttribute('style', '');
    $.setStyle(viewer, {
      zIndex: options.zIndex
    });

    self.initContainer();
    self.viewerData = $.extend({}, self.containerData);
    self.renderList();
    self.initImage(() => {
      self.renderImage(() => {
        if (options.transition) {
          setTimeout(() => {
            $.addClass(image, 'viewer-transition');
            $.addClass(list, 'viewer-transition');
          }, 0);
        }
      });
    });

    return self;
  },

  // Exit modal mode (only available in inline mode)
  exit() {
    const self = this;
    const options = self.options;
    const viewer = self.viewer;
    const image = self.image;
    const list = self.list;

    if (!self.fulled) {
      return self;
    }

    self.fulled = false;
    self.close();
    $.removeClass(self.button, 'viewer-fullscreen-exit');

    if (options.transition) {
      $.removeClass(image, 'viewer-transition');
      $.removeClass(list, 'viewer-transition');
    }

    $.removeClass(viewer, 'viewer-fixed');
    $.setStyle(viewer, {
      zIndex: options.zIndexInline
    });

    self.viewerData = $.extend({}, self.parentData);
    self.renderViewer();
    self.renderList();
    self.initImage(() => {
      self.renderImage(() => {
        if (options.transition) {
          setTimeout(() => {
            $.addClass(image, 'viewer-transition');
            $.addClass(list, 'viewer-transition');
          }, 0);
        }
      });
    });

    return self;
  },

  // Show the current ratio of the image with percentage
  tooltip() {
    const self = this;
    const options = self.options;
    const tooltipBox = self.tooltipBox;
    const imageData = self.imageData;

    if (!self.viewed || self.played || !options.tooltip) {
      return self;
    }

    $.setText(tooltipBox, `${Math.round(imageData.ratio * 100)}%`);

    if (!self.tooltiping) {
      if (options.transition) {
        if (self.fading) {
          $.dispatchEvent(tooltipBox, 'transitionend');
        }

        $.addClass(tooltipBox, 'viewer-show');
        $.addClass(tooltipBox, 'viewer-fade');
        $.addClass(tooltipBox, 'viewer-transition');
        $.forceReflow(tooltipBox);
        $.addClass(tooltipBox, 'viewer-in');
      } else {
        $.addClass(tooltipBox, 'viewer-show');
      }
    } else {
      clearTimeout(self.tooltiping);
    }

    self.tooltiping = setTimeout(() => {
      if (options.transition) {
        $.addListener(tooltipBox, 'transitionend', () => {
          $.removeClass(tooltipBox, 'viewer-show');
          $.removeClass(tooltipBox, 'viewer-fade');
          $.removeClass(tooltipBox, 'viewer-transition');
          self.fading = false;
        }, true);

        $.removeClass(tooltipBox, 'viewer-in');
        self.fading = true;
      } else {
        $.removeClass(tooltipBox, 'viewer-show');
      }

      self.tooltiping = false;
    }, 1000);

    return self;
  },

  // Toggle the image size between its natural size and initial size
  toggle() {
    const self = this;

    if (self.imageData.ratio === 1) {
      self.zoomTo(self.initialImageData.ratio, true);
    } else {
      self.zoomTo(1, true);
    }

    return self;
  },

  // Reset the image to its initial state
  reset() {
    const self = this;

    if (self.viewed && !self.played) {
      self.imageData = $.extend({}, self.initialImageData);
      self.renderImage();
    }

    return self;
  },

  // Update viewer when images changed
  update() {
    const self = this;
    const indexes = [];

    // Destroy viewer if the target image was deleted
    if (self.isImg && !self.element.parentNode) {
      return self.destroy();
    }

    self.length = self.images.length;

    if (self.ready) {
      $.each(self.items, (item, i) => {
        const img = $.getByTag(item, 'img')[0];
        const image = self.images[i];

        if (image) {
          if (image.src !== img.src) {
            indexes.push(i);
          }
        } else {
          indexes.push(i);
        }
      });

      $.setStyle(self.list, {
        width: 'auto'
      });

      self.initList();

      if (self.visible) {
        if (self.length) {
          if (self.viewed) {
            const index = $.inArray(self.index, indexes);

            if (index >= 0) {
              self.viewed = false;
              self.view(Math.max(self.index - (index + 1), 0));
            } else {
              $.addClass(self.items[self.index], 'viewer-active');
            }
          }
        } else {
          self.image = null;
          self.viewed = false;
          self.index = 0;
          self.imageData = null;
          $.empty(self.canvas);
          $.empty(self.title);
        }
      }
    }

    return self;
  },

  // Destroy the viewer
  destroy() {
    const self = this;
    const element = self.element;

    if (self.options.inline) {
      self.unbind();
    } else {
      if (self.visible) {
        self.unbind();
      }

      $.removeListener(element, 'click', self.onStart);
    }

    self.unbuild();
    $.removeData(element, 'viewer');

    return self;
  },
};
