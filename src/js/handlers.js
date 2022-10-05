import {
  ACTION_MOVE,
  ACTION_SWITCH,
  ACTION_ZOOM,
  CLASS_INVISIBLE,
  CLASS_LOADING,
  CLASS_MOVE,
  CLASS_TRANSITION,
  DATA_ACTION,
  EVENT_CLICK,
  EVENT_DBLCLICK,
  EVENT_LOAD,
  EVENT_VIEWED,
  IS_TOUCH_DEVICE,
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
  isNumber,
  removeClass,
  setStyle,
  toggleClass,
} from './utilities';

export default {
  click(event) {
    const { options, imageData } = this;
    let { target } = event;
    let action = getData(target, DATA_ACTION);

    if (!action && target.localName === 'img' && target.parentElement.localName === 'li') {
      target = target.parentElement;
      action = getData(target, DATA_ACTION);
    }

    // Cancel the emulated click when the native click event was triggered.
    if (IS_TOUCH_DEVICE && event.isTrusted && target === this.canvas) {
      clearTimeout(this.clickCanvasTimeout);
    }

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

  dblclick(event) {
    event.preventDefault();

    if (this.viewed && event.target === this.image) {
      // Cancel the emulated double click when the native dblclick event was triggered.
      if (IS_TOUCH_DEVICE && event.isTrusted) {
        clearTimeout(this.doubleClickImageTimeout);
      }

      // XXX: No pageX/Y properties in custom event, fallback to the original event.
      this.toggle(event.isTrusted ? event : (event.detail && event.detail.originalEvent));
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
      'height:0;'
      + `margin-left:${viewerData.width / 2}px;`
      + `margin-top:${viewerData.height / 2}px;`
      + 'max-width:none!important;'
      + 'position:relative;'
      + 'width:0;'
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
        }, {
          cancelable: false,
        });
      });
    });
  },

  loadImage(event) {
    const image = event.target;
    const parent = image.parentNode;
    const parentWidth = parent.offsetWidth || 30;
    const parentHeight = parent.offsetHeight || 50;
    const filled = !!getData(image, 'filled');

    getImageNaturalSizes(image, this.options, (naturalWidth, naturalHeight) => {
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

  keydown(event) {
    const { options } = this;

    if (!options.keyboard) {
      return;
    }

    const keyCode = event.keyCode || event.which || event.charCode;

    switch (keyCode) {
      // Enter
      case 13:
        if (this.viewer.contains(event.target)) {
          this.click(event);
        }

        break;

      default:
    }

    if (!this.fulled) {
      return;
    }

    switch (keyCode) {
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
        if (this.played && this.playing) {
          this.playing.prev();
        } else {
          this.prev(options.loop);
        }
        break;

      // ArrowUp
      case 38:
        // Prevent scroll on Firefox
        event.preventDefault();

        // Zoom in
        this.zoom(options.zoomRatio, true);
        break;

      // ArrowRight
      case 39:
        if (this.played && this.playing) {
          this.playing.next();
        } else {
          this.next(options.loop);
        }
        break;

      // ArrowDown
      case 40:
        // Prevent scroll on Firefox
        event.preventDefault();

        // Zoom out
        this.zoom(-options.zoomRatio, true);
        break;

      // Ctrl + 0
      case 48:
        // Fall through

      // Ctrl + 1
      // eslint-disable-next-line no-fallthrough
      case 49:
        if (event.ctrlKey) {
          event.preventDefault();
          this.toggle();
        }

        break;

      default:
    }
  },

  dragstart(event) {
    if (event.target.localName === 'img') {
      event.preventDefault();
    }
  },

  pointerdown(event) {
    const { options, pointers } = this;
    const { buttons, button } = event;

    if (
      !this.viewed
      || this.showing
      || this.viewing
      || this.hiding

      // Handle mouse event and pointer event and ignore touch event
      || ((
        event.type === 'mousedown'
        || (event.type === 'pointerdown' && event.pointerType === 'mouse')
      ) && (
        // No primary button (Usually the left button)
        (isNumber(buttons) && buttons !== 1)
        || (isNumber(button) && button !== 0)

        // Open context menu
        || event.ctrlKey
      ))
    ) {
      return;
    }

    // Prevent default behaviours as page zooming in touch devices.
    event.preventDefault();

    if (event.changedTouches) {
      forEach(event.changedTouches, (touch) => {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      pointers[event.pointerId || 0] = getPointer(event);
    }

    let action = options.movable ? ACTION_MOVE : false;

    if (options.zoomOnTouch && options.zoomable && Object.keys(pointers).length > 1) {
      action = ACTION_ZOOM;
    } else if (options.slideOnTouch && (event.pointerType === 'touch' || event.type === 'touchstart') && this.isSwitchable()) {
      action = ACTION_SWITCH;
    }

    if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      removeClass(this.image, CLASS_TRANSITION);
    }

    this.action = action;
  },

  pointermove(event) {
    const { pointers, action } = this;

    if (!this.viewed || !action) {
      return;
    }

    event.preventDefault();

    if (event.changedTouches) {
      forEach(event.changedTouches, (touch) => {
        assign(pointers[touch.identifier] || {}, getPointer(touch, true));
      });
    } else {
      assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
    }

    this.change(event);
  },

  pointerup(event) {
    const { options, action, pointers } = this;
    let pointer;

    if (event.changedTouches) {
      forEach(event.changedTouches, (touch) => {
        pointer = pointers[touch.identifier];
        delete pointers[touch.identifier];
      });
    } else {
      pointer = pointers[event.pointerId || 0];
      delete pointers[event.pointerId || 0];
    }

    if (!action) {
      return;
    }

    event.preventDefault();

    if (options.transition && (action === ACTION_MOVE || action === ACTION_ZOOM)) {
      addClass(this.image, CLASS_TRANSITION);
    }

    this.action = false;

    // Emulate click and double click in touch devices to support backdrop and image zooming (#210).
    if (
      IS_TOUCH_DEVICE
      && action !== ACTION_ZOOM
      && pointer
      && (Date.now() - pointer.timeStamp < 500)
    ) {
      clearTimeout(this.clickCanvasTimeout);
      clearTimeout(this.doubleClickImageTimeout);

      if (options.toggleOnDblclick && this.viewed && event.target === this.image) {
        if (this.imageClicked) {
          this.imageClicked = false;

          // This timeout will be cleared later when a native dblclick event is triggering
          this.doubleClickImageTimeout = setTimeout(() => {
            dispatchEvent(this.image, EVENT_DBLCLICK, {
              originalEvent: event,
            });
          }, 50);
        } else {
          this.imageClicked = true;

          // The default timing of a double click in Windows is 500 ms
          this.doubleClickImageTimeout = setTimeout(() => {
            this.imageClicked = false;
          }, 500);
        }
      } else {
        this.imageClicked = false;

        if (options.backdrop && options.backdrop !== 'static' && event.target === this.canvas) {
          // This timeout will be cleared later when a native click event is triggering
          this.clickCanvasTimeout = setTimeout(() => {
            dispatchEvent(this.canvas, EVENT_CLICK, {
              originalEvent: event,
            });
          }, 50);
        }
      }
    }
  },

  resize() {
    if (!this.isShown || this.hiding) {
      return;
    }

    if (this.fulled) {
      this.close();
      this.initBody();
      this.open();
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
      if (this.options.fullscreen && this.fulled && !(
        document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement
      )) {
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

  wheel(event) {
    if (!this.viewed) {
      return;
    }

    event.preventDefault();

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

    if (event.deltaY) {
      delta = event.deltaY > 0 ? 1 : -1;
    } else if (event.wheelDelta) {
      delta = -event.wheelDelta / 120;
    } else if (event.detail) {
      delta = event.detail > 0 ? 1 : -1;
    }

    this.zoom(-delta * ratio, true, null, event);
  },
};
