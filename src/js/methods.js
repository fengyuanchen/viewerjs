import {
  CLASS_ACTIVE,
  CLASS_FADE,
  CLASS_FIXED,
  CLASS_FULLSCREEN_EXIT,
  CLASS_HIDE,
  CLASS_IN,
  CLASS_INVISIBLE,
  CLASS_LOADING,
  CLASS_SHOW,
  CLASS_TRANSITION,
  EVENT_CLICK,
  EVENT_HIDE,
  EVENT_LOAD,
  EVENT_MOVE,
  EVENT_MOVED,
  EVENT_PLAY,
  EVENT_ROTATE,
  EVENT_ROTATED,
  EVENT_SCALE,
  EVENT_SCALED,
  EVENT_SHOW,
  EVENT_STOP,
  EVENT_TRANSITION_END,
  EVENT_VIEW,
  EVENT_VIEWED,
  EVENT_ZOOM,
  EVENT_ZOOMED,
  NAMESPACE,
} from './constants';
import {
  addClass,
  addListener,
  assign,
  dispatchEvent,
  escapeHTMLEntities,
  forEach,
  getData,
  getOffset,
  getPointersCenter,
  hasClass,
  isFunction,
  isNumber,
  isUndefined,
  removeClass,
  removeListener,
  setStyle,
  toggleClass,
} from './utilities';

export default {
  /** Show the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if show the viewer immediately or not.
   * @returns {Viewer} this
   */
  show(immediate = false) {
    const { element, options } = this;

    if (options.inline || this.showing || this.isShown || this.showing) {
      return this;
    }

    if (!this.ready) {
      this.build();

      if (this.ready) {
        this.show(immediate);
      }

      return this;
    }

    if (isFunction(options.show)) {
      addListener(element, EVENT_SHOW, options.show, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_SHOW) === false || !this.ready) {
      return this;
    }

    if (this.hiding) {
      this.transitioning.abort();
    }

    this.showing = true;
    this.open();

    const { viewer } = this;

    removeClass(viewer, CLASS_HIDE);
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-labelledby', this.title.id);
    viewer.setAttribute('aria-modal', true);
    viewer.removeAttribute('aria-hidden');

    if (options.transition && !immediate) {
      const shown = this.shown.bind(this);

      this.transitioning = {
        abort: () => {
          removeListener(viewer, EVENT_TRANSITION_END, shown);
          removeClass(viewer, CLASS_IN);
        },
      };

      addClass(viewer, CLASS_TRANSITION);

      // Force reflow to enable CSS3 transition
      viewer.initialOffsetWidth = viewer.offsetWidth;
      addListener(viewer, EVENT_TRANSITION_END, shown, {
        once: true,
      });
      addClass(viewer, CLASS_IN);
    } else {
      addClass(viewer, CLASS_IN);
      this.shown();
    }

    return this;
  },

  /**
   * Hide the viewer (only available in modal mode)
   * @param {boolean} [immediate=false] - Indicates if hide the viewer immediately or not.
   * @returns {Viewer} this
   */
  hide(immediate = false) {
    const { element, options } = this;

    if (options.inline || this.hiding || !(this.isShown || this.showing)) {
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

    if (this.showing) {
      this.transitioning.abort();
    }

    this.hiding = true;

    if (this.played) {
      this.stop();
    } else if (this.viewing) {
      this.viewing.abort();
    }

    const { viewer, image } = this;
    const hideImmediately = () => {
      removeClass(viewer, CLASS_IN);
      this.hidden();
    };

    if (options.transition && !immediate) {
      const onViewerTransitionEnd = (event) => {
        // Ignore all propagating `transitionend` events (#275).
        if (event && event.target === viewer) {
          removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          this.hidden();
        }
      };
      const onImageTransitionEnd = () => {
        // In case of show the viewer by `viewer.show(true)` previously (#407).
        if (hasClass(viewer, CLASS_TRANSITION)) {
          addListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          removeClass(viewer, CLASS_IN);
        } else {
          hideImmediately();
        }
      };

      this.transitioning = {
        abort: () => {
          if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
            removeListener(image, EVENT_TRANSITION_END, onImageTransitionEnd);
          } else if (hasClass(viewer, CLASS_TRANSITION)) {
            removeListener(viewer, EVENT_TRANSITION_END, onViewerTransitionEnd);
          }
        },
      };

      // In case of hiding the viewer when holding on the image (#255),
      // note that the `CLASS_TRANSITION` class will be removed on pointer down.
      if (this.viewed && hasClass(image, CLASS_TRANSITION)) {
        addListener(image, EVENT_TRANSITION_END, onImageTransitionEnd, {
          once: true,
        });
        this.zoomTo(0, false, null, true);
      } else {
        onImageTransitionEnd();
      }
    } else {
      hideImmediately();
    }

    return this;
  },

  /**
   * View one of the images with image's index
   * @param {number} index - The index of the image to view.
   * @returns {Viewer} this
   */
  view(index = this.options.initialViewIndex) {
    index = Number(index) || 0;

    if (this.hiding || this.played || index < 0 || index >= this.length
      || (this.viewed && index === this.index)) {
      return this;
    }

    if (!this.isShown) {
      this.index = index;
      return this.show();
    }

    if (this.viewing) {
      this.viewing.abort();
    }

    const {
      element,
      options,
      title,
      canvas,
    } = this;
    const item = this.items[index];
    const img = item.querySelector('img');
    const url = getData(img, 'originalUrl');
    const alt = img.getAttribute('alt');
    const image = document.createElement('img');

    forEach(options.inheritedAttributes, (name) => {
      const value = img.getAttribute(name);

      if (value !== null) {
        image.setAttribute(name, value);
      }
    });

    image.src = url;
    image.alt = alt;

    if (isFunction(options.view)) {
      addListener(element, EVENT_VIEW, options.view, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_VIEW, {
      originalImage: this.images[index],
      index,
      image,
    }) === false || !this.isShown || this.hiding || this.played) {
      return this;
    }

    const activeItem = this.items[this.index];

    if (activeItem) {
      removeClass(activeItem, CLASS_ACTIVE);
      activeItem.removeAttribute('aria-selected');
    }

    addClass(item, CLASS_ACTIVE);
    item.setAttribute('aria-selected', true);

    if (options.focus) {
      item.focus();
    }

    this.image = image;
    this.viewed = false;
    this.index = index;
    this.imageData = {};
    addClass(image, CLASS_INVISIBLE);

    if (options.loading) {
      addClass(canvas, CLASS_LOADING);
    }

    canvas.innerHTML = '';
    canvas.appendChild(image);

    // Center current item
    this.renderList();

    // Clear title
    title.innerHTML = '';

    // Generate title after viewed
    const onViewed = () => {
      const { imageData } = this;
      const render = Array.isArray(options.title) ? options.title[1] : options.title;

      title.innerHTML = escapeHTMLEntities(isFunction(render)
        ? render.call(this, image, imageData)
        : `${alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`);
    };
    let onLoad;

    addListener(element, EVENT_VIEWED, onViewed, {
      once: true,
    });

    this.viewing = {
      abort: () => {
        removeListener(element, EVENT_VIEWED, onViewed);

        if (image.complete) {
          if (this.imageRendering) {
            this.imageRendering.abort();
          } else if (this.imageInitializing) {
            this.imageInitializing.abort();
          }
        } else {
          // Cancel download to save bandwidth.
          image.src = '';
          removeListener(image, EVENT_LOAD, onLoad);

          if (this.timeout) {
            clearTimeout(this.timeout);
          }
        }
      },
    };

    if (image.complete) {
      this.load();
    } else {
      addListener(image, EVENT_LOAD, onLoad = this.load.bind(this), {
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
   * @returns {Viewer} this
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
   * @returns {Viewer} this
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
   * @param {number} x - The moving distance in the horizontal direction.
   * @param {number} [y=x] The moving distance in the vertical direction.
   * @returns {Viewer} this
   */
  move(x, y = x) {
    const { imageData } = this;

    this.moveTo(
      isUndefined(x) ? x : imageData.x + Number(x),
      isUndefined(y) ? y : imageData.y + Number(y),
    );

    return this;
  },

  /**
   * Move the image to an absolute point.
   * @param {number} x - The new position in the horizontal direction.
   * @param {number} [y=x] - The new position in the vertical direction.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  moveTo(x, y = x, _originalEvent = null) {
    const { element, options, imageData } = this;

    x = Number(x);
    y = Number(y);

    if (this.viewed && !this.played && options.movable) {
      const oldX = imageData.x;
      const oldY = imageData.y;
      let changed = false;

      if (isNumber(x)) {
        changed = true;
      } else {
        x = oldX;
      }

      if (isNumber(y)) {
        changed = true;
      } else {
        y = oldY;
      }

      if (changed) {
        if (isFunction(options.move)) {
          addListener(element, EVENT_MOVE, options.move, {
            once: true,
          });
        }

        if (dispatchEvent(element, EVENT_MOVE, {
          x,
          y,
          oldX,
          oldY,
          originalEvent: _originalEvent,
        }) === false) {
          return this;
        }

        imageData.x = x;
        imageData.y = y;
        imageData.left = x;
        imageData.top = y;
        this.moving = true;
        this.renderImage(() => {
          this.moving = false;

          if (isFunction(options.moved)) {
            addListener(element, EVENT_MOVED, options.moved, {
              once: true,
            });
          }

          dispatchEvent(element, EVENT_MOVED, {
            x,
            y,
            oldX,
            oldY,
            originalEvent: _originalEvent,
          }, {
            cancelable: false,
          });
        });
      }
    }

    return this;
  },

  /**
   * Rotate the image with a relative degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotate(degree) {
    this.rotateTo((this.imageData.rotate || 0) + Number(degree));

    return this;
  },

  /**
   * Rotate the image to an absolute degree.
   * @param {number} degree - The rotate degree.
   * @returns {Viewer} this
   */
  rotateTo(degree) {
    const { element, options, imageData } = this;

    degree = Number(degree);

    if (isNumber(degree) && this.viewed && !this.played && options.rotatable) {
      const oldDegree = imageData.rotate;

      if (isFunction(options.rotate)) {
        addListener(element, EVENT_ROTATE, options.rotate, {
          once: true,
        });
      }

      if (dispatchEvent(element, EVENT_ROTATE, {
        degree,
        oldDegree,
      }) === false) {
        return this;
      }

      imageData.rotate = degree;
      this.rotating = true;
      this.renderImage(() => {
        this.rotating = false;

        if (isFunction(options.rotated)) {
          addListener(element, EVENT_ROTATED, options.rotated, {
            once: true,
          });
        }

        dispatchEvent(element, EVENT_ROTATED, {
          degree,
          oldDegree,
        }, {
          cancelable: false,
        });
      });
    }

    return this;
  },

  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Viewer} this
   */
  scaleX(scaleX) {
    this.scale(scaleX, this.imageData.scaleY);

    return this;
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scaleY(scaleY) {
    this.scale(this.imageData.scaleX, scaleY);

    return this;
  },

  /**
   * Scale the image.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Viewer} this
   */
  scale(scaleX, scaleY = scaleX) {
    const { element, options, imageData } = this;

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (this.viewed && !this.played && options.scalable) {
      const oldScaleX = imageData.scaleX;
      const oldScaleY = imageData.scaleY;
      let changed = false;

      if (isNumber(scaleX)) {
        changed = true;
      } else {
        scaleX = oldScaleX;
      }

      if (isNumber(scaleY)) {
        changed = true;
      } else {
        scaleY = oldScaleY;
      }

      if (changed) {
        if (isFunction(options.scale)) {
          addListener(element, EVENT_SCALE, options.scale, {
            once: true,
          });
        }

        if (dispatchEvent(element, EVENT_SCALE, {
          scaleX,
          scaleY,
          oldScaleX,
          oldScaleY,
        }) === false) {
          return this;
        }

        imageData.scaleX = scaleX;
        imageData.scaleY = scaleY;
        this.scaling = true;
        this.renderImage(() => {
          this.scaling = false;

          if (isFunction(options.scaled)) {
            addListener(element, EVENT_SCALED, options.scaled, {
              once: true,
            });
          }

          dispatchEvent(element, EVENT_SCALED, {
            scaleX,
            scaleY,
            oldScaleX,
            oldScaleY,
          }, {
            cancelable: false,
          });
        });
      }
    }

    return this;
  },

  /**
   * Zoom the image with a relative ratio.
   * @param {number} ratio - The target ratio.
   * @param {boolean} [hasTooltip=false] - Indicates if it has a tooltip or not.
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
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
   * @returns {Viewer} this
   */
  zoomTo(ratio, hasTooltip = false, _originalEvent = null, _zoomable = false) {
    const {
      element,
      options,
      pointers,
      imageData,
    } = this;
    const {
      x,
      y,
      width,
      height,
      naturalWidth,
      naturalHeight,
    } = imageData;

    ratio = Math.max(0, ratio);

    if (isNumber(ratio) && this.viewed && !this.played && (_zoomable || options.zoomable)) {
      if (!_zoomable) {
        const minZoomRatio = Math.max(0.01, options.minZoomRatio);
        const maxZoomRatio = Math.min(100, options.maxZoomRatio);

        ratio = Math.min(Math.max(ratio, minZoomRatio), maxZoomRatio);
      }

      if (_originalEvent && options.zoomRatio >= 0.055 && ratio > 0.95 && ratio < 1.05) {
        ratio = 1;
      }

      const newWidth = naturalWidth * ratio;
      const newHeight = naturalHeight * ratio;
      const offsetWidth = newWidth - width;
      const offsetHeight = newHeight - height;
      const oldRatio = imageData.ratio;

      if (isFunction(options.zoom)) {
        addListener(element, EVENT_ZOOM, options.zoom, {
          once: true,
        });
      }

      if (dispatchEvent(element, EVENT_ZOOM, {
        ratio,
        oldRatio,
        originalEvent: _originalEvent,
      }) === false) {
        return this;
      }

      this.zooming = true;

      if (_originalEvent) {
        const offset = getOffset(this.viewer);
        const center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
          pageX: _originalEvent.pageX,
          pageY: _originalEvent.pageY,
        };

        // Zoom from the triggering point of the event
        imageData.x -= offsetWidth * (((center.pageX - offset.left) - x) / width);
        imageData.y -= offsetHeight * (((center.pageY - offset.top) - y) / height);
      } else {
        // Zoom from the center of the image
        imageData.x -= offsetWidth / 2;
        imageData.y -= offsetHeight / 2;
      }

      imageData.left = imageData.x;
      imageData.top = imageData.y;
      imageData.width = newWidth;
      imageData.height = newHeight;
      imageData.oldRatio = oldRatio;
      imageData.ratio = ratio;
      this.renderImage(() => {
        this.zooming = false;

        if (isFunction(options.zoomed)) {
          addListener(element, EVENT_ZOOMED, options.zoomed, {
            once: true,
          });
        }

        dispatchEvent(element, EVENT_ZOOMED, {
          ratio,
          oldRatio,
          originalEvent: _originalEvent,
        }, {
          cancelable: false,
        });
      });

      if (hasTooltip) {
        this.tooltip();
      }
    }

    return this;
  },

  /**
   * Play the images
   * @param {boolean|FullscreenOptions} [fullscreen=false] - Indicate if request fullscreen or not.
   * @returns {Viewer} this
   */
  play(fullscreen = false) {
    if (!this.isShown || this.played) {
      return this;
    }

    const { element, options } = this;

    if (isFunction(options.play)) {
      addListener(element, EVENT_PLAY, options.play, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_PLAY) === false) {
      return this;
    }

    const { player } = this;
    const onLoad = this.loadImage.bind(this);
    const list = [];
    let total = 0;
    let index = 0;

    this.played = true;
    this.onLoadWhenPlay = onLoad;

    if (fullscreen) {
      this.requestFullscreen(fullscreen);
    }

    addClass(player, CLASS_SHOW);
    forEach(this.items, (item, i) => {
      const img = item.querySelector('img');
      const image = document.createElement('img');

      image.src = getData(img, 'originalUrl');
      image.alt = img.getAttribute('alt');
      image.referrerPolicy = img.referrerPolicy;
      total += 1;
      addClass(image, CLASS_FADE);
      toggleClass(image, CLASS_TRANSITION, options.transition);

      if (hasClass(item, CLASS_ACTIVE)) {
        addClass(image, CLASS_IN);
        index = i;
      }

      list.push(image);
      addListener(image, EVENT_LOAD, onLoad, {
        once: true,
      });
      player.appendChild(image);
    });

    if (isNumber(options.interval) && options.interval > 0) {
      const play = () => {
        this.playing = setTimeout(() => {
          removeClass(list[index], CLASS_IN);
          index += 1;
          index = index < total ? index : 0;
          addClass(list[index], CLASS_IN);
          play();
        }, options.interval);
      };

      if (total > 1) {
        play();
      }
    }

    return this;
  },

  // Stop play
  stop() {
    if (!this.played) {
      return this;
    }

    const { element, options } = this;

    if (isFunction(options.stop)) {
      addListener(element, EVENT_STOP, options.stop, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_STOP) === false) {
      return this;
    }

    const { player } = this;

    this.played = false;
    clearTimeout(this.playing);
    forEach(player.getElementsByTagName('img'), (image) => {
      removeListener(image, EVENT_LOAD, this.onLoadWhenPlay);
    });
    removeClass(player, CLASS_SHOW);
    player.innerHTML = '';
    this.exitFullscreen();

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

    if (!this.isShown || this.played || this.fulled || !options.inline) {
      return this;
    }

    this.fulled = true;
    this.open();
    addClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(list, CLASS_TRANSITION);

      if (this.viewed) {
        removeClass(image, CLASS_TRANSITION);
      }
    }

    addClass(viewer, CLASS_FIXED);
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-labelledby', this.title.id);
    viewer.setAttribute('aria-modal', true);
    viewer.removeAttribute('style');
    setStyle(viewer, {
      zIndex: options.zIndex,
    });

    if (options.focus) {
      this.enforceFocus();
    }

    this.initContainer();
    this.viewerData = assign({}, this.containerData);
    this.renderList();

    if (this.viewed) {
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
    }

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

    if (!this.isShown || this.played || !this.fulled || !options.inline) {
      return this;
    }

    this.fulled = false;
    this.close();
    removeClass(this.button, CLASS_FULLSCREEN_EXIT);

    if (options.transition) {
      removeClass(list, CLASS_TRANSITION);

      if (this.viewed) {
        removeClass(image, CLASS_TRANSITION);
      }
    }

    if (options.focus) {
      this.clearEnforceFocus();
    }

    viewer.removeAttribute('role');
    viewer.removeAttribute('aria-labelledby');
    viewer.removeAttribute('aria-modal');
    removeClass(viewer, CLASS_FIXED);
    setStyle(viewer, {
      zIndex: options.zIndexInline,
    });

    this.viewerData = assign({}, this.parentData);
    this.renderViewer();
    this.renderList();

    if (this.viewed) {
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
    }

    return this;
  },

  // Show the current ratio of the image with percentage
  tooltip() {
    const { options, tooltipBox, imageData } = this;

    if (!this.viewed || this.played || !options.tooltip) {
      return this;
    }

    tooltipBox.textContent = `${Math.round(imageData.ratio * 100)}%`;

    if (!this.tooltipping) {
      if (options.transition) {
        if (this.fading) {
          dispatchEvent(tooltipBox, EVENT_TRANSITION_END);
        }

        addClass(tooltipBox, CLASS_SHOW);
        addClass(tooltipBox, CLASS_FADE);
        addClass(tooltipBox, CLASS_TRANSITION);
        tooltipBox.removeAttribute('aria-hidden');

        // Force reflow to enable CSS3 transition
        tooltipBox.initialOffsetWidth = tooltipBox.offsetWidth;
        addClass(tooltipBox, CLASS_IN);
      } else {
        addClass(tooltipBox, CLASS_SHOW);
        tooltipBox.removeAttribute('aria-hidden');
      }
    } else {
      clearTimeout(this.tooltipping);
    }

    this.tooltipping = setTimeout(() => {
      if (options.transition) {
        addListener(tooltipBox, EVENT_TRANSITION_END, () => {
          removeClass(tooltipBox, CLASS_SHOW);
          removeClass(tooltipBox, CLASS_FADE);
          removeClass(tooltipBox, CLASS_TRANSITION);
          tooltipBox.setAttribute('aria-hidden', true);
          this.fading = false;
        }, {
          once: true,
        });

        removeClass(tooltipBox, CLASS_IN);
        this.fading = true;
      } else {
        removeClass(tooltipBox, CLASS_SHOW);
        tooltipBox.setAttribute('aria-hidden', true);
      }

      this.tooltipping = false;
    }, 1000);

    return this;
  },

  /**
   * Toggle the image size between its current size and natural size
   * @param {Event} [_originalEvent=null] - The original event if any.
   * @returns {Viewer} this
   */
  toggle(_originalEvent = null) {
    if (this.imageData.ratio === 1) {
      this.zoomTo(this.imageData.oldRatio, true, _originalEvent);
    } else {
      this.zoomTo(1, true, _originalEvent);
    }

    return this;
  },

  // Reset the image to its initial state
  reset() {
    if (this.viewed && !this.played) {
      this.imageData = assign({}, this.initialImageData);
      this.renderImage();
    }

    return this;
  },

  // Update viewer when images changed
  update() {
    const { element, options, isImg } = this;

    // Destroy viewer if the target image was deleted
    if (isImg && !element.parentNode) {
      return this.destroy();
    }

    const images = [];

    forEach(isImg ? [element] : element.querySelectorAll('img'), (image) => {
      if (isFunction(options.filter)) {
        if (options.filter.call(this, image)) {
          images.push(image);
        }
      } else if (this.getImageURL(image)) {
        images.push(image);
      }
    });

    if (!images.length) {
      return this;
    }

    this.images = images;
    this.length = images.length;

    if (this.ready) {
      const changedIndexes = [];

      forEach(this.items, (item, i) => {
        const img = item.querySelector('img');
        const image = images[i];

        if (image && img) {
          if (
            image.src !== img.src

            // Title changed (#408)
            || image.alt !== img.alt
          ) {
            changedIndexes.push(i);
          }
        } else {
          changedIndexes.push(i);
        }
      });

      setStyle(this.list, {
        width: 'auto',
      });

      this.initList();

      if (this.isShown) {
        if (this.length) {
          if (this.viewed) {
            const changedIndex = changedIndexes.indexOf(this.index);

            if (changedIndex >= 0) {
              this.viewed = false;
              this.view(Math.max(Math.min(this.index - changedIndex, this.length - 1), 0));
            } else {
              const activeItem = this.items[this.index];

              // Reactivate the current viewing item after reset the list.
              addClass(activeItem, CLASS_ACTIVE);
              activeItem.setAttribute('aria-selected', true);
            }
          }
        } else {
          this.image = null;
          this.viewed = false;
          this.index = 0;
          this.imageData = {};
          this.canvas.innerHTML = '';
          this.title.innerHTML = '';
        }
      }
    } else {
      this.build();
    }

    return this;
  },

  // Destroy the viewer
  destroy() {
    const { element, options } = this;

    if (!element[NAMESPACE]) {
      return this;
    }

    this.destroyed = true;

    if (this.ready) {
      if (this.played) {
        this.stop();
      }

      if (options.inline) {
        if (this.fulled) {
          this.exit();
        }

        this.unbind();
      } else if (this.isShown) {
        if (this.viewing) {
          if (this.imageRendering) {
            this.imageRendering.abort();
          } else if (this.imageInitializing) {
            this.imageInitializing.abort();
          }
        }

        if (this.hiding) {
          this.transitioning.abort();
        }

        this.hidden();
      } else if (this.showing) {
        this.transitioning.abort();
        this.hidden();
      }

      this.ready = false;
      this.viewer.parentNode.removeChild(this.viewer);
    } else if (options.inline) {
      if (this.delaying) {
        this.delaying.abort();
      } else if (this.initializing) {
        this.initializing.abort();
      }
    }

    if (!options.inline) {
      removeListener(element, EVENT_CLICK, this.onStart);
    }

    element[NAMESPACE] = undefined;
    return this;
  },
};
