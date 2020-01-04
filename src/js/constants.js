export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const WINDOW = IS_BROWSER ? window : {};
export const IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
export const HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
export const NAMESPACE = 'viewer';

// Actions
export const ACTION_MOVE = 'move';
export const ACTION_SWITCH = 'switch';
export const ACTION_ZOOM = 'zoom';

// Classes
export const CLASS_ACTIVE = `${NAMESPACE}-active`;
export const CLASS_CLOSE = `${NAMESPACE}-close`;
export const CLASS_FADE = `${NAMESPACE}-fade`;
export const CLASS_FIXED = `${NAMESPACE}-fixed`;
export const CLASS_FULLSCREEN = `${NAMESPACE}-fullscreen`;
export const CLASS_FULLSCREEN_EXIT = `${NAMESPACE}-fullscreen-exit`;
export const CLASS_HIDE = `${NAMESPACE}-hide`;
export const CLASS_HIDE_MD_DOWN = `${NAMESPACE}-hide-md-down`;
export const CLASS_HIDE_SM_DOWN = `${NAMESPACE}-hide-sm-down`;
export const CLASS_HIDE_XS_DOWN = `${NAMESPACE}-hide-xs-down`;
export const CLASS_IN = `${NAMESPACE}-in`;
export const CLASS_INVISIBLE = `${NAMESPACE}-invisible`;
export const CLASS_LOADING = `${NAMESPACE}-loading`;
export const CLASS_MOVE = `${NAMESPACE}-move`;
export const CLASS_OPEN = `${NAMESPACE}-open`;
export const CLASS_SHOW = `${NAMESPACE}-show`;
export const CLASS_TRANSITION = `${NAMESPACE}-transition`;

// Events
export const EVENT_CLICK = 'click';
export const EVENT_DBLCLICK = 'dblclick';
export const EVENT_DRAG_START = 'dragstart';
export const EVENT_HIDDEN = 'hidden';
export const EVENT_HIDE = 'hide';
export const EVENT_KEY_DOWN = 'keydown';
export const EVENT_LOAD = 'load';
export const EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
export const EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
export const EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
export const EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
export const EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
export const EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
export const EVENT_READY = 'ready';
export const EVENT_RESIZE = 'resize';
export const EVENT_SHOW = 'show';
export const EVENT_SHOWN = 'shown';
export const EVENT_TRANSITION_END = 'transitionend';
export const EVENT_VIEW = 'view';
export const EVENT_VIEWED = 'viewed';
export const EVENT_WHEEL = 'wheel';
export const EVENT_ZOOM = 'zoom';
export const EVENT_ZOOMED = 'zoomed';

// Data keys
export const DATA_ACTION = `${NAMESPACE}Action`;

// RegExps
export const REGEXP_SPACES = /\s\s*/;

// Misc
export const BUTTONS = [
  'zoom-in',
  'zoom-out',
  'one-to-one',
  'reset',
  'prev',
  'play',
  'next',
  'rotate-left',
  'rotate-right',
  'flip-horizontal',
  'flip-vertical',
];
