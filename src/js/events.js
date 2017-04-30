import * as $ from './utilities';

// Events
const PointerEvent = typeof window !== 'undefined' ? window.PointerEvent : null;
const EVENT_POINTER_DOWN = PointerEvent ? 'pointerdown' : 'touchstart mousedown';
const EVENT_POINTER_MOVE = PointerEvent ? 'pointermove' : 'mousemove touchmove';
const EVENT_POINTER_UP = PointerEvent ? 'pointerup pointercancel' : 'touchend touchcancel mouseup';
const EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
const EVENT_KEY_DOWN = 'keydown';
const EVENT_DRAGS_TART = 'dragstart';
const EVENT_CLICK = 'click';
const EVENT_RESIZE = 'resize';
const EVENT_VIEW = 'view';
const EVENT_VIEWED = 'viewed';

export default {
  bind() {
    const self = this;
    const options = self.options;
    const element = self.element;
    const viewer = self.viewer;

    if ($.isFunction(options.view)) {
      $.addListener(element, EVENT_VIEW, options.view);
    }

    if ($.isFunction(options.viewed)) {
      $.addListener(element, EVENT_VIEWED, options.viewed);
    }

    $.addListener(viewer, EVENT_CLICK, (self.onClick = $.proxy(self.click, self)));
    $.addListener(viewer, EVENT_WHEEL, (self.onWheel = $.proxy(self.wheel, self)));
    $.addListener(viewer, EVENT_DRAGS_TART, (self.onDragstart = $.proxy(self.dragstart, self)));
    $.addListener(self.canvas, EVENT_POINTER_DOWN, (
      self.onPointerdown = $.proxy(self.pointerdown, self)
    ));
    $.addListener(document, EVENT_POINTER_MOVE, (
      self.onPointermove = $.proxy(self.pointermove, self)
    ));
    $.addListener(document, EVENT_POINTER_UP, (self.onPointerup = $.proxy(self.pointerup, self)));
    $.addListener(document, EVENT_KEY_DOWN, (self.onKeydown = $.proxy(self.keydown, self)));
    $.addListener(window, EVENT_RESIZE, (self.onResize = $.proxy(self.resize, self)));
  },

  unbind() {
    const self = this;
    const options = self.options;
    const element = self.element;
    const viewer = self.viewer;

    if ($.isFunction(options.view)) {
      $.removeListener(element, EVENT_VIEW, options.view);
    }

    if ($.isFunction(options.viewed)) {
      $.removeListener(element, EVENT_VIEWED, options.viewed);
    }

    $.removeListener(viewer, EVENT_CLICK, self.onClick);
    $.removeListener(viewer, EVENT_WHEEL, self.onWheel);
    $.removeListener(viewer, EVENT_DRAGS_TART, self.onDragstart);
    $.removeListener(self.canvas, EVENT_POINTER_DOWN, self.onPointerdown);
    $.removeListener(document, EVENT_POINTER_MOVE, self.onPointermove);
    $.removeListener(document, EVENT_POINTER_UP, self.onPointerup);
    $.removeListener(document, EVENT_KEY_DOWN, self.onKeydown);
    $.removeListener(window, EVENT_RESIZE, self.onResize);
  },
};
