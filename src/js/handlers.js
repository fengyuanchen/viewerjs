import {
  ACTION_MOVE,
  ACTION_ROTATE,
  ACTION_SWITCH,
  ACTION_TRANSFORM,
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
  isPlainObject,
  isTransitionEnabled,
  isUndefined,
  isWheelActionEnabled,
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

    this.actionEvent = event;

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
        if (!this.pointerMoved) {
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
      this.actionEvent = event.isTrusted ? event : (event.detail && event.detail.originalEvent);
      this.toggle();
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
      toggleClass(
        image,
        CLASS_TRANSITION,
        isTransitionEnabled(options, 'view'),
      );

      this.renderImage(() => {
        this.viewed = true;
        this.viewing = false;
        setTimeout(() => {
          toggleClass(image, CLASS_TRANSITION, options.transition);
        }, 300);

        if (isFunction(options.viewed)) {
          addListener(element, EVENT_VIEWED, options.viewed, {
            once: true,
          });
        }

        dispatchEvent(element, EVENT_VIEWED, {
          originalImage: this.images[index],
          index,
          image,
          originalEvent: this.viewOriginalEvent || null,
        }, {
          cancelable: false,
        });

        this.viewOriginalEvent = null;
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

    this.actionEvent = event;

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

  magnify(event) {
    if (event.changedTouches || (event.pointerType && event.pointerType !== 'mouse')) {
      this.hideMagnifier();
      return;
    }

    this.magnifierPoint = {
      clientX: event.clientX,
      clientY: event.clientY,
    };
    this.renderMagnifier();
  },

  renderMagnifier() {
    const {
      options,
      imageData,
      magnifier,
      magnifierImage,
      viewer,
    } = this;
    const config = isPlainObject(options.magnifier) ? options.magnifier : {};
    const point = this.magnifierPoint;

    if (!options.magnifier || !this.fulled || !this.viewed || !magnifier
      || !magnifierImage || !point) {
      this.hideMagnifier();
      return;
    }

    const size = Math.max(1, Number(config.size) || 100);
    const zoomRatio = Math.max(1, Number(config.zoomRatio) || 2);
    const opacity = Number(config.opacity);
    const rect = viewer.getBoundingClientRect();
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const imageURL = this.image.currentSrc || this.image.src;
    const imageRect = this.image.getBoundingClientRect();

    if (point.clientX < imageRect.left || point.clientX > imageRect.right
      || point.clientY < imageRect.top || point.clientY > imageRect.bottom) {
      this.hideMagnifier();
      return;
    }

    const scaleX = isNumber(imageData.scaleX) ? imageData.scaleX : 1;
    const scaleY = isNumber(imageData.scaleY) ? imageData.scaleY : 1;
    const rotate = ((imageData.rotate || 0) * Math.PI) / 180;
    const cos = Math.cos(rotate);
    const sin = Math.sin(rotate);
    const matrixA = cos * scaleX;
    const matrixB = sin * scaleX;
    const matrixC = -sin * scaleY;
    const matrixD = cos * scaleY;
    const determinant = scaleX * scaleY;

    if (determinant === 0) {
      this.hideMagnifier();
      return;
    }

    const centerX = imageData.x + (imageData.width / 2);
    const centerY = imageData.y + (imageData.height / 2);
    const localX = (matrixD * (x - centerX) - matrixC * (y - centerY)) / determinant;
    const localY = (-matrixB * (x - centerX) + matrixA * (y - centerY)) / determinant;
    const sourceX = localX + imageData.width / 2;
    const sourceY = localY + imageData.height / 2;
    const magnifiedWidth = imageData.width * zoomRatio;
    const magnifiedHeight = imageData.height * zoomRatio;
    const transformedX = matrixA * (sourceX * zoomRatio - magnifiedWidth / 2)
      + matrixC * (sourceY * zoomRatio - magnifiedHeight / 2);
    const transformedY = matrixB * (sourceX * zoomRatio - magnifiedWidth / 2)
      + matrixD * (sourceY * zoomRatio - magnifiedHeight / 2);

    this.magnifierSourcePoint = {
      x: sourceX,
      y: sourceY,
    };
    magnifier.style.width = `${size}px`;
    magnifier.style.height = `${size}px`;
    magnifier.style.opacity = `${Math.max(0, Math.min(1, isNumber(opacity) ? opacity : 1))}`;
    magnifierImage.src = imageURL;
    magnifierImage.style.width = `${magnifiedWidth}px`;
    magnifierImage.style.height = `${magnifiedHeight}px`;
    magnifierImage.style.left = `${size / 2 - magnifiedWidth / 2 - transformedX}px`;
    magnifierImage.style.top = `${size / 2 - magnifiedHeight / 2 - transformedY}px`;
    magnifierImage.style.transform = `rotate(${imageData.rotate || 0}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
    magnifier.removeAttribute('aria-hidden');
    addClass(magnifier, 'viewer-show');
  },

  hideMagnifier() {
    if (this.magnifier) {
      removeClass(this.magnifier, 'viewer-show');
      this.magnifier.setAttribute('aria-hidden', true);
      this.magnifierPoint = null;
    }
  },

  pointerdown(event) {
    const { options, pointers } = this;
    const { buttons, button } = event;

    this.pointerMoved = false;

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

    if ((
      (options.zoomable && options.zoomOnTouch)
      || (options.rotatable && options.rotateOnTouch)
    ) && Object.keys(pointers).length > 1) {
      // action = ACTION_ZOOM;
      // action = ACTION_ROTATE;
      action = ACTION_TRANSFORM;
    } else if (options.slideOnTouch && (event.pointerType === 'touch' || event.type === 'touchstart') && this.isSwitchable()) {
      action = ACTION_SWITCH;
    }

    if (action === ACTION_MOVE
      || action === ACTION_ZOOM
      || action === ACTION_ROTATE
      || action === ACTION_TRANSFORM) {
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

    if (action === ACTION_MOVE
      || action === ACTION_ZOOM
      || action === ACTION_ROTATE
      || action === ACTION_TRANSFORM) {
      const transition = action === ACTION_TRANSFORM
        ? isTransitionEnabled(options, ACTION_ZOOM)
          || isTransitionEnabled(options, ACTION_ROTATE)
        : isTransitionEnabled(options, action);

      toggleClass(this.image, CLASS_TRANSITION, transition);
    }

    this.action = false;

    // Emulate click and double click in touch devices to support backdrop and image zooming (#210).
    if (
      IS_TOUCH_DEVICE
      && action !== ACTION_ZOOM
      && action !== ACTION_TRANSFORM
      && pointer
      && (Date.now() - pointer.timeStamp < 500)
    ) {
      clearTimeout(this.clickCanvasTimeout);
      clearTimeout(this.doubleClickImageTimeout);

      if (options.toggleOnDblclick && this.viewed && event.target === this.image) {
        if (this.pointerMoved) {
          this.imageClicked = false;
        } else if (this.imageClicked) {
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

    const navbarOptions = isPlainObject(this.options.navbar) ? this.options.navbar : {};

    if (isUndefined(navbarOptions.visibleItemCount)) {
      this.initList(this.index);
    }

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
    const { options, navbar } = this;

    if (!this.viewed) {
      return;
    }

    event.preventDefault();

    if (this.gesturing) {
      return;
    }

    // Limit wheel speed to prevent zoom or slide too fast
    if (this.wheeling) {
      return;
    }

    this.wheeling = true;

    setTimeout(() => {
      this.wheeling = false;
    }, 50);

    let delta = 1;

    if (event.deltaY) {
      delta = event.deltaY > 0 ? 1 : -1;
    } else if (event.wheelDelta) {
      delta = -event.wheelDelta / 120;
    } else if (event.detail) {
      delta = event.detail > 0 ? 1 : -1;
    }

    // Wheeling over the navbar never zooms, only slides
    const overNavbar = navbar && navbar.contains(event.target);
    const zoomable = !overNavbar
      && options.zoomable
      && isWheelActionEnabled(options.zoomOnWheel, event);

    if (zoomable) {
      const ratio = Number(options.zoomRatio) || 0.1;

      this.actionEvent = event;
      this.zoom(-delta * ratio, true);
      return;
    }

    if (isWheelActionEnabled(options.slideOnWheel, event)) {
      this.actionEvent = event;

      if (delta > 0) {
        this.next(options.loop);
      } else if (delta < 0) {
        this.prev(options.loop);
      }
    }
  },

  gesture(event) {
    const { options } = this;

    if (!this.viewed || (!options.zoomOnGesture && !options.rotateOnGesture)) {
      return;
    }

    event.preventDefault();

    switch (event.type) {
      case 'gesturestart':
        this.gesturing = true;
        this.gestureScale = event.scale || 1;
        this.gestureRotation = event.rotation || 0;
        break;

      case 'gesturechange': {
        const scale = event.scale || 1;
        const ratio = scale / (this.gestureScale || 1);
        const rotation = Number(event.rotation);
        const degree = rotation - (this.gestureRotation || 0);

        this.gestureScale = scale;

        if (options.zoomable && options.zoomOnGesture && ratio !== 1) {
          this.actionEvent = event;
          this.zoom(ratio >= 1 ? ratio - 1 : 1 - (1 / ratio));
        }

        if (options.rotatable && options.rotateOnGesture && isNumber(rotation)) {
          this.gestureRotation = rotation;

          if (degree !== 0) {
            this.actionEvent = event;
            this.rotate(degree);
          }
        }

        break;
      }

      case 'gestureend':
        this.gesturing = false;
        this.gestureScale = 1;
        this.gestureRotation = 0;
        break;

      default:
    }
  },
};
