import * as $ from './utilities';

// Events
const PointerEvent = typeof window !== 'undefined' ? window.PointerEvent : null;
const EVENT_MOUSEDOWN = PointerEvent ? 'pointerdown' : 'touchstart mousedown';
const EVENT_MOUSEMOVE = PointerEvent ? 'pointermove' : 'mousemove touchmove';
const EVENT_MOUSEUP = PointerEvent ? 'pointerup pointercancel' : 'touchend touchcancel mouseup';
const EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
const EVENT_KEYDOWN = 'keydown';
const EVENT_DRAGSTART = 'dragstart';
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
    $.addListener(viewer, EVENT_DRAGSTART, (self.onDragstart = $.proxy(self.dragstart, self)));
    $.addListener(self.canvas, EVENT_MOUSEDOWN, (self.onMousedown = $.proxy(self.mousedown, self)));
    $.addListener(document, EVENT_MOUSEMOVE, (self.onMousemove = $.proxy(self.mousemove, self)));
    $.addListener(document, EVENT_MOUSEUP, (self.onMouseup = $.proxy(self.mouseup, self)));
    $.addListener(document, EVENT_KEYDOWN, (self.onKeydown = $.proxy(self.keydown, self)));
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
    $.removeListener(viewer, EVENT_DRAGSTART, self.onDragstart);
    $.removeListener(self.canvas, EVENT_MOUSEDOWN, self.onMousedown);
    $.removeListener(document, EVENT_MOUSEMOVE, self.onMousemove);
    $.removeListener(document, EVENT_MOUSEUP, self.onMouseup);
    $.removeListener(document, EVENT_KEYDOWN, self.onKeydown);
    $.removeListener(window, EVENT_RESIZE, self.onResize);
  },
};
