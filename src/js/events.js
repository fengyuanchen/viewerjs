import {
  EVENT_CLICK,
  EVENT_DRAG_START,
  EVENT_KEY_DOWN,
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP,
  EVENT_RESIZE,
  EVENT_VIEW,
  EVENT_VIEWED,
  EVENT_WHEEL,
} from './constants';
import {
  addListener,
  isFunction,
  proxy,
  removeListener,
} from './utilities';

export default {
  bind() {
    const { element, options, viewer } = this;

    if (isFunction(options.view)) {
      addListener(element, EVENT_VIEW, options.view);
    }

    if (isFunction(options.viewed)) {
      addListener(element, EVENT_VIEWED, options.viewed);
    }

    addListener(viewer, EVENT_CLICK, (this.onClick = proxy(this.click, this)));
    addListener(viewer, EVENT_WHEEL, (this.onWheel = proxy(this.wheel, this)));
    addListener(viewer, EVENT_DRAG_START, (this.onDragStart = proxy(this.dragstart, this)));
    addListener(
      this.canvas,
      EVENT_POINTER_DOWN,
      (this.onPointerDown = proxy(this.pointerdown, this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_POINTER_MOVE,
      (this.onPointerMove = proxy(this.pointermove, this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_POINTER_UP,
      (this.onPointerUp = proxy(this.pointerup, this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_KEY_DOWN,
      (this.onKeyDown = proxy(this.keydown, this)),
    );
    addListener(window, EVENT_RESIZE, (this.onResize = proxy(this.resize, this)));
  },

  unbind() {
    const { element, options, viewer } = this;

    if (isFunction(options.view)) {
      removeListener(element, EVENT_VIEW, options.view);
    }

    if (isFunction(options.viewed)) {
      removeListener(element, EVENT_VIEWED, options.viewed);
    }

    removeListener(viewer, EVENT_CLICK, this.onClick);
    removeListener(viewer, EVENT_WHEEL, this.onWheel);
    removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
    removeListener(this.canvas, EVENT_POINTER_DOWN, this.onPointerDown);
    removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onPointerMove);
    removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onPointerUp);
    removeListener(element.ownerDocument, EVENT_KEY_DOWN, this.onKeyDown);
    removeListener(window, EVENT_RESIZE, this.onResize);
  },
};
