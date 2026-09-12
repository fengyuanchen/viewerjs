import {
  ACTION_MOVE,
  ACTION_ROTATE,
  ACTION_SWITCH,
  ACTION_TRANSFORM,
  ACTION_ZOOM,
  CLASS_HIDE,
  CLASS_OPEN,
  EVENT_FOCUSIN,
  EVENT_HIDDEN,
  EVENT_SHOWN,
} from './constants';
import {
  addClass,
  addListener,
  dispatchEvent,
  forEach,
  getMaxRotateDegree,
  getMaxZoomRatio,
  isFunction,
  isPlainObject,
  isString,
  removeClass,
  removeListener,
} from './utilities';

export default {
  getImageURL(image) {
    let { url } = this.options;

    if (isString(url)) {
      url = image.getAttribute(url);
    } else if (isFunction(url)) {
      url = url.call(this, image);
    } else {
      url = '';
    }

    return url;
  },

  enforceFocus() {
    this.clearEnforceFocus();
    addListener(document, EVENT_FOCUSIN, (this.onFocusin = (event) => {
      const { viewer } = this;
      let { target } = event;

      if (target === document || target === viewer || viewer.contains(target)) {
        return;
      }

      while (target) {
        // Avoid conflicts with other modals (#474, #540)
        if ((target.getAttribute('tabindex') !== null || target.getAttribute('aria-modal') === 'true')) {
          return;
        }

        target = target.parentElement;
      }

      viewer.focus();
    }));
  },

  clearEnforceFocus() {
    if (this.onFocusin) {
      removeListener(document, EVENT_FOCUSIN, this.onFocusin);
      this.onFocusin = null;
    }
  },

  open() {
    const { body } = this;

    addClass(body, CLASS_OPEN);

    if (this.scrollbarWidth > 0) {
      body.style.paddingRight = `${this.scrollbarWidth + (parseFloat(this.initialBodyComputedPaddingRight) || 0)}px`;
    }
  },

  close() {
    const { body } = this;

    removeClass(body, CLASS_OPEN);

    if (this.scrollbarWidth > 0) {
      body.style.paddingRight = this.initialBodyPaddingRight;
    }
  },

  shown() {
    const { element, options, viewer } = this;

    this.fulled = true;
    this.isShown = true;
    this.render();
    this.bind();
    this.showing = false;

    if (options.focus) {
      viewer.focus();
      this.enforceFocus();
    }

    if (isFunction(options.shown)) {
      addListener(element, EVENT_SHOWN, options.shown, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_SHOWN, {
      originalEvent: this.showOriginalEvent || null,
    }) === false) {
      return;
    }

    this.showOriginalEvent = null;

    if (this.ready && this.isShown && !this.hiding) {
      this.view(this.index);
    }
  },

  hidden() {
    const { element, options, viewer } = this;
    const { activeElement } = viewer.ownerDocument;

    // Avoid keeping focus inside the dialog before setting `aria-hidden`.
    if (activeElement && viewer.contains(activeElement) && isFunction(activeElement.blur)) {
      activeElement.blur();
    }

    if (options.focus) {
      this.clearEnforceFocus();
    }

    this.close();
    this.unbind();
    addClass(viewer, CLASS_HIDE);
    viewer.removeAttribute('role');
    viewer.removeAttribute('aria-labelledby');
    viewer.removeAttribute('aria-modal');
    viewer.setAttribute('aria-hidden', true);
    this.resetList();
    this.resetImage();
    this.fulled = false;
    this.viewed = false;
    this.isShown = false;
    this.hiding = false;

    if (!this.destroyed) {
      if (isFunction(options.hidden)) {
        addListener(element, EVENT_HIDDEN, options.hidden, {
          once: true,
        });
      }

      dispatchEvent(element, EVENT_HIDDEN, {
        originalEvent: this.hideOriginalEvent || null,
      }, {
        cancelable: false,
      });

      this.hideOriginalEvent = null;
    }
  },

  requestFullscreen(options) {
    const { ownerDocument: document } = this;

    if (this.fulled && !(
      document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement
    )) {
      const { documentElement } = document;

      // Element.requestFullscreen()
      if (documentElement.requestFullscreen) {
        // Avoid TypeError when convert `options` to dictionary
        if (isPlainObject(options)) {
          documentElement.requestFullscreen(options);
        } else {
          documentElement.requestFullscreen();
        }
      } else if (documentElement.webkitRequestFullscreen) {
        documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.msRequestFullscreen) {
        documentElement.msRequestFullscreen();
      }
    }
  },

  exitFullscreen() {
    const { ownerDocument: document } = this;

    if (this.fulled && (
      document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement
    )) {
      // Document.exitFullscreen()
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  },

  change(event) {
    const { options, pointers } = this;
    const pointer = pointers[Object.keys(pointers)[0]];

    // In the case of the `pointers` object is empty (#421)
    if (!pointer) {
      return;
    }

    const offsetX = pointer.endX - pointer.startX;
    const offsetY = pointer.endY - pointer.startY;

    switch (this.action) {
      // Move the current image
      case ACTION_MOVE:
        if (offsetX !== 0 || offsetY !== 0) {
          this.pointerMoved = true;
          this.actionEvent = event;
          this.move(offsetX, offsetY);
        }
        break;

      // Zoom the current image
      case ACTION_ZOOM:
        if (options.zoomable && options.zoomOnTouch) {
          const zoomRatio = getMaxZoomRatio(pointers);

          if (zoomRatio !== 0) {
            this.actionEvent = event;
            this.zoom(zoomRatio);
          }
        }
        break;

      // Rotate the current image
      case ACTION_ROTATE:
        if (options.rotatable && options.rotateOnTouch) {
          const rotateDegree = getMaxRotateDegree(pointers);

          if (rotateDegree !== 0) {
            this.actionEvent = event;
            this.rotate(rotateDegree);
          }
        }
        break;

      // Transform the current image
      case ACTION_TRANSFORM:
        if (options.zoomable && options.zoomOnTouch) {
          const zoomRatio = getMaxZoomRatio(pointers);

          if (zoomRatio !== 0) {
            this.actionEvent = event;
            this.zoom(zoomRatio);
          }
        }

        if (options.rotatable && options.rotateOnTouch) {
          const rotateDegree = getMaxRotateDegree(pointers);

          if (rotateDegree !== 0) {
            this.actionEvent = event;
            this.rotate(rotateDegree);
          }
        }
        break;

      case ACTION_SWITCH: {
        this.action = 'switched';

        const absoluteOffsetX = Math.abs(offsetX);

        if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
          // Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
          this.pointers = {};

          this.actionEvent = event;

          if (offsetX > 1) {
            this.prev(options.loop);
          } else if (offsetX < -1) {
            this.next(options.loop);
          }
        }

        break;
      }

      default:
    }

    // Override
    forEach(pointers, (p) => {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  },

  isSwitchable() {
    const { imageData, viewerData } = this;

    return this.length > 1 && imageData.x >= 0 && imageData.y >= 0
      && imageData.width <= viewerData.width
      && imageData.height <= viewerData.height;
  },
};
