import * as $ from './utilities';

export default {
  open() {
    const body = this.body;

    $.addClass(body, 'viewer-open');
    body.style.paddingRight = `${this.scrollbarWidth}px`;
  },

  close() {
    const body = this.body;

    $.removeClass(body, 'viewer-open');
    body.style.paddingRight = 0;
  },

  shown() {
    const self = this;
    const options = self.options;
    const element = self.element;

    self.transitioning = false;
    self.fulled = true;
    self.visible = true;
    self.render();
    self.bind();

    if ($.isFunction(options.shown)) {
      $.addListener(element, 'shown', options.shown, true);
    }

    $.dispatchEvent(element, 'shown');
  },

  hidden() {
    const self = this;
    const options = self.options;
    const element = self.element;

    self.transitioning = false;
    self.viewed = false;
    self.fulled = false;
    self.visible = false;
    self.unbind();
    self.close();
    $.addClass(self.viewer, 'viewer-hide');
    self.resetList();
    self.resetImage();

    if ($.isFunction(options.hidden)) {
      $.addListener(element, 'hidden', options.hidden, true);
    }

    $.dispatchEvent(element, 'hidden');
  },

  requestFullscreen() {
    const self = this;
    const documentElement = document.documentElement;

    if (self.fulled && !document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
      } else if (documentElement.msRequestFullscreen) {
        documentElement.msRequestFullscreen();
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.webkitRequestFullscreen) {
        documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
  },

  exitFullscreen() {
    const self = this;

    if (self.fulled) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  },

  change(e) {
    const self = this;
    const pointers = self.pointers;
    const pointer = pointers[Object.keys(pointers)[0]];
    const offsetX = pointer.endX - pointer.startX;
    const offsetY = pointer.endY - pointer.startY;

    switch (self.action) {

      // Move the current image
      case 'move':
        self.move(offsetX, offsetY);
        break;

      // Zoom the current image
      case 'zoom':
        self.zoom($.getMaxZoomRatio(pointers), false, e);
        break;

      case 'switch':
        self.action = 'switched';

        if (Math.abs(offsetX) > Math.abs(offsetY)) {
          if (offsetX > 1) {
            self.prev();
          } else if (offsetX < -1) {
            self.next();
          }
        }

        break;

      // No default
    }

    // Override
    $.each(pointers, (p) => {
      p.startX = p.endX;
      p.startY = p.endY;
    });
  },

  isSwitchable() {
    const self = this;
    const imageData = self.imageData;
    const viewerData = self.viewerData;

    return self.length > 1 && imageData.left >= 0 && imageData.top >= 0 &&
      imageData.width <= viewerData.width &&
      imageData.height <= viewerData.height;
  }
};
