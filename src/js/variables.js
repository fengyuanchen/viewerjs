  var document = window.document;
  var Event = window.Event;

  // Constants
  var NAMESPACE = 'viewer';

  // Classes
  var CLASS_FIXED = NAMESPACE + '-fixed';
  var CLASS_OPEN = NAMESPACE + '-open';
  var CLASS_SHOW = NAMESPACE + '-show';
  var CLASS_HIDE = NAMESPACE + '-hide';
  var CLASS_HIDE_XS_DOWN = 'viewer-hide-xs-down';
  var CLASS_HIDE_SM_DOWN = 'viewer-hide-sm-down';
  var CLASS_HIDE_MD_DOWN = 'viewer-hide-md-down';
  var CLASS_FADE = NAMESPACE + '-fade';
  var CLASS_IN = NAMESPACE + '-in';
  var CLASS_MOVE = NAMESPACE + '-move';
  var CLASS_ACTIVE = NAMESPACE + '-active';
  var CLASS_INVISIBLE = NAMESPACE + '-invisible';
  var CLASS_TRANSITION = NAMESPACE + '-transition';
  var CLASS_FULLSCREEN = NAMESPACE + '-fullscreen';
  var CLASS_FULLSCREEN_EXIT = NAMESPACE + '-fullscreen-exit';
  var CLASS_CLOSE = NAMESPACE + '-close';

  // Events
  var EVENT_MOUSEDOWN = 'mousedown touchstart pointerdown MSPointerDown';
  var EVENT_MOUSEMOVE = 'mousemove touchmove pointermove MSPointerMove';
  var EVENT_MOUSEUP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel';
  var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
  var EVENT_TRANSITIONEND = 'transitionend';
  var EVENT_LOAD = 'load';
  var EVENT_KEYDOWN = 'keydown';
  var EVENT_CLICK = 'click';
  var EVENT_RESIZE = 'resize';
  var EVENT_BUILD = 'build';
  var EVENT_BUILT = 'built';
  var EVENT_SHOW = 'show';
  var EVENT_SHOWN = 'shown';
  var EVENT_HIDE = 'hide';
  var EVENT_HIDDEN = 'hidden';
  var EVENT_VIEW = 'view';
  var EVENT_VIEWED = 'viewed';

  // RegExps
  var REGEXP_SUFFIX = /width|height|left|top|marginLeft|marginTop/;
  var REGEXP_TRIM = /^\s+(.*)\s+$/;
  var REGEXP_SPACES = /\s+/;

  // Supports
  var SUPPORT_TRANSITION = typeof document.createElement(NAMESPACE).style.transition !== 'undefined';

  // Maths
  var min = Math.min;
  var max = Math.max;
  var abs = Math.abs;
  var sqrt = Math.sqrt;
  var round = Math.round;

  // Utilities
  var objectProto = Object.prototype;
  var toString = objectProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var slice = Array.prototype.slice;
