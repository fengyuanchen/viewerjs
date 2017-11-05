import {
  ACTION_MOVE,
  ACTION_SWITCH,
  ACTION_ZOOM,
  CLASS_INVISIBLE,
  CLASS_MOVE,
  CLASS_TRANSITION,
  EVENT_LOAD,
  EVENT_VIEWED,
} from './constants';
import {
  addClass,
  addListener,
  dispatchEvent,
  each,
  extend,
  getData,
  getImageNaturalSizes,
  getPointer,
  hasClass,
  proxy,
  removeClass,
  setStyle,
  toggleClass,
} from './utilities';

export default {
  click({ target }) {
    const { options, imageData } = this;
    const action = getData(target, 'action');

    switch (action) {
      case 'mix':
        if (this.played) {
          this.stop();
        } else if (options.inline) {
          if (this.fulled) {
            this.exit();
          } else {
            this.full();
          }
        } else {
          this.hide();
        }

        break;

      case 'view':
        this.view(getData(target, 'index'));
        break;

      case 'zoom-in':
        this.zoom(0.1, true);
        break;

      case 'zoom-out':
        this.zoom(-0.1, true);
        break;

      case 'one-to-one':
        this.toggle();
        break;

      case 'reset':
        this.reset();
        break;

      case 'prev':
        this.prev(options.loop);
        break;

      case 'play':
        this.play();
        break;

      case 'next':
        this.next(options.loop);
        break;

      case 'rotate-left':
        this.rotate(-90);
        break;

      case 'rotate-right':
        this.rotate(90);
        break;

      case 'flip-horizontal':
        this.scaleX(-imageData.scaleX || -1);
        break;

      case 'flip-vertical':
        this.scaleY(-imageData.scaleY || -1);
        break;

      default:
        if (this.played) {
          this.stop();
        }
    }
  },

  load() {
    const {
      options,
      image,
      index,
      viewerData,
    } = this;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }

    if (!image) {
      return;
    }

    removeClass(image, CLASS_INVISIBLE);

    image.style.cssText = (
      'width:0;' +
      'height:0;' +
      `margin-left:${viewerData.width / 2}px;` +
      `margin-top:${viewerData.height / 2}px;` +
      'max-width:none!important;' +
      'visibility:visible;'
    );

    this.initImage(() => {
      toggleClass(image, CLASS_TRANSITION, options.transition);
      toggleClass(image, CLASS_MOVE, options.movable);

      this.renderImage(() => {
        this.viewed = true;
        dispatchEvent(this.element, EVENT_VIEWED, {
          originalImage: this.images[index],
          index,
          image,
        });
      });
    });
  },

  loadImage(e) {
    const image = e.target;
    const parent = image.parentNode;
    const parentWidth = parent.offsetWidth || 30;
    const parentHeight = parent.offsetHeight || 50;
    const filled = !!getData(image, 'filled');

    getImageNaturalSizes(image, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = parentWidth;
      let height = parentHeight;

      if (parentHeight * aspectRatio > parentWidth) {
        if (filled) {
          width = parentHeight * aspectRatio;
        } else {
          height = parentWidth / aspectRatio;
        }
      } else if (filled) {
        height = parentWidth / aspectRatio;
      } else {
        width = parentHeight * aspectRatio;
      }

      setStyle(image, {
        width,
        height,
        marginLeft: (parentWidth - width) / 2,
        marginTop: (parentHeight - height) / 2,
      });
    });
  },

  keydown(e) {
    const { options } = this;
    const key = e.keyCode || e.which || e.charCode;

    if (!this.fulled || !options.keyboard) {
      return;
    }

    switch (key) {
      // (Key: Esc)
      case 27:
        if (this.played) {
          this.stop();
        } else if (options.inline) {
          if (this.fulled) {
            this.exit();
          }
        } else {
          this.hide();
        }

        break;

      // (Key: Space)
      case 32:
        if (this.played) {
          this.stop();
        }

        break;

      // View previous (Key: ←)
      case 37:
        this.prev(options.loop);
        break;

      // Zoom in (Key: ↑)
      case 38:

        // Prevent scroll on Firefox
        e.preventDefault();

        this.zoom(options.zoomRatio, true);
        break;

      // View next (Key: →)
      case 39:
        this.next(options.loop);
        break;

      // Zoom out (Key: ↓)
      case 40:

        // Prevent scroll on Firefox
        e.preventDefault();

        this.zoom(-options.zoomRatio, true);
        break;

      // Zoom out to initial size (Key: Ctrl + 0)
      case 48:
        // Fall through

      // Zoom in to natural size (Key: Ctrl + 1)
      // eslint-disable-next-line
      case 49:
        if (e.ctrlKey || e.shiftKey) {
          e.preventDefault();
          this.toggle();
        }

        break;

      default:
    }
  },

  dragstart(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
      e.preventDefault();
    }
  },

  pointerdown(e) {
    const { options, pointers } = this;

    if (!this.viewed || this.transitioning) {
      return;
    }

    if (e.changedTouches) {
      each(e.changedTouches, (touch) => {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      pointers[e.pointerId || 0] = getPointer(e);
    }

    let action = options.movable ? ACTION_MOVE : false;

    if (Object.keys(pointers).length > 1) {
      action = ACTION_ZOOM;
    } else if ((e.pointerType === 'touch' || e.type === 'touchstart') && this.isSwitchable()) {
      action = ACTION_SWITCH;
    }

    this.action = action;
  },

  pointermove(e) {
    const {
      options,
      pointers,
      action,
      image,
    } = this;

    if (!this.viewed || !action) {
      return;
    }

    e.preventDefault();

    if (e.changedTouches) {
      each(e.changedTouches, (touch) => {
        extend(pointers[touch.identifier], getPointer(touch, true));
      });
    } else {
      extend(pointers[e.pointerId || 0], getPointer(e, true));
    }

    if (action === ACTION_MOVE && options.transition && hasClass(image, CLASS_TRANSITION)) {
      removeClass(image, CLASS_TRANSITION);
    }

    this.change(e);
  },

  pointerup(e) {
    const { action, pointers } = this;

    if (e.changedTouches) {
      each(e.changedTouches, (touch) => {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[e.pointerId || 0];
    }

    if (!action) {
      return;
    }

    if (action === ACTION_MOVE && this.options.transition) {
      addClass(this.image, CLASS_TRANSITION);
    }

    this.action = false;
  },

  resize() {
    this.initContainer();
    this.initViewer();
    this.renderViewer();
    this.renderList();

    if (this.viewed) {
      this.initImage(() => {
        this.renderImage();
      });
    }

    if (this.played) {
      if (this.options.fullscreen && this.fulled &&
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
        this.stop();
        return;
      }

      each(this.player.getElementsByTagName('img'), (image) => {
        addListener(image, EVENT_LOAD, proxy(this.loadImage, this), {
          once: true,
        });
        dispatchEvent(image, EVENT_LOAD);
      });
    }
  },

  start({ target }) {
    if (target.tagName.toLowerCase() === 'img' && this.images.indexOf(target) !== -1) {
      this.target = target;
      this.show();
    }
  },

  wheel(e) {
    if (!this.viewed) {
      return;
    }

    e.preventDefault();

    // Limit wheel speed to prevent zoom too fast
    if (this.wheeling) {
      return;
    }

    this.wheeling = true;

    setTimeout(() => {
      this.wheeling = false;
    }, 50);

    const ratio = Number(this.options.zoomRatio) || 0.1;
    let delta = 1;

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    this.zoom(-delta * ratio, true, e);
  },
};
