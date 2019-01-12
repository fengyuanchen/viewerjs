import {
  ACTION_MOVE,
  ACTION_SWITCH,
  ACTION_ZOOM,
  CLASS_HIDE,
  CLASS_OPEN,
  EVENT_HIDDEN,
  EVENT_SHOWN,
} from './constants';
import {
  addClass,
  addListener,
  dispatchEvent,
  forEach,
  getMaxZoomRatio,
  isFunction,
  removeClass,
} from './utilities';

export default {
  open() {
    const { body } = this;

    addClass(body, CLASS_OPEN);

    body.style.paddingRight = `${this.scrollbarWidth + (parseFloat(this.initialBodyPaddingRight) || 0)}px`;
  },

  close() {
    const { body } = this;

    removeClass(body, CLASS_OPEN);
    body.style.paddingRight = this.initialBodyPaddingRight;
  },

  shown() {
    const { element, options } = this;

    this.fulled = true;
    this.isShown = true;
    this.render();
    this.bind();
    this.showing = false;

    if (isFunction(options.shown)) {
      addListener(element, EVENT_SHOWN, options.shown, {
        once: true,
      });
    }

    if (dispatchEvent(element, EVENT_SHOWN) === false) {
      return;
    }

    if (this.ready && this.isShown && !this.hiding) {
      this.view(this.index);
    }
  },

  hidden() {
    const { element, options } = this;

    this.fulled = false;
    this.viewed = false;
    this.isShown = false;
    this.close();
    this.unbind();
    addClass(this.viewer, CLASS_HIDE);
    this.resetList();
    this.resetImage();
    this.hiding = false;

    if (!this.destroyed) {
      if (isFunction(options.hidden)) {
        addListener(element, EVENT_HIDDEN, options.hidden, {
          once: true,
        });
      }

      dispatchEvent(element, EVENT_HIDDEN);
    }
  },

  requestFullscreen() {
    const document = this.element.ownerDocument;

    if (this.fulled && !(
      document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullScreenElement
      || document.msFullscreenElement
    )) {
      const { documentElement } = document;

      // Element.requestFullscreen()
      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
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
    const document = this.element.ownerDocument;

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
    const offsetX = pointer.endX - pointer.startX;
    const offsetY = pointer.endY - pointer.startY;

    switch (this.action) {
      // Move the current image
      case ACTION_MOVE:
        this.move(offsetX, offsetY);
        break;

      // Zoom the current image
      case ACTION_ZOOM:
        this.zoom(getMaxZoomRatio(pointers), false, event);
        break;

      case ACTION_SWITCH: {
        this.action = 'switched';

        const absoluteOffsetX = Math.abs(offsetX);

        if (absoluteOffsetX > 1 && absoluteOffsetX > Math.abs(offsetY)) {
          // Empty `pointers` as `touchend` event will not be fired after swiped in iOS browsers.
          this.pointers = {};

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

    return this.length > 1 && imageData.left >= 0 && imageData.top >= 0
      && imageData.width <= viewerData.width
      && imageData.height <= viewerData.height;
  },
};
