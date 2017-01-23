// RegExps
const REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
const REGEXP_SPACES = /\s+/;
const REGEXP_SUFFIX = /^(width|height|left|top|marginLeft|marginTop)$/;
const REGEXP_TRIM = /^\s+(.*)\s+$/;

// Utilities
const objectProto = Object.prototype;
const toString = objectProto.toString;
const hasOwnProperty = objectProto.hasOwnProperty;
const slice = Array.prototype.slice;

export function typeOf(obj) {
  return toString.call(obj).slice(8, -1).toLowerCase();
}

export function isString(str) {
  return typeof str === 'string';
}

export function isNumber(num) {
  return typeof num === 'number' && !isNaN(num);
}

export function isUndefined(obj) {
  return typeof obj === 'undefined';
}

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export function isPlainObject(obj) {
  if (!isObject(obj)) {
    return false;
  }

  try {
    const constructor = obj.constructor;
    const prototype = constructor.prototype;

    return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
  } catch (e) {
    return false;
  }
}

export function isFunction(fn) {
  return typeOf(fn) === 'function';
}

export function isArray(arr) {
  return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
}

export function toArray(obj, offset) {
  offset = offset >= 0 ? offset : 0;

  if (Array.from) {
    return Array.from(obj).slice(offset);
  }

  return slice.call(obj, offset);
}

export function inArray(value, arr) {
  let index = -1;

  if (arr.indexOf) {
    return arr.indexOf(value);
  }

  arr.forEach((n, i) => {
    if (n === value) {
      index = i;
    }
  });

  return index;
}

export function trim(str) {
  if (isString(str)) {
    str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '1');
  }

  return str;
}

export function each(obj, callback) {
  if (obj && isFunction(callback)) {
    let i;

    if (isArray(obj) || isNumber(obj.length)/* array-like */) {
      const length = obj.length;

      for (i = 0; i < length; i++) {
        if (callback.call(obj, obj[i], i, obj) === false) {
          break;
        }
      }
    } else if (isObject(obj)) {
      Object.keys(obj).forEach((key) => {
        callback.call(obj, obj[key], key, obj);
      });
    }
  }

  return obj;
}

export function extend(obj, ...args) {
  if (isObject(obj) && args.length > 0) {
    if (Object.assign) {
      return Object.assign(obj, ...args);
    }

    args.forEach((arg) => {
      if (isObject(arg)) {
        Object.keys(arg).forEach((key) => {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
}

export function proxy(fn, context, ...args) {
  return (...args2) => {
    return fn.apply(context, args.concat(args2));
  };
}

export function setStyle(element, styles) {
  const style = element.style;

  each(styles, (value, property) => {
    if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
      value += 'px';
    }

    style[property] = value;
  });
}

export function getStyle(element) {
  return window.getComputedStyle ?
    window.getComputedStyle(element, null) :
    element.currentStyle;
}

export function hasClass(element, value) {
  return element.classList ?
    element.classList.contains(value) :
    element.className.indexOf(value) > -1;
}

export function addClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, (elem) => {
      addClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.add(value);
    return;
  }

  const className = trim(element.className);

  if (!className) {
    element.className = value;
  } else if (className.indexOf(value) < 0) {
    element.className = `${className} ${value}`;
  }
}

export function removeClass(element, value) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, (elem) => {
      removeClass(elem, value);
    });
    return;
  }

  if (element.classList) {
    element.classList.remove(value);
    return;
  }

  if (element.className.indexOf(value) >= 0) {
    element.className = element.className.replace(value, '');
  }
}

export function toggleClass(element, value, added) {
  if (!value) {
    return;
  }

  if (isNumber(element.length)) {
    each(element, (elem) => {
      toggleClass(elem, value, added);
    });
    return;
  }

  // IE10-11 doesn't support the second parameter of `classList.toggle`
  if (added) {
    addClass(element, value);
  } else {
    removeClass(element, value);
  }
}

export function hyphenate(str) {
  return str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
}

export function getData(element, name) {
  if (isObject(element[name])) {
    return element[name];
  } else if (element.dataset) {
    return element.dataset[name];
  }

  return element.getAttribute(`data-${hyphenate(name)}`);
}

export function setData(element, name, data) {
  if (isObject(data)) {
    element[name] = data;
  } else if (element.dataset) {
    element.dataset[name] = data;
  } else {
    element.setAttribute(`data-${hyphenate(name)}`, data);
  }
}

export function removeData(element, name) {
  if (isObject(element[name])) {
    delete element[name];
  } else if (element.dataset) {
    // #128 Safari not allows to delete dataset property
    try {
      delete element.dataset[name];
    } catch (e) {
      element.dataset[name] = null;
    }
  } else {
    element.removeAttribute(`data-${hyphenate(name)}`);
  }
}

export function removeListener(element, type, handler) {
  const types = trim(type).split(REGEXP_SPACES);

  if (types.length > 1) {
    each(types, (t) => {
      removeListener(element, t, handler);
    });
    return;
  }

  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent(`on${type}`, handler);
  }
}

export function addListener(element, type, handler, once) {
  const types = trim(type).split(REGEXP_SPACES);
  const originalHandler = handler;

  if (types.length > 1) {
    each(types, (t) => {
      addListener(element, t, handler);
    });
    return;
  }

  if (once) {
    handler = (...args) => {
      removeListener(element, type, handler);

      return originalHandler.apply(element, args);
    };
  }

  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent(`on${type}`, handler);
  }
}

export function dispatchEvent(element, type, data) {
  if (element.dispatchEvent) {
    let event;

    // Event and CustomEvent on IE9-11 are global objects, not constructors
    if (isFunction(Event) && isFunction(CustomEvent)) {
      if (isUndefined(data)) {
        event = new Event(type, {
          bubbles: true,
          cancelable: true,
        });
      } else {
        event = new CustomEvent(type, {
          detail: data,
          bubbles: true,
          cancelable: true,
        });
      }
    } else if (isUndefined(data)) {
      event = document.createEvent('Event');
      event.initEvent(type, true, true);
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    // IE9+
    return element.dispatchEvent(event);
  } else if (element.fireEvent) {
    // IE6-10 (native events only)
    return element.fireEvent(`on${type}`);
  }

  return true;
}

export function getEvent(event) {
  const e = event || window.event;

  // Fix target property (IE8)
  if (!e.target) {
    e.target = e.srcElement || document;
  }

  if (!isNumber(e.pageX) && isNumber(e.clientX)) {
    const eventDoc = event.target.ownerDocument || document;
    const doc = eventDoc.documentElement;
    const body = eventDoc.body;

    e.pageX = e.clientX + (
      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0)
    );
    e.pageY = e.clientY + (
      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      ((doc && doc.clientTop) || (body && body.clientTop) || 0)
    );
  }

  return e;
}

export function getOffset(element) {
  const doc = document.documentElement;
  const box = element.getBoundingClientRect();

  return {
    left: box.left + (
      (window.scrollX || (doc && doc.scrollLeft) || 0) - ((doc && doc.clientLeft) || 0)
    ),
    top: box.top + (
      (window.scrollY || (doc && doc.scrollTop) || 0) - ((doc && doc.clientTop) || 0)
    ),
  };
}

export function getByTag(element, tagName) {
  return element.getElementsByTagName(tagName);
}

export function getByClass(element, className) {
  return element.getElementsByClassName ?
    element.getElementsByClassName(className) :
    element.querySelectorAll(`.${className}`);
}

export function createElement(tagName) {
  return document.createElement(tagName);
}

export function appendChild(element, elem) {
  if (elem.length) {
    each(elem, (el) => {
      appendChild(element, el);
    });
    return;
  }

  element.appendChild(elem);
}

export function removeChild(element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function setText(element, text) {
  if (!isUndefined(element.textContent)) {
    element.textContent = text;
  } else {
    element.innerText = text;
  }
}

// Force reflow to enable CSS3 transition
export function forceReflow(element) {
  return element.offsetWidth;
}

// e.g.: http://domain.com/path/to/picture.jpg?size=1280×960 -> picture.jpg
export function getImageName(url) {
  return isString(url) ? url.replace(/^.*\//, '').replace(/[?&#].*$/, '') : '';
}

export function getImageSize(image, callback) {
  // Modern browsers
  if (image.naturalWidth) {
    callback(image.naturalWidth, image.naturalHeight);
    return;
  }

  const newImage = document.createElement('img');

  newImage.onload = function load() {
    callback(this.width, this.height);
  };

  newImage.src = image.src;
}

export function getTransform(data) {
  const transforms = [];
  const rotate = data.rotate;
  const scaleX = data.scaleX;
  const scaleY = data.scaleY;

  // Rotate should come first before scale to match orientation transform
  if (isNumber(rotate) && rotate !== 0) {
    transforms.push(`rotate(${rotate}deg)`);
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    transforms.push(`scaleX(${scaleX})`);
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    transforms.push(`scaleY(${scaleY})`);
  }

  return transforms.length ? transforms.join(' ') : 'none';
}

export function getResponsiveClass(option) {
  switch (option) {
    case 2:
      return 'viewer-hide-xs-down';

    case 3:
      return 'viewer-hide-sm-down';

    case 4:
      return 'viewer-hide-md-down';
  }

  return '';
}

export function getPointer(pointer, endOnly) {
  const end = {
    endX: pointer.pageX,
    endY: pointer.pageY
  };

  if (endOnly) {
    return end;
  }

  return extend({
    startX: pointer.pageX,
    startY: pointer.pageY
  }, end);
}

export function getMaxZoomRatio(pointers) {
  const pointers2 = extend({}, pointers);
  const ratios = [];

  each(pointers, (pointer, pointerId) => {
    delete pointers2[pointerId];

    each(pointers2, (pointer2) => {
      const x1 = Math.abs(pointer.startX - pointer2.startX);
      const y1 = Math.abs(pointer.startY - pointer2.startY);
      const x2 = Math.abs(pointer.endX - pointer2.endX);
      const y2 = Math.abs(pointer.endY - pointer2.endY);
      const z1 = Math.sqrt((x1 * x1) + (y1 * y1));
      const z2 = Math.sqrt((x2 * x2) + (y2 * y2));
      const ratio = (z2 - z1) / z1;

      ratios.push(ratio);
    });
  });

  ratios.sort((a, b) => {
    return Math.abs(a) < Math.abs(b);
  });

  return ratios[0];
}

export function getPointersCenter(pointers) {
  let pageX = 0;
  let pageY = 0;
  let count = 0;

  each(pointers, (pointer) => {
    pageX += pointer.startX;
    pageY += pointer.startY;
    count += 1;
  });

  pageX /= count;
  pageY /= count;

  return {
    pageX,
    pageY,
  };
}
