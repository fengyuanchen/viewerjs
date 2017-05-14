import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import events from './events';
import handlers from './handlers';
import methods from './methods';
import others from './others';
import * as $ from './utilities';

const SUPPORT_TRANSITION = typeof document.createElement('viewer').style.transition !== 'undefined';
let AnotherViewer;

class Viewer {
  constructor(element, options) {
    const self = this;

    self.element = element;
    self.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
    self.isImg = false;
    self.ready = false;
    self.visible = false;
    self.viewed = false;
    self.fulled = false;
    self.played = false;
    self.wheeling = false;
    self.playing = false;
    self.fading = false;
    self.tooltiping = false;
    self.transitioning = false;
    self.action = false;
    self.target = false;
    self.timeout = false;
    self.index = 0;
    self.length = 0;
    self.pointers = {};
    self.init();
  }

  init() {
    const self = this;
    const options = self.options;
    const element = self.element;

    if ($.getData(element, 'viewer')) {
      return;
    }

    $.setData(element, 'viewer', self);

    const isImg = element.tagName.toLowerCase() === 'img';
    const images = isImg ? [element] : $.getByTag(element, 'img');
    const length = images.length;

    if (!length) {
      return;
    }

    if ($.isFunction(options.ready)) {
      $.addListener(element, 'ready', options.ready, true);
    }

    // Override `transition` option if it is not supported
    if (!SUPPORT_TRANSITION) {
      options.transition = false;
    }

    self.isImg = isImg;
    self.length = length;
    self.count = 0;
    self.images = images;
    self.body = document.body;
    self.scrollbarWidth = window.innerWidth - document.body.clientWidth;

    if (options.inline) {
      const progress = $.proxy(self.progress, self);

      $.addListener(element, 'ready', () => {
        self.view();
      }, true);

      $.each(images, (image) => {
        if (image.complete) {
          progress();
        } else {
          $.addListener(image, 'load', progress, true);
        }
      });
    } else {
      $.addListener(element, 'click', (self.onStart = $.proxy(self.start, self)));
    }
  }

  progress() {
    const self = this;

    self.count++;

    if (self.count === self.length) {
      self.build();
    }
  }

  build() {
    const self = this;
    const options = self.options;
    const element = self.element;

    if (self.ready) {
      return;
    }

    const template = document.createElement('div');
    let parent;
    let viewer;
    let button;
    let toolbar;
    let navbar;
    let title;

    template.innerHTML = TEMPLATE;

    self.parent = parent = element.parentNode;
    self.viewer = viewer = $.getByClass(template, 'viewer-container')[0];
    self.canvas = $.getByClass(viewer, 'viewer-canvas')[0];
    self.footer = $.getByClass(viewer, 'viewer-footer')[0];
    self.title = title = $.getByClass(viewer, 'viewer-title')[0];
    self.toolbar = toolbar = $.getByClass(viewer, 'viewer-toolbar')[0];
    self.navbar = navbar = $.getByClass(viewer, 'viewer-navbar')[0];
    self.button = button = $.getByClass(viewer, 'viewer-button')[0];
    self.tooltipBox = $.getByClass(viewer, 'viewer-tooltip')[0];
    self.player = $.getByClass(viewer, 'viewer-player')[0];
    self.list = $.getByClass(viewer, 'viewer-list')[0];

    $.addClass(title, !options.title ? 'viewer-hide' : $.getResponsiveClass(options.title));
    $.addClass(toolbar, !options.toolbar ? 'viewer-hide' : $.getResponsiveClass(options.toolbar));
    $.addClass(navbar, !options.navbar ? 'viewer-hide' : $.getResponsiveClass(options.navbar));
    $.toggleClass(button, 'viewer-hide', !options.button);

    $.toggleClass(toolbar.querySelector('.viewer-one-to-one'), 'viewer-invisible', !options.zoomable);
    $.toggleClass(toolbar.querySelectorAll('li[class*="zoom"]'), 'viewer-invisible', !options.zoomable);
    $.toggleClass(toolbar.querySelectorAll('li[class*="flip"]'), 'viewer-invisible', !options.scalable);

    if (!options.rotatable) {
      const rotates = toolbar.querySelectorAll('li[class*="rotate"]');

      $.addClass(rotates, 'viewer-invisible');
      $.appendChild(toolbar, rotates);
    }

    if (options.inline) {
      $.addClass(button, 'viewer-fullscreen');
      $.setStyle(viewer, {
        zIndex: options.zIndexInline
      });

      if ($.getStyle(parent).position === 'static') {
        $.setStyle(parent, {
          position: 'relative'
        });
      }

      parent.insertBefore(viewer, element.nextSibling);
    } else {
      $.addClass(button, 'viewer-close');
      $.addClass(viewer, 'viewer-fixed');
      $.addClass(viewer, 'viewer-fade');
      $.addClass(viewer, 'viewer-hide');

      $.setStyle(viewer, {
        zIndex: options.zIndex
      });

      document.body.appendChild(viewer);
    }

    if (options.inline) {
      self.render();
      self.bind();
      self.visible = true;
    }

    self.ready = true;

    $.dispatchEvent(element, 'ready');
  }

  unbuild() {
    const self = this;

    if (!self.ready) {
      return;
    }

    self.ready = false;
    $.removeChild(self.viewer);
  }

  static noConflict() {
    window.Viewer = AnotherViewer;
    return Viewer;
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

$.extend(Viewer.prototype, render);
$.extend(Viewer.prototype, events);
$.extend(Viewer.prototype, handlers);
$.extend(Viewer.prototype, methods);
$.extend(Viewer.prototype, others);

if (typeof window !== 'undefined') {
  AnotherViewer = window.Viewer;
  window.Viewer = Viewer;
}

export default Viewer;
