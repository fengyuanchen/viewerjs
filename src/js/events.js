import {
  EVENT_CLICK,
  EVENT_DBLCLICK,
  EVENT_DRAG_START,
  EVENT_KEY_DOWN,
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP,
  EVENT_RESIZE,
  EVENT_WHEEL,
} from './constants';
import {
  addListener,
  removeListener,
} from './utilities';

export default {
  bind() {
    const { canvas, element, viewer } = this;

    addListener(viewer, EVENT_CLICK, (this.onClick = this.click.bind(this)));
    addListener(viewer, EVENT_WHEEL, (this.onWheel = this.wheel.bind(this)));
    addListener(viewer, EVENT_DRAG_START, (this.onDragStart = this.dragstart.bind(this)));

    if (this.options.toggleOnDblclick) {
      addListener(canvas, EVENT_DBLCLICK, (this.onDblclick = this.dblclick.bind(this)));
    }

    addListener(
      canvas,
      EVENT_POINTER_DOWN,
      (this.onPointerDown = this.pointerdown.bind(this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_POINTER_MOVE,
      (this.onPointerMove = this.pointermove.bind(this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_POINTER_UP,
      (this.onPointerUp = this.pointerup.bind(this)),
    );
    addListener(
      element.ownerDocument,
      EVENT_KEY_DOWN,
      (this.onKeyDown = this.keydown.bind(this)),
    );
    addListener(window, EVENT_RESIZE, (this.onResize = this.resize.bind(this)));
  },

  unbind() {
    const { canvas, element, viewer } = this;

    removeListener(viewer, EVENT_CLICK, this.onClick);
    removeListener(viewer, EVENT_WHEEL, this.onWheel);
    removeListener(viewer, EVENT_DRAG_START, this.onDragStart);

    if (this.options.toggleOnDblclick) {
      removeListener(canvas, EVENT_DBLCLICK, this.onDblclick);
    }

    removeListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown);
    removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onPointerMove);
    removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onPointerUp);
    removeListener(element.ownerDocument, EVENT_KEY_DOWN, this.onKeyDown);
    removeListener(window, EVENT_RESIZE, this.onResize);
  },
};
