import * as $ from './utilities';

export default {
  render() {
    const self = this;

    self.initContainer();
    self.initViewer();
    self.initList();
    self.renderViewer();
  },

  initContainer() {
    const self = this;

    self.containerData = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  initViewer() {
    const self = this;
    const options = self.options;
    const parent = self.parent;
    let viewerData;

    if (options.inline) {
      self.parentData = viewerData = {
        width: Math.max(parent.offsetWidth, options.minWidth),
        height: Math.max(parent.offsetHeight, options.minHeight),
      };
    }

    if (self.fulled || !viewerData) {
      viewerData = self.containerData;
    }

    self.viewerData = $.extend({}, viewerData);
  },

  renderViewer() {
    const self = this;

    if (self.options.inline && !self.fulled) {
      $.setStyle(self.viewer, self.viewerData);
    }
  },

  initList() {
    const self = this;
    const options = self.options;
    const element = self.element;
    const list = self.list;
    const items = [];

    $.each(self.images, (image, i) => {
      const src = image.src;
      const alt = image.alt || $.getImageName(src);
      let url = options.url;

      if (!src) {
        return;
      }

      if ($.isString(url)) {
        url = image.getAttribute(url);
      } else if ($.isFunction(url)) {
        url = url.call(image, image);
      }

      items.push(
        '<li>' +
          '<img' +
            ` src="${src}"` +
            ' role="button"' +
            ' data-action="view"' +
            ` data-index="${i}"` +
            ` data-original-url="${(url || src)}"` +
            ` alt="${alt}"` +
          '>' +
        '</li>'
      );
    });

    list.innerHTML = items.join('');

    $.each($.getByTag(list, 'img'), (image) => {
      $.setData(image, 'filled', true);
      $.addListener(image, 'load', $.proxy(self.loadImage, self), true);
    });

    self.items = $.getByTag(list, 'li');

    if (options.transition) {
      $.addListener(element, 'viewed', () => {
        $.addClass(list, 'viewer-transition');
      }, true);
    }
  },

  renderList(index) {
    const self = this;
    const i = index || self.index;
    const width = self.items[i].offsetWidth || 30;
    const outerWidth = width + 1; // 1 pixel of `margin-left` width

    // Place the active item in the center of the screen
    $.setStyle(self.list, {
      width: outerWidth * self.length,
      marginLeft: ((self.viewerData.width - width) / 2) - (outerWidth * i)
    });
  },

  resetList() {
    const self = this;

    $.empty(self.list);
    $.removeClass(self.list, 'viewer-transition');
    $.setStyle({
      marginLeft: 0
    });
  },

  initImage(callback) {
    const self = this;
    const options = self.options;
    const image = self.image;
    const viewerData = self.viewerData;
    const footerHeight = self.footer.offsetHeight;
    const viewerWidth = viewerData.width;
    const viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
    const oldImageData = self.imageData || {};

    $.getImageSize(image, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = viewerWidth;
      let height = viewerHeight;

      if (viewerHeight * aspectRatio > viewerWidth) {
        height = viewerWidth / aspectRatio;
      } else {
        width = viewerHeight * aspectRatio;
      }

      width = Math.min(width * 0.9, naturalWidth);
      height = Math.min(height * 0.9, naturalHeight);

      const imageData = {
        naturalWidth,
        naturalHeight,
        aspectRatio,
        ratio: width / naturalWidth,
        width,
        height,
        left: (viewerWidth - width) / 2,
        top: (viewerHeight - height) / 2,
      };
      const initialImageData = $.extend({}, imageData);

      if (options.rotatable) {
        imageData.rotate = oldImageData.rotate || 0;
        initialImageData.rotate = 0;
      }

      if (options.scalable) {
        imageData.scaleX = oldImageData.scaleX || 1;
        imageData.scaleY = oldImageData.scaleY || 1;
        initialImageData.scaleX = 1;
        initialImageData.scaleY = 1;
      }

      self.imageData = imageData;
      self.initialImageData = initialImageData;

      if ($.isFunction(callback)) {
        callback();
      }
    });
  },

  renderImage(callback) {
    const self = this;
    const image = self.image;
    const imageData = self.imageData;
    const transform = $.getTransform(imageData);

    $.setStyle(image, {
      width: imageData.width,
      height: imageData.height,
      marginLeft: imageData.left,
      marginTop: imageData.top,
      WebkitTransform: transform,
      msTransform: transform,
      transform,
    });

    if ($.isFunction(callback)) {
      if (self.transitioning) {
        $.addListener(image, 'transitionend', callback, true);
      } else {
        callback();
      }
    }
  },

  resetImage() {
    const self = this;

    // this.image only defined after viewed
    if (self.image) {
      $.removeChild(self.image);
      self.image = null;
    }
  },
};
