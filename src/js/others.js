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
  each,
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

    this.transitioning = false;
    this.fulled = true;
    this.visible = true;
    this.render();
    this.bind();

    if (isFunction(options.shown)) {
      addListener(element, EVENT_SHOWN, options.shown, {
        once: true,
      });
    }

    dispatchEvent(element, EVENT_SHOWN);
  },

  hidden() {
    const { element, options } = this;
    this.transitioning = false;
    this.viewed = false;
    this.fulled = false;
    this.visible = false;
    this.close();
    this.unbind();
    addClass(this.viewer, CLASS_HIDE);
    this.resetList();
    this.resetImage();

    if (isFunction(options.hidden)) {
      addListener(element, EVENT_HIDDEN, options.hidden, {
        once: true,
      });
    }

    dispatchEvent(element, EVENT_HIDDEN);
  },

  requestFullscreen() {
    const { document } = window;

    if (this.fulled && !document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      const { documentElement } = document;

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

  exitFullscreen() {
    if (this.fulled) {
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

  change(e) {
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
        this.zoom(getMaxZoomRatio(pointers), false, e);
        break;

      case ACTION_SWITCH:
        this.action = 'switched';

        if (Math.abs(offsetX) > Math.abs(offsetY)) {
          if (offsetX > 1) {
            this.prev(options.loop);
          } else if (offsetX < -1) {
            this.next(options.loop);
          }
        }

        break;

      default:
    }

    // Override
    each(pointers, (p) => {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  },

  isSwitchable() {
    const { imageData, viewerData } = this;

    return this.length > 1 && imageData.left >= 0 && imageData.top >= 0 &&
      imageData.width <= viewerData.width &&
      imageData.height <= viewerData.height;
  },
};
