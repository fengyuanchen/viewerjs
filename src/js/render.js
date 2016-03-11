    render: function () {
      var _this = this;

      _this.initContainer();
      _this.initViewer();
      _this.initList();
      _this.renderViewer();
    },

    initContainer: function () {
      var _this = this;

      _this.containerData = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    },

    initViewer: function () {
      var _this = this;
      var options = _this.options;
      var parent = _this.parent;
      var viewerData;

      if (options.inline) {
        _this.parentData = viewerData = {
          width: max(parent.offsetWidth, options.minWidth),
          height: max(parent.offsetHeight, options.minHeight)
        };
      }

      if (_this.isFulled || !viewerData) {
        viewerData = _this.containerData;
      }

      _this.viewerData = extend({}, viewerData);
    },

    renderViewer: function () {
      var _this = this;

      if (_this.options.inline && !_this.isFulled) {
        setStyle(_this.viewer, _this.viewerData);
      }
    },

    initList: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var list = _this.list;
      var items = [];

      each(_this.images, function (image, i) {
        var src = image.src;
        var alt = image.alt || getImageName(src);
        var url = options.url;

        if (!src) {
          return;
        }

        if (isString(url)) {
          url = image.getAttribute(url);
        } else if (isFunction(url)) {
          url = url.call(image, image);
        }

        items.push(
          '<li>' +
            '<img' +
              ' src="' + src + '"' +
              ' data-action="view"' +
              ' data-index="' +  i + '"' +
              ' data-original-url="' +  (url || src) + '"' +
              ' alt="' +  alt + '"' +
            '>' +
          '</li>'
        );
      });

      list.innerHTML = items.join('');

      each(getByTag(list, 'img'), function (image) {
        setData(image, 'filled', true);
        addListener(image, EVENT_LOAD, proxy(_this.loadImage, _this), true);
      });

      _this.items = getByTag(list, 'li');

      if (options.transition) {
        addListener(element, EVENT_VIEWED, function () {
          addClass(list, CLASS_TRANSITION);
        }, true);
      }
    },

    renderList: function (index) {
      var _this = this;
      var i = index || _this.index;
      var width = _this.items[i].offsetWidth || 30;
      var outerWidth = width + 1; // 1 pixel of `margin-left` width

      // Place the active item in the center of the screen
      setStyle(_this.list, {
        width: outerWidth * _this.length,
        marginLeft: (_this.viewerData.width - width) / 2 - outerWidth * i
      });
    },

    resetList: function () {
      var _this = this;

      empty(_this.list);
      removeClass(_this.list, CLASS_TRANSITION);
      setStyle({
        marginLeft: 0
      });
    },

    initImage: function (callback) {
      var _this = this;
      var options = _this.options;
      var image = _this.image;
      var viewerData = _this.viewerData;
      var footerHeight = _this.footer.offsetHeight;
      var viewerWidth = viewerData.width;
      var viewerHeight = max(viewerData.height - footerHeight, footerHeight);
      var oldImageData = _this.imageData || {};

      getImageSize(image, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = viewerWidth;
        var height = viewerHeight;
        var initialImageData;
        var imageData;

        if (viewerHeight * aspectRatio > viewerWidth) {
          height = viewerWidth / aspectRatio;
        } else {
          width = viewerHeight * aspectRatio;
        }

        width = min(width * 0.9, naturalWidth);
        height = min(height * 0.9, naturalHeight);

        imageData = {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: aspectRatio,
          ratio: width / naturalWidth,
          width: width,
          height: height,
          left: (viewerWidth - width) / 2,
          top: (viewerHeight - height) / 2
        };

        initialImageData = extend({}, imageData);

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

        _this.imageData = imageData;
        _this.initialImageData = initialImageData;

        if (isFunction(callback)) {
          callback();
        }
      });
    },

    renderImage: function (callback) {
      var _this = this;
      var image = _this.image;
      var imageData = _this.imageData;
      var transform = getTransform(imageData);

      setStyle(image, {
        width: imageData.width,
        height: imageData.height,
        marginLeft: imageData.left,
        marginTop: imageData.top,
        WebkitTransform: transform,
        msTransform: transform,
        transform: transform
      });

      if (isFunction(callback)) {
        if (_this.transitioning) {
          addListener(image, EVENT_TRANSITIONEND, callback, true);
        } else {
          callback();
        }
      }
    },

    resetImage: function () {
      var _this = this;

      // this.image only defined after viewed
      if (_this.image) {
        removeChild(_this.image);
        _this.image = null;
      }
    },
