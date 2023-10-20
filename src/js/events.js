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
    const { options, viewer, canvas } = this;
    const document = this.element.ownerDocument;

    addListener(viewer, EVENT_CLICK, (this.onClick = this.click.bind(this)));
    addListener(viewer, EVENT_DRAG_START, (this.onDragStart = this.dragstart.bind(this)));
    // addListener(canvas, EVENT_POINTER_DOWN, (this.onPointerDown = this.pointerdown.bind(this)));
    // 使用新的事件绑定替代原有的绑定
    addListener(canvas, EVENT_POINTER_DOWN, (event) => {
      this.lastPointerPosition = {
        x: event.pageX,
        y: event.pageY
      };
      // 然后调用原有的事件处理函数
      if (this.pointerdown) {
        this.pointerdown(event);
      }
    });
    addListener(document, EVENT_POINTER_MOVE, (this.onPointerMove = this.pointermove.bind(this)));
    addListener(document, EVENT_POINTER_UP, (this.onPointerUp = this.pointerup.bind(this)));
    addListener(document, EVENT_KEY_DOWN, (this.onKeyDown = this.keydown.bind(this)));
    addListener(window, EVENT_RESIZE, (this.onResize = this.resize.bind(this)));

    if (options.zoomable && options.zoomOnWheel) {
      addListener(viewer, EVENT_WHEEL, (this.onWheel = this.wheel.bind(this)), {
        passive: false,
        capture: true,
      });
    }

    if (options.toggleOnDblclick) {
      addListener(canvas, EVENT_DBLCLICK, (this.onDblclick = this.dblclick.bind(this)));
    }
  },

  unbind() {
    const { options, viewer, canvas } = this;
    const document = this.element.ownerDocument;

    removeListener(viewer, EVENT_CLICK, this.onClick);
    removeListener(viewer, EVENT_DRAG_START, this.onDragStart);
    removeListener(canvas, EVENT_POINTER_DOWN, this.onPointerDown);
    removeListener(document, EVENT_POINTER_MOVE, this.onPointerMove);
    removeListener(document, EVENT_POINTER_UP, this.onPointerUp);
    removeListener(document, EVENT_KEY_DOWN, this.onKeyDown);
    removeListener(window, EVENT_RESIZE, this.onResize);

    if (options.zoomable && options.zoomOnWheel) {
      removeListener(viewer, EVENT_WHEEL, this.onWheel, {
        passive: false,
        capture: true,
      });
    }

    if (options.toggleOnDblclick) {
      removeListener(canvas, EVENT_DBLCLICK, this.onDblclick);
    }
  },
};
