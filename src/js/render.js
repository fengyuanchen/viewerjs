import {
  CLASS_LOADING,
  CLASS_TRANSITION,
  EVENT_LOAD,
  EVENT_TRANSITION_END,
  EVENT_VIEWED,
} from './constants';
import {
  addClass,
  addListener,
  assign,
  createImageNode,
  drawCanvas,
  forEach,
  getHiddenData,
  getImageNameFromURL,
  getImageNaturalSizes,
  getTransforms,
  isCanvas,
  isFunction,
  isString,
  removeClass,
  removeListener,
  setData,
  setStyle,
} from './utilities';

export default {
  render() {
    this.initContainer();
    this.initViewer();
    this.initList();
    this.renderViewer();
  },

  initContainer() {
    this.containerData = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  initViewer() {
    const { options, parent } = this;
    let viewerData;

    if (options.inline) {
      viewerData = {
        width: Math.max(parent.offsetWidth, options.minWidth),
        height: Math.max(parent.offsetHeight, options.minHeight),
      };

      this.parentData = viewerData;
    }

    if (this.fulled || !viewerData) {
      viewerData = this.containerData;
    }

    this.viewerData = assign({}, viewerData);
  },

  renderViewer() {
    if (this.options.inline && !this.fulled) {
      setStyle(this.viewer, this.viewerData);
    }
  },

  initList() {
    const { element, options, list } = this;
    const items = [];

    // initList may be called in this.update, so should keep idempotent
    list.innerHTML = '';

    forEach(this.images, (image, index) => {
      const src = image.src || getHiddenData(image, 'src');
      const alt = image.alt || getHiddenData(image, 'alt') || getImageNameFromURL(src);
      const urlKey = options.url;
      let url;

      if (isString(urlKey)) {
        url = image.getAttribute(urlKey) || getHiddenData(image, urlKey);
      } else if (isFunction(url)) {
        url = url.call(this, image);
      }

      if (src || url) {
        const item = document.createElement('li');
        const node = createImageNode(image.tagName, item, src || url, alt, url || src, urlKey);

        node.setAttribute('role', 'button');
        node.setAttribute('data-index', index);
        node.setAttribute('data-viewer-action', 'view');

        item.appendChild(node);
        list.appendChild(item);
        items.push(item);
      }
    });

    this.items = items;

    forEach(items, (item) => {
      const image = item.firstElementChild;

      setData(image, 'filled', true);

      if (options.loading) {
        addClass(item, CLASS_LOADING);
      }

      addListener(image, EVENT_LOAD, (event) => {
        if (options.loading) {
          removeClass(item, CLASS_LOADING);
        }

        this.loadImage(event);
      }, {
        once: true,
      });

      if (isCanvas(image)) {
        drawCanvas(image, getHiddenData(image, 'src'), item, (canvas) => {
          if (options.loading) {
            removeClass(item, CLASS_LOADING);
          }
          this.loadCanvas(canvas);
        });
      }
    });

    if (options.transition) {
      addListener(element, EVENT_VIEWED, () => {
        addClass(list, CLASS_TRANSITION);
      }, {
        once: true,
      });
    }
  },

  renderList(index) {
    const i = index || this.index;
    const item = this.items[i];
    const width = item.offsetWidth || 30;
    const outerWidth = width + 1; // 1 pixel of `margin-left` width

    // Place the active item in the center of the screen
    setStyle(this.list, assign({
      width: outerWidth * this.length,
    }, getTransforms({
      translateX: ((this.viewerData.width - width) / 2) - (outerWidth * i),
    })));
  },

  resetList() {
    const { list } = this;

    list.innerHTML = '';
    removeClass(list, CLASS_TRANSITION);
    setStyle(list, getTransforms({
      translateX: 0,
    }));
  },

  initImage(done) {
    const { options, image, viewerData } = this;
    const footerHeight = this.footer.offsetHeight;
    const viewerWidth = viewerData.width;
    const viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
    const oldImageData = this.imageData || {};
    let sizingImage;

    this.imageInitializing = {
      abort() {
        sizingImage.onload = null;
      },
    };

    sizingImage = getImageNaturalSizes(image, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let width = viewerWidth;
      let height = viewerHeight;

      this.imageInitializing = false;

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
      const initialImageData = assign({}, imageData);

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

      this.imageData = imageData;
      this.initialImageData = initialImageData;

      if (done) {
        done();
      }
    });
  },

  renderImage(done) {
    const { image, imageData } = this;

    setStyle(image, assign({
      width: imageData.width,
      height: imageData.height,

      // XXX: Not to use translateX/Y to avoid image shaking when zooming
      marginLeft: imageData.left,
      marginTop: imageData.top,
    }, getTransforms(imageData)));

    if (done) {
      if ((this.viewing || this.zooming) && this.options.transition) {
        const onTransitionEnd = () => {
          this.imageRendering = false;
          done();
        };

        this.imageRendering = {
          abort() {
            removeListener(image, EVENT_TRANSITION_END, onTransitionEnd);
          },
        };

        addListener(image, EVENT_TRANSITION_END, onTransitionEnd, {
          once: true,
        });
      } else {
        done();
      }
    }
  },

  resetImage() {
    // this.image only defined after viewed
    if (this.viewing || this.viewed) {
      const { image } = this;

      if (this.viewing) {
        this.viewing.abort();
      }

      image.parentNode.removeChild(image);
      this.image = null;
    }
  },
};
