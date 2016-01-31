    build: function () {
      var _this = this;
      var options = _this.options;
      var element = _this.element;
      var template;
      var parent;
      var viewer;
      var button;
      var toolbar;
      var navbar;
      var title;
      var rotate;

      if (_this.isBuilt) {
        return;
      }

      template = document.createElement('div');
      template.innerHTML = Viewer.TEMPLATE;

      _this.parent = parent = element.parentNode;
      _this.viewer = viewer = getByClass(template, 'viewer-container')[0];
      _this.canvas = getByClass(viewer, 'viewer-canvas')[0];
      _this.footer = getByClass(viewer, 'viewer-footer')[0];
      _this.title = title = getByClass(viewer, 'viewer-title')[0];
      _this.toolbar = toolbar = getByClass(viewer, 'viewer-toolbar')[0];
      _this.navbar = navbar = getByClass(viewer, 'viewer-navbar')[0];
      _this.button = button = getByClass(viewer, 'viewer-button')[0];
      _this.tooltipBox = getByClass(viewer, 'viewer-tooltip')[0];
      _this.player = getByClass(viewer, 'viewer-player')[0];
      _this.list = getByClass(viewer, 'viewer-list')[0];

      addClass(title, !options.title ? CLASS_HIDE : getResponsiveClass(options.title));
      addClass(toolbar, !options.toolbar ? CLASS_HIDE : getResponsiveClass(options.toolbar));
      addClass(navbar, !options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));
      toggleClass(button, CLASS_HIDE, !options.button);

      toggleClass(toolbar.querySelectorAll('li[class*=zoom]'), CLASS_INVISIBLE, !options.zoomable);
      toggleClass(toolbar.querySelectorAll('li[class*=flip]'), CLASS_INVISIBLE, !options.scalable);

      if (!options.rotatable) {
        rotate = toolbar.querySelectorAll('li[class*=rotate]');
        addClass(rotate, CLASS_INVISIBLE);
        appendChild(toolbar, rotate);
      }

      if (options.inline) {
        addClass(button, CLASS_FULLSCREEN);
        setStyle(viewer, {
          zIndex: options.zIndexInline
        });

        if (getStyle(parent).position === 'static') {
          setStyle(parent, {
            position: 'relative'
          });
        }
      } else {
        addClass(button, CLASS_CLOSE);
        addClass(viewer, CLASS_FIXED);
        addClass(viewer, CLASS_FADE);
        addClass(viewer, CLASS_HIDE);

        setStyle(viewer, {
          zIndex: options.zIndex
        });
      }

      // Inserts the viewer after to the current element
      parent.insertBefore(viewer, element.nextSibling);

      if (options.inline) {
        _this.render();
        _this.bind();
        _this.isShown = true;
      }

      _this.isBuilt = true;

      if (isFunction(options.built)) {
        addListener(element, EVENT_BUILT, options.built, true);
      }

      dispatchEvent(element, EVENT_BUILT);
    },

    unbuild: function () {
      var _this = this;

      if (!_this.isBuilt) {
        return;
      }

      _this.isBuilt = false;
      removeChild(_this.viewer);
    },
