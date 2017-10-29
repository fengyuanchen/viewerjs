import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import events from './events';
import handlers from './handlers';
import methods from './methods';
import others from './others';
import {
  CLASS_CLOSE,
  CLASS_FADE,
  CLASS_FIXED,
  CLASS_FULLSCREEN,
  CLASS_HIDE,
  CLASS_INVISIBLE,
  EVENT_CLICK,
  EVENT_LOAD,
  EVENT_READY,
  NAMESPACE,
  WINDOW,
} from './constants';
import {
  addClass,
  addListener,
  dispatchEvent,
  each,
  extend,
  getData,
  getResponsiveClass,
  getStyle,
  isFunction,
  isPlainObject,
  isUndefined,
  proxy,
  setData,
  setStyle,
  toggleClass,
} from './utilities';

const AnotherViewer = WINDOW.Viewer;

class Viewer {
  /**
   * Create a new Viewer.
   * @param {Element} element - The target element for viewing.
   * @param {Object} [options={}] - The configuration options.
   */
  constructor(element, options = {}) {
    if (!element || element.nodeType !== 1) {
      throw new Error('The first argument is required and must be an element.');
    }

    this.element = element;
    this.options = extend({}, DEFAULTS, isPlainObject(options) && options);
    this.isImg = false;
    this.ready = false;
    this.visible = false;
    this.viewed = false;
    this.fulled = false;
    this.played = false;
    this.wheeling = false;
    this.playing = false;
    this.fading = false;
    this.tooltiping = false;
    this.transitioning = false;
    this.action = false;
    this.target = false;
    this.timeout = false;
    this.index = 0;
    this.length = 0;
    this.pointers = {};
    this.init();
  }

  init() {
    const { element, options } = this;

    if (getData(element, NAMESPACE)) {
      return;
    }

    setData(element, NAMESPACE, this);

    const isImg = element.tagName.toLowerCase() === 'img';
    let images = isImg ? [element] : element.querySelectorAll('img');

    if (isFunction(options.filter)) {
      const filtered = [];

      each(images, (image) => {
        if (options.filter(image)) {
          filtered.push(image);
        }
      });

      images = filtered;
    }

    const { length } = images;

    if (!length) {
      return;
    }

    if (isFunction(options.ready)) {
      addListener(element, EVENT_READY, options.ready, {
        once: true,
      });
    }

    // Override `transition` option if it is not supported
    if (isUndefined(document.createElement(NAMESPACE).style.transition)) {
      options.transition = false;
    }

    this.isImg = isImg;
    this.length = length;
    this.count = 0;
    this.images = images;
    this.body = document.body;
    this.scrollbarWidth = window.innerWidth - document.body.clientWidth;

    if (options.inline) {
      const progress = proxy(this.progress, this);

      addListener(element, EVENT_READY, () => {
        this.view();
      }, {
        once: true,
      });

      each(images, (image) => {
        if (image.complete) {
          progress();
        } else {
          addListener(image, EVENT_LOAD, progress, {
            once: true,
          });
        }
      });
    } else {
      addListener(element, EVENT_CLICK, (this.onStart = proxy(this.start, this)));
    }
  }

  progress() {
    this.count += 1;

    if (this.count === this.length) {
      this.build();
    }
  }

  build() {
    const { options } = this;
    const { element } = this;

    if (this.ready) {
      return;
    }

    const parent = element.parentNode;
    const template = document.createElement('div');

    template.innerHTML = TEMPLATE;

    const viewer = template.querySelector(`.${NAMESPACE}-container`);
    const title = viewer.querySelector(`.${NAMESPACE}-title`);
    const toolbar = viewer.querySelector(`.${NAMESPACE}-toolbar`);
    const navbar = viewer.querySelector(`.${NAMESPACE}-navbar`);
    const button = viewer.querySelector(`.${NAMESPACE}-button`);

    this.parent = parent;
    this.viewer = viewer;
    this.title = title;
    this.toolbar = toolbar;
    this.navbar = navbar;
    this.button = button;
    this.canvas = viewer.querySelector(`.${NAMESPACE}-canvas`);
    this.footer = viewer.querySelector(`.${NAMESPACE}-footer`);
    this.tooltipBox = viewer.querySelector(`.${NAMESPACE}-tooltip`);
    this.player = viewer.querySelector(`.${NAMESPACE}-player`);
    this.list = viewer.querySelector(`.${NAMESPACE}-list`);

    addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(options.title));
    addClass(toolbar, !options.toolbar ? CLASS_HIDE : getResponsiveClass(options.toolbar));
    addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
    toggleClass(button, CLASS_HIDE, !options.button);

    toggleClass(toolbar.querySelector(`.${NAMESPACE}-one-to-one`), CLASS_INVISIBLE, !options.zoomable);
    toggleClass(toolbar.querySelectorAll('li[class*="zoom"]'), CLASS_INVISIBLE, !options.zoomable);
    toggleClass(toolbar.querySelectorAll('li[class*="flip"]'), CLASS_INVISIBLE, !options.scalable);

    if (!options.rotatable) {
      const rotates = toolbar.querySelectorAll('li[class*="rotate"]');

      addClass(rotates, CLASS_INVISIBLE);
      each(rotates, (rotate) => {
        toolbar.appendChild(rotate);
      });
    }

    if (options.inline) {
      addClass(button, CLASS_FULLSCREEN);
      setStyle(viewer, {
        zIndex: options.zIndexInline,
      });

      if (getStyle(parent).position === 'static') {
        setStyle(parent, {
          position: 'relative',
        });
      }

      parent.insertBefore(viewer, element.nextSibling);
    } else {
      addClass(button, CLASS_CLOSE);
      addClass(viewer, CLASS_FIXED);
      addClass(viewer, CLASS_FADE);
      addClass(viewer, CLASS_HIDE);

      setStyle(viewer, {
        zIndex: options.zIndex,
      });

      document.body.appendChild(viewer);
    }

    if (options.inline) {
      this.render();
      this.bind();
      this.visible = true;
    }

    this.ready = true;

    dispatchEvent(element, EVENT_READY);
  }

  unbuild() {
    if (!this.ready) {
      return;
    }

    this.ready = false;
    this.viewer.parentNode.removeChild(this.viewer);
  }

  /**
   * Get the no conflict viewer class.
   * @returns {Viewer} The viewer class.
   */
  static noConflict() {
    window.Viewer = AnotherViewer;
    return Viewer;
  }

  /**
   * Change the default options.
   * @param {Object} options - The new default options.
   */
  static setDefaults(options) {
    extend(DEFAULTS, isPlainObject(options) && options);
  }
}

extend(Viewer.prototype, render, events, handlers, methods, others);

export default Viewer;
