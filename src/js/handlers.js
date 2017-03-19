import * as $ from './utilities';

export default {
  start(event) {
    const self = this;
    const e = $.getEvent(event);
    const target = e.target;

    if (target.tagName.toLowerCase() === 'img') {
      self.target = target;
      self.show();
    }
  },

  click(event) {
    const self = this;
    const e = $.getEvent(event);
    const target = e.target;
    const action = $.getData(target, 'action');
    const imageData = self.imageData;

    switch (action) {
      case 'mix':
        if (self.played) {
          self.stop();
        } else if (self.options.inline) {
          if (self.fulled) {
            self.exit();
          } else {
            self.full();
          }
        } else {
          self.hide();
        }

        break;

      case 'view':
        self.view($.getData(target, 'index'));
        break;

      case 'zoom-in':
        self.zoom(0.1, true);
        break;

      case 'zoom-out':
        self.zoom(-0.1, true);
        break;

      case 'one-to-one':
        self.toggle();
        break;

      case 'reset':
        self.reset();
        break;

      case 'prev':
        self.prev();
        break;

      case 'play':
        self.play();
        break;

      case 'next':
        self.next();
        break;

      case 'rotate-left':
        self.rotate(-90);
        break;

      case 'rotate-right':
        self.rotate(90);
        break;

      case 'flip-horizontal':
        self.scaleX(-imageData.scaleX || -1);
        break;

      case 'flip-vertical':
        self.scaleY(-imageData.scaleY || -1);
        break;

      default:
        if (self.played) {
          self.stop();
        }
    }
  },

  load() {
    const self = this;
    const options = self.options;
    const image = self.image;
    const index = self.index;
    const viewerData = self.viewerData;

    if (self.timeout) {
      clearTimeout(self.timeout);
      self.timeout = false;
    }

    $.removeClass(image, 'viewer-invisible');

    image.style.cssText = (
      'width:0;' +
      'height:0;' +
      `margin-left:${viewerData.width / 2}px;` +
      `margin-top:${viewerData.height / 2}px;` +
      'max-width:none!important;' +
      'visibility:visible;'
    );

    self.initImage(() => {
      $.toggleClass(image, 'viewer-transition', options.transition);
      $.toggleClass(image, 'viewer-move', options.movable);

      self.renderImage(() => {
        self.viewed = true;
        $.dispatchEvent(self.element, 'viewed', {
          originalImage: self.images[index],
          index,
          image,
        });
      });
    });
  },

  loadImage(event) {
    const e = $.getEvent(event);
    const image = e.target;
    const parent = image.parentNode;
    const parentWidth = parent.offsetWidth || 30;
    const parentHeight = parent.offsetHeight || 50;
    const filled = !!$.getData(image, 'filled');

    $.getImageSize(image, (naturalWidth, naturalHeight) => {
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

      $.setStyle(image, {
        width,
        height,
        marginLeft: (parentWidth - width) / 2,
        marginTop: (parentHeight - height) / 2
      });
    });
  },

  resize() {
    const self = this;

    self.initContainer();
    self.initViewer();
    self.renderViewer();
    self.renderList();

    if (self.viewed) {
      self.initImage(() => {
        self.renderImage();
      });
    }

    if (self.played) {
      $.each($.getByTag(self.player, 'img'), (image) => {
        $.addListener(image, 'load', $.proxy(self.loadImage, self), true);
        $.dispatchEvent(image, 'load');
      });
    }
  },

  wheel(event) {
    const self = this;
    const e = $.getEvent(event);

    if (!self.viewed) {
      return;
    }

    e.preventDefault();

    // Limit wheel speed to prevent zoom too fast
    if (self.wheeling) {
      return;
    }

    self.wheeling = true;

    setTimeout(() => {
      self.wheeling = false;
    }, 50);

    const ratio = Number(self.options.zoomRatio) || 0.1;
    let delta = 1;

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    self.zoom(-delta * ratio, true, e);
  },

  keydown(event) {
    const self = this;
    const e = $.getEvent(event);
    const options = self.options;
    const key = e.keyCode || e.which || e.charCode;

    if (!self.fulled || !options.keyboard) {
      return;
    }

    switch (key) {

      // (Key: Esc)
      case 27:
        if (self.played) {
          self.stop();
        } else if (options.inline) {
          if (self.fulled) {
            self.exit();
          }
        } else {
          self.hide();
        }

        break;

      // (Key: Space)
      case 32:
        if (self.played) {
          self.stop();
        }

        break;

      // View previous (Key: ←)
      case 37:
        self.prev();
        break;

      // Zoom in (Key: ↑)
      case 38:

        // Prevent scroll on Firefox
        e.preventDefault();

        self.zoom(options.zoomRatio, true);
        break;

      // View next (Key: →)
      case 39:
        self.next();
        break;

      // Zoom out (Key: ↓)
      case 40:

        // Prevent scroll on Firefox
        e.preventDefault();

        self.zoom(-options.zoomRatio, true);
        break;

      // Zoom out to initial size (Key: Ctrl + 0)
      case 48:
        // Fall through

      // Zoom in to natural size (Key: Ctrl + 1)
      // eslint-disable-next-line
      case 49:
        if (e.ctrlKey || e.shiftKey) {
          e.preventDefault();
          self.toggle();
        }

        break;

      // No default
    }
  },

  dragstart(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
      e.preventDefault();
    }
  },

  pointerdown(event) {
    const self = this;
    const options = self.options;
    const pointers = self.pointers;
    const e = $.getEvent(event);

    if (!self.viewed) {
      return;
    }

    if (e.changedTouches) {
      $.each(e.changedTouches, (touch) => {
        pointers[touch.identifier] = $.getPointer(touch);
      });
    } else {
      pointers[e.pointerId || 0] = $.getPointer(e);
    }

    let action = options.movable ? 'move' : false;

    if (Object.keys(pointers).length > 1) {
      action = 'zoom';
    } else if ((e.pointerType === 'touch' || e.type === 'touchmove') && self.isSwitchable()) {
      action = 'switch';
    }

    self.action = action;
  },

  pointermove(event) {
    const self = this;
    const options = self.options;
    const pointers = self.pointers;
    const e = $.getEvent(event);
    const action = self.action;
    const image = self.image;

    if (!self.viewed || !action) {
      return;
    }

    e.preventDefault();

    if (e.changedTouches) {
      $.each(e.changedTouches, (touch) => {
        $.extend(pointers[touch.identifier], $.getPointer(touch, true));
      });
    } else {
      $.extend(pointers[e.pointerId || 0], $.getPointer(e, true));
    }

    if (action === 'move' && options.transition && $.hasClass(image, 'viewer-transition')) {
      $.removeClass(image, 'viewer-transition');
    }

    self.change(e);
  },

  pointerup(event) {
    const self = this;
    const pointers = self.pointers;
    const e = $.getEvent(event);
    const action = self.action;

    if (!self.viewed) {
      return;
    }

    if (e.changedTouches) {
      $.each(e.changedTouches, (touch) => {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[e.pointerId || 0];
    }

    if (!action) {
      return;
    }

    if (action === 'move' && self.options.transition) {
      $.addClass(self.image, 'viewer-transition');
    }

    self.action = false;
  },
};
