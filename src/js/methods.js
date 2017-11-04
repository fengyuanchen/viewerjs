import {
  CLASS_ACTIVE,
  CLASS_FADE,
  CLASS_FIXED,
  CLASS_FULLSCREEN_EXIT,
  CLASS_HIDE,
  CLASS_IN,
  CLASS_INVISIBLE,
  CLASS_SHOW,
  CLASS_TRANSITION,
  EVENT_CLICK,
  EVENT_HIDE,
  EVENT_LOAD,
  EVENT_SHOW,
  EVENT_SHOWN,
  EVENT_TRANSITION_END,
  EVENT_VIEW,
  EVENT_VIEWED,
  NAMESPACE,
} from './constants';
import {
  addClass,
  addListener,
  dispatchEvent,
  each,
  empty,
  extend,
  getData,
  getOffset,
  getPointersCenter,
  hasClass,
  isFunction,
  isNumber,
  isUndefined,
  proxy,
  removeClass,
  removeData,
  removeListener,
  setStyle,
  toggleClass,
} from './utilities';

export default {
  // Show the viewer (only available in modal mode)
  show() {
    const { element, options } = this;

    if (options.inline || this.transitioning || this.visible) {
      return this;
    }

    if (!this.ready) {
      this.build();
    }

    if (isFunction(options.show)) {
      addListener(element, EVENT_SHOW, options.show, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_SHOW) === false) {
      return this;
    }

    this.open();

    const { viewer } = this;

    removeClass(viewer, CLASS_HIDE);
    addListener(element, EVENT_SHOWN, () => {
      this.view(this.target ? [...this.images].indexOf(this.target) : this.index);
      this.target = false;
    }, {
      once: true,
    });

    if (options.transition) {
      this.transitioning = true;
      addClass(viewer, CLASS_TRANSITION);

      // Force reflow to enable CSS3 transition
      // eslint-disable-next-line
      viewer.offsetWidth;
      addListener(viewer, EVENT_TRANSITION_END, proxy(this.shown, this), {
        once: true,
      });
      addClass(viewer, CLASS_IN);
    } else {
      addClass(viewer, CLASS_IN);
      this.shown();
    }

    return this;
  },

  // Hide the viewer (only available in modal mode)
  hide() {
    const { element, options, viewer } = this;

    if (options.inline || this.transitioning || !this.visible) {
      return this;
    }

    if (isFunction(options.hide)) {
      addListener(element, EVENT_HIDE, options.hide, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_HIDE) === false) {
      return this;
    }

    if (this.viewed && options.transition) {
      this.transitioning = true;
      addListener(this.image, EVENT_TRANSITION_END, () => {
        addListener(viewer, EVENT_TRANSITION_END, proxy(this.hidden, this), {
          once: true,
        });
        removeClass(viewer, CLASS_IN);
      }, {
        once: true,
      });
      this.zoomTo(0, false, false, true);
    } else {
      removeClass(viewer, CLASS_IN);
      this.hidden();
    }

    return this;
  },

  /**
   * View one of the images with image's index
   * @param {number} index - The index of the image to view.
   * @returns {Object} this
   */
  view(index) {
    const { element, title, canvas } = this;

    index = Number(index) || 0;

    if (!this.ready || !this.visible || this.played || index < 0 || index >= this.length ||
      (this.viewed && index === this.index)) {
      return this;
    }

    const item = this.items[index];
    const img = item.querySelector('img');
    const url = getData(img, 'originalUrl');
    const alt = img.getAttribute('alt');
    const image = document.createElement('img');

    image.src = url;
    image.alt = alt;

    if (dispatchEvent(element, EVENT_VIEW, {
      originalImage: this.images[index],
      index,
      image,
    }) === false) {
      return this;
    }

    this.image = image;

    removeClass(this.items[this.index], CLASS_ACTIVE);
    addClass(item, CLASS_ACTIVE);

    this.viewed = false;
    this.index = index;
    this.imageData = null;

    addClass(image, CLASS_INVISIBLE);
    empty(canvas);
    canvas.appendChild(image);

    // Center current item
    this.renderList();

    // Clear title
    empty(title);

    // Generate title after viewed
    addListener(element, EVENT_VIEWED, () => {
      const { imageData } = this;

      title.textContent = `${alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`;
    }, {
      once: true,
    });

    if (image.complete) {
      this.load();
    } else {
      addListener(image, EVENT_LOAD, proxy(this.load, this), {
        once: true,
      });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      // Make the image visible if it fails to load within 1s
      this.timeout = setTimeout(() => {
        removeClass(image, CLASS_INVISIBLE);
        this.timeout = false;
      }, 1000);
    }

    return this;
  },

  /**
   * View the previous image
   * @param {boolean} [loop=false] - Indicate if view the last one
   * when it is the first one at present.
   * @returns {Object} this
   */
  prev(loop = false) {
    let index = this.index - 1;

    if (index < 0) {
      index = loop ? this.length - 1 : 0;
    }

    this.view(index);
    return this;
  },

  /**
   * View the next image
   * @param {boolean} [loop=false] - Indicate if view the first one
   * when it is the last one at present.
   * @returns {Object} this
   */
  next(loop = false) {
    const maxIndex = this.length - 1;
    let index = this.index + 1;

    if (index > maxIndex) {
      index = loop ? 0 : maxIndex;
    }

    this.view(index);
    return this;
  },

  /**
   * Move the image with relative offsets.
   * @param {number} offsetX - The relative offset distance on the x-axis.
   * @param {number} offsetY - The relative offset distance on the y-axis.
   * @returns {Object} this
   */
  move(offsetX, offsetY) {
    const { imageData } = this;

    this.moveTo(
      isUndefined(offsetX) ? offsetX : imageData.left + Number(offsetX),
      isUndefined(offsetY) ? offsetY : imageData.top + Number(offsetY),
    );

    return this;
  },

  /**
   * Move the image to an absolute point.
   * @param {number} x - The x-axis coordinate.
   * @param {number} [y=x] - The y-axis coordinate.
   * @returns {Object} this
   */
  moveTo(x, y = x) {
    const { imageData } = this;

    x = Number(x);
    y = Number(y);

    if (this.viewed && !this.played && this.options.movable) {
      let changed = false;

      if (isNumber(x)) {
        imageData.left = x;
        changed = true;
      }

      if (isNumber(y)) {
        imageData.top = y;
        changed = true;
      }

      if (changed) {
        this.renderImage();
      }
    }

    return this;
  },

  /**
   * Zoom the image with a relative ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Object} this
   */
  zoom(ratio, hasTooltip = false, _originalEvent = null) {
    const { imageData } = this;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    this.zoomTo((imageData.width * ratio) / imageData.naturalWidth, hasTooltip, _originalEvent);

    return this;
  },

  /**
   * Zoom the image to an absolute ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @param {Event} [_zoomable=false] - Indicates if the current zoom is available or not.
   * @returns {Object} this
   */
  zoomTo(ratio, hasTooltip = false, _originalEvent = null, _zoomable = false) {
    const { options, pointers, imageData } = this;

    ratio = Math.max(0, ratio);

    if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
      if (!_zoomable) {
        const minZoomRatio = Math.max(0.01, options.minZoomRatio);
        const maxZoomRatio = Math.min(100, options.maxZoomRatio);

        ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
      }

      if (_originalEvent && ratio > 0.95 && ratio < 1.05) {
        ratio = 1;
      }

      const newWidth = imageData.naturalWidth * ratio;
      const newHeight = imageData.naturalHeight * ratio;

      if (_originalEvent) {
        const offset = getOffset(this.viewer);
        const center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
          pageX: _originalEvent.pageX,
          pageY: _originalEvent.pageY,
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
      this.renderImage();

      if (hasTooltip) {
        this.tooltip();
      }
    }

    return this;
  },

  /**
   * Rotate the image with a relative degree.
   * @param {number} degree - The rotate degree.
   * @returns {Object} this
   */
  rotate(degree) {
    this.rotateTo((this.imageData.rotate || 0) + Number(degree));

    return this;
  },

  /**
   * Rotate the image to an absolute degree.
   * @param {number} degree - The rotate degree.
   * @returns {Object} this
   */
  rotateTo(degree) {
    const { imageData } = this;

    degree = Number(degree);

    if (isNumber(degree) && this.viewed && !this.played && this.options.rotatable) {
      imageData.rotate = degree;
      this.renderImage();
    }

    return this;
  },

  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Object} this
   */
  scaleX(scaleX) {
    this.scale(scaleX, this.imageData.scaleY);

    return this;
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Object} this
   */
  scaleY(scaleY) {
    this.scale(this.imageData.scaleX, scaleY);

    return this;
  },

  /**
   * Scale the image.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Object} this
   */
  scale(scaleX, scaleY = scaleX) {
    const { imageData } = this;

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (this.viewed && !this.played && this.options.scalable) {
      let changed = false;

      if (isNumber(scaleX)) {
        imageData.scaleX = scaleX;
        changed = true;
      }

      if (isNumber(scaleY)) {
        imageData.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        this.renderImage();
      }
    }

    return this;
  },

  // Play the images
  play() {
    const { options, player } = this;
    const load = proxy(this.loadImage, this);
    const list = [];
    let total = 0;
    let index = 0;

    if (!this.visible || this.played) {
      return this;
    }

    if (options.fullscreen) {
      this.requestFullscreen();
    }

    this.played = true;
    this.onLoadWhenPlay = load;
    addClass(player, CLASS_SHOW);

    each(this.items, (item, i) => {
      const img = item.querySelector('img');
      const image = document.createElement('img');

      image.src = getData(img, 'originalUrl');
      image.alt = img.getAttribute('alt');
      total += 1;

      addClass(image, CLASS_FADE);
      toggleClass(image, CLASS_TRANSITION, options.transition);

      if (hasClass(item, CLASS_ACTIVE)) {
        addClass(image, CLASS_IN);
        index = i;
      }

      list.push(image);
      addListener(image, EVENT_LOAD, load, {
        once: true,
      });
      player.appendChild(image);
    });

    if (isNumber(options.interval) && options.interval > 0) {
      const playing = () => {
        this.playing = setTimeout(() => {
          removeClass(list[index], CLASS_IN);
          index += 1;
          index = index < total ? index : 0;
          addClass(list[index], CLASS_IN);

          playing();
        }, options.interval);
      };

      if (total > 1) {
        playing();
      }
    }

    return this;
  },

  // Stop play
  stop() {
    const { player } = this;

    if (!this.played) {
      return this;
    }

    if (this.options.fullscreen) {
      this.exitFullscreen();
    }

    this.played = false;
    clearTimeout(this.playing);
    each(this.player.getElementsByTagName('img'), (image) => {
      if (!image.complete) {
        removeListener(image, EVENT_LOAD, this.onLoadWhenPlay);
      }
    });
    removeClass(player, CLASS_SHOW);
    empty(player);

    return this;
  },

  // Enter modal mode (only available in inline mode)
  full() {
    const {
      options,
      viewer,
      image,
      list,
    } = this;

    if (!this.visible || this.played || this.fulled || !options.inline) {
      return this;
    }

    this.fulled = true;
    this.open();
    addClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(image, CLASS_TRANSITION);
      removeClass(list, CLASS_TRANSITION);
    }

    addClass(viewer, CLASS_FIXED);
    viewer.setAttribute('style', '');
    setStyle(viewer, {
      zIndex: options.zIndex,
    });

    this.initContainer();
    this.viewerData = extend({}, this.containerData);
    this.renderList();
    this.initImage(() => {
      this.renderImage(() => {
        if (options.transition) {
          setTimeout(() => {
            addClass(image, CLASS_TRANSITION);
            addClass(list, CLASS_TRANSITION);
          }, 0);
        }
      });
    });

    return this;
  },

  // Exit modal mode (only available in inline mode)
  exit() {
    const {
      options,
      viewer,
      image,
      list,
    } = this;

    if (!this.fulled) {
      return this;
    }

    this.fulled = false;
    this.close();
    removeClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(image, CLASS_TRANSITION);
      removeClass(list, CLASS_TRANSITION);
    }

    removeClass(viewer, CLASS_FIXED);
    setStyle(viewer, {
      zIndex: options.zIndexInline,
    });

    this.viewerData = extend({}, this.parentData);
    this.renderViewer();
    this.renderList();
    this.initImage(() => {
      this.renderImage(() => {
        if (options.transition) {
          setTimeout(() => {
            addClass(image, CLASS_TRANSITION);
            addClass(list, CLASS_TRANSITION);
          }, 0);
        }
      });
    });

    return this;
  },

  // Show the current ratio of the image with percentage
  tooltip() {
    const { options, tooltipBox, imageData } = this;

    if (!this.viewed || this.played || !options.tooltip) {
      return this;
    }

    tooltipBox.textContent = `${Math.round(imageData.ratio * 100)}%`;

    if (!this.tooltiping) {
      if (options.transition) {
        if (this.fading) {
          dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
        }

        addClass(tooltipBox, CLASS_SHOW);
        addClass(tooltipBox, CLASS_FADE);
        addClass(tooltipBox, CLASS_TRANSITION);

        // Force reflow to enable CSS3 transition
        // eslint-disable-next-line
        tooltipBox.offsetWidth;
        addClass(tooltipBox, CLASS_IN);
      } else {
        addClass(tooltipBox, CLASS_SHOW);
      }
    } else {
      clearTimeout(this.tooltiping);
    }

    this.tooltiping = setTimeout(() => {
      if (options.transition) {
        addListener(tooltipBox, EVENT_TRANSITION_END, () => {
          removeClass(tooltipBox, CLASS_SHOW);
          removeClass(tooltipBox, CLASS_FADE);
          removeClass(tooltipBox, CLASS_TRANSITION);
          this.fading = false;
        }, {
          once: true,
        });

        removeClass(tooltipBox, CLASS_IN);
        this.fading = true;
      } else {
        removeClass(tooltipBox, CLASS_SHOW);
      }

      this.tooltiping = false;
    }, 1000);

    return this;
  },

  // Toggle the image size between its natural size and initial size
  toggle() {
    if (this.imageData.ratio === 1) {
      this.zoomTo(this.initialImageData.ratio, true);
    } else {
      this.zoomTo(1, true);
    }

    return this;
  },

  // Reset the image to its initial state
  reset() {
    if (this.viewed && !this.played) {
      this.imageData = extend({}, this.initialImageData);
      this.renderImage();
    }

    return this;
  },

  // Update viewer when images changed
  update() {
    const { element, options, isImg } = this;
    const indexes = [];

    // Destroy viewer if the target image was deleted
    if (isImg && !element.parentNode) {
      return this.destroy();
    }

    const images = [];

    each(isImg ? [element] : element.querySelectorAll('img'), (image) => {
      if (options.filter) {
        if (options.filter(image)) {
          images.push(image);
        }
      } else {
        images.push(image);
      }
    });

    this.images = images;
    this.length = images.length;

    if (this.ready) {
      each(this.items, (item, i) => {
        const img = item.querySelector('img');
        const image = images[i];

        if (image) {
          if (image.src !== img.src) {
            indexes.push(i);
          }
        } else {
          indexes.push(i);
        }
      });

      setStyle(this.list, {
        width: 'auto',
      });

      this.initList();

      if (this.visible) {
        if (this.length) {
          if (this.viewed) {
            const index = indexes.indexOf(this.index);

            if (index >= 0) {
              this.viewed = false;
              this.view(Math.max(this.index - (index + 1), 0));
            } else {
              addClass(this.items[this.index], CLASS_ACTIVE);
            }
          }
        } else {
          this.image = null;
          this.viewed = false;
          this.index = 0;
          this.imageData = null;
          empty(this.canvas);
          empty(this.title);
        }
      }
    }

    return this;
  },

  // Destroy the viewer
  destroy() {
    const { element } = this;

    if (!getData(element, NAMESPACE)) {
      return this;
    }

    if (this.options.inline) {
      this.unbind();
    } else {
      if (this.visible) {
        this.unbind();
      }

      removeListener(element, EVENT_CLICK, this.onStart);
    }

    this.close();
    this.unbuild();
    removeData(element, NAMESPACE);
    return this;
  },
};
