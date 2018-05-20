import {
  ACTION_MOVE,
  ACTION_SWITCH,
  ACTION_ZOOM,
  CLASS_INVISIBLE,
  CLASS_LOADING,
  CLASS_MOVE,
  CLASS_TRANSITION,
  DATA_ACTION,
  EVENT_LOAD,
  EVENT_VIEWED,
} from './constants';
import {
  addClass,
  addListener,
  assign,
  dispatchEvent,
  forEach,
  getData,
  getImageNaturalSizes,
  getPointer,
  getTransforms,
  isFunction,
  removeClass,
  setStyle,
  toggleClass,
} from './utilities';

export default {
  click({ target }) {
    const { options, imageData } = this;
    const action = getData(target, DATA_ACTION);

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

      case 'hide':
        this.hide();
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
        this.play(options.fullscreen);
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
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }

    const {
      element,
      options,
      image,
      index,
      viewerData,
    } = this;

    removeClass(image, CLASS_INVISIBLE);

    if (options.loading) {
      removeClass(this.canvas, CLASS_LOADING);
    }

    image.style.cssText = (
      'height:0;' +
      `margin-left:${viewerData.width / 2}px;` +
      `margin-top:${viewerData.height / 2}px;` +
      'max-width:none!important;' +
      'position:absolute;' +
      'width:0;'
    );

    this.initImage(() => {
      toggleClass(image, CLASS_MOVE, options.movable);
      toggleClass(image, CLASS_TRANSITION, options.transition);

      this.renderImage(() => {
        this.viewed = true;
        this.viewing = false;

        if (isFunction(options.viewed)) {
          addListener(element, EVENT_VIEWED, options.viewed, {
            once: true,
          });
        }

        dispatchEvent(element, EVENT_VIEWED, {
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

      setStyle(image, assign({
        width,
        height,
      }, getTransforms({
        translateX: (parentWidth - width) / 2,
        translateY: (parentHeight - height) / 2,
      })));
    });
  },

  keydown(e) {
    const { options } = this;

    if (!this.fulled || !options.keyboard) {
      return;
    }

    switch (e.keyCode || e.which || e.charCode) {
      // Escape
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

      // Space
      case 32:
        if (this.played) {
          this.stop();
        }

        break;

      // ArrowLeft
      case 37:
        this.prev(options.loop);
        break;

      // ArrowUp
      case 38:
        // Prevent scroll on Firefox
        e.preventDefault();

        // Zoom in
        this.zoom(options.zoomRatio, true);
        break;

      // ArrowRight
      case 39:
        this.next(options.loop);
        break;

      // ArrowDown
      case 40:
        // Prevent scroll on Firefox
        e.preventDefault();

        // Zoom out
        this.zoom(-options.zoomRatio, true);
        break;

      // Ctrl + 0
      case 48:
        // Fall through

      // Ctrl + 1
      // eslint-disable-next-line no-fallthrough
      case 49:
        if (e.ctrlKey) {
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

    if (!this.viewed || this.showing || this.viewing || this.hiding) {
      return;
    }

    // This line is required for preventing page zooming in iOS browsers
    e.preventDefault();

    if (e.changedTouches) {
      forEach(e.changedTouches, (touch) => {
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

    if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      removeClass(this.image, CLASS_TRANSITION);
    }

    this.action = action;
  },

  pointermove(e) {
    const {
      pointers,
      action,
    } = this;

    if (!this.viewed || !action) {
      return;
    }

    e.preventDefault();

    if (e.changedTouches) {
      forEach(e.changedTouches, (touch) => {
        assign(pointers[touch.identifier], getPointer(touch, true));
      });
    } else {
      assign(pointers[e.pointerId || 0], getPointer(e, true));
    }

    this.change(e);
  },

  pointerup(e) {
    const { action, pointers } = this;

    if (e.changedTouches) {
      forEach(e.changedTouches, (touch) => {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[e.pointerId || 0];
    }

    if (!action) {
      return;
    }

    e.preventDefault();

    if (this.options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      addClass(this.image, CLASS_TRANSITION);
    }

    this.action = false;
  },

  resize() {
    if (!this.isShown || this.hiding) {
      return;
    }

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

      forEach(this.player.getElementsByTagName('img'), (image) => {
        addListener(image, EVENT_LOAD, this.loadImage.bind(this), {
          once: true,
        });
        dispatchEvent(image, EVENT_LOAD);
      });
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
