import {
  CLASS_ACTIVE,
  CLASS_LOADING,
  CLASS_TRANSITION,
  EVENT_ERROR,
  EVENT_LOAD,
  EVENT_TRANSITION_END,
  EVENT_VIEWED,
} from './constants';
import {
  addClass,
  addListener,
  assign,
  forEach,
  getData,
  getImageNameFromURL,
  getImageNaturalSizes,
  getTransforms,
  hasClass,
  inheritAttributes,
  isNumber,
  isPlainObject,
  isTransitionEnabled,
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

  initBody() {
    const { ownerDocument } = this;
    const body = ownerDocument.body || ownerDocument.documentElement;

    this.body = body;
    this.scrollbarWidth = window.innerWidth - ownerDocument.documentElement.clientWidth;
    this.initialBodyPaddingRight = body.style.paddingRight;
    this.initialBodyComputedPaddingRight = window.getComputedStyle(body).paddingRight;
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

  initList(viewIndex = this.index) {
    const { element, options, list } = this;
    const items = [];
    const navbarOptions = isPlainObject(options.navbar) ? options.navbar : {};
    const probe = document.createElement('li');

    list.appendChild(probe);
    const itemWidth = probe.offsetWidth + parseInt(window.getComputedStyle(probe).marginLeft, 10);

    list.removeChild(probe);

    let visibleItemCount = isNumber(navbarOptions.visibleItemCount)
      ? Math.floor(navbarOptions.visibleItemCount)
      : Math.floor(this.containerData.width / itemWidth);

    visibleItemCount = Math.min(visibleItemCount, this.length);

    const start = visibleItemCount > 0
      ? Math.min(
        Math.max(0, viewIndex - Math.floor(visibleItemCount / 2)),
        Math.max(0, this.length - visibleItemCount),
      )
      : 0;
    const end = visibleItemCount > 0
      ? Math.min(this.length, start + visibleItemCount)
      : this.length;

    // initList may be called in this.update, so should keep idempotent
    list.innerHTML = '';

    forEach(this.images, (image, index) => {
      if (visibleItemCount > 0 && (index < start || index >= end)) {
        return;
      }

      const { src } = image;
      const alt = image.alt || getImageNameFromURL(src);
      const url = this.getImageURL(image);

      if (src || url) {
        const item = document.createElement('li');
        const img = document.createElement('img');

        inheritAttributes(img, image, options.inheritedAttributes);

        if (options.navbar) {
          img.src = src || url;
        }

        img.alt = alt;
        img.setAttribute('data-original-url', url || src);
        item.setAttribute('data-index', index);
        item.setAttribute('data-viewer-action', 'view');
        item.setAttribute('role', 'button');

        if (options.keyboard) {
          item.setAttribute('tabindex', 0);
        }

        item.appendChild(img);
        list.appendChild(item);
        items.push(item);
      }
    });

    this.items = items;

    if (this.viewed) {
      const activeItem = this.getItem(this.index);

      if (activeItem) {
        addClass(activeItem, CLASS_ACTIVE);
        activeItem.setAttribute('aria-selected', true);
      }
    }

    forEach(items, (item) => {
      const image = item.firstElementChild;
      let onLoad;
      let onError;

      setData(image, 'filled', true);

      if (options.loading) {
        addClass(item, CLASS_LOADING);
      }

      addListener(image, EVENT_LOAD, onLoad = (event) => {
        removeListener(image, EVENT_ERROR, onError);

        if (options.loading) {
          removeClass(item, CLASS_LOADING);
        }

        this.loadImage(event);
      }, {
        once: true,
      });
      addListener(image, EVENT_ERROR, onError = () => {
        removeListener(image, EVENT_LOAD, onLoad);

        if (options.loading) {
          removeClass(item, CLASS_LOADING);
        }
      }, {
        once: true,
      });
    });

    if (isTransitionEnabled(options, 'view')) {
      addListener(element, EVENT_VIEWED, () => {
        addClass(list, CLASS_TRANSITION);
      }, {
        once: true,
      });
    }
  },

  getItem(index) {
    let item;

    forEach(this.items, (candidate) => {
      if (Number(getData(candidate, 'index')) === index) {
        item = candidate;
        return false;
      }

      return true;
    });

    return item;
  },

  renderList() {
    const { index } = this;
    const item = this.getItem(index);

    if (!item) {
      return;
    }

    const next = item.nextElementSibling;
    const gutter = parseInt(window.getComputedStyle(next || item).marginLeft, 10);
    const { offsetWidth } = item;
    const outerWidth = offsetWidth + gutter;

    // Place the active item in the center of the screen
    setStyle(this.list, assign({
      width: outerWidth * this.items.length - gutter,
    }, getTransforms({
      translateX: ((this.viewerData.width - offsetWidth) / 2) - item.offsetLeft,
    })));
  },

  resetList() {
    const { list } = this;

    list.innerHTML = '';
    removeClass(list, CLASS_TRANSITION);
    setStyle(list, assign({
      width: 0,
    }, getTransforms({
      translateX: 0,
    })));
  },

  initImage(done) {
    const { options, image, viewerData } = this;
    const footerHeight = this.footer.offsetHeight;
    const viewerWidth = viewerData.width;
    const viewerHeight = Math.max(viewerData.height - footerHeight, footerHeight);
    const oldImageData = this.imageData || {};
    let sizingImage;

    this.imageInitializing = {
      abort: () => {
        sizingImage.onload = null;
      },
    };

    sizingImage = getImageNaturalSizes(image, options, (naturalWidth, naturalHeight) => {
      const aspectRatio = naturalWidth / naturalHeight;
      let initialCoverage = Math.max(0, Math.min(1, options.initialCoverage));
      let width = viewerWidth;
      let height = viewerHeight;

      this.imageInitializing = false;

      if (viewerHeight * aspectRatio > viewerWidth) {
        height = viewerWidth / aspectRatio;
      } else {
        width = viewerHeight * aspectRatio;
      }

      initialCoverage = isNumber(initialCoverage) ? initialCoverage : 0.9;
      width = Math.min(width * initialCoverage, naturalWidth);
      height = Math.min(height * initialCoverage, naturalHeight);

      const left = (viewerWidth - width) / 2;
      const top = (viewerHeight - height) / 2;

      const imageData = {
        left,
        top,
        x: left,
        y: top,
        width,
        height,
        oldRatio: 1,
        ratio: width / naturalWidth,
        aspectRatio,
        naturalWidth,
        naturalHeight,
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
      marginLeft: imageData.x,
      marginTop: imageData.y,
    }, getTransforms(imageData)));

    if (this.magnifierPoint) {
      this.renderMagnifier();
    }

    if (done) {
      let action = false;

      if (this.viewing) {
        action = 'view';
      } else if (this.moving) {
        action = 'move';
      } else if (this.rotating) {
        action = 'rotate';
      } else if (this.scaling) {
        action = 'scale';
      } else if (this.zooming) {
        action = 'zoom';
      }

      if (action
        && isTransitionEnabled(this.options, action)
        && hasClass(image, CLASS_TRANSITION)) {
        const onTransitionEnd = () => {
          this.imageRendering = false;
          done();
        };

        this.imageRendering = {
          abort: () => {
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
    const { image } = this;

    if (image) {
      if (this.viewing) {
        this.viewing.abort();
      }

      image.parentNode.removeChild(image);
      this.image = null;
      this.title.innerHTML = '';
    }
  },
};
