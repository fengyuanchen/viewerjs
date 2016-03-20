  function typeOf(obj) {
    return toString.call(obj).slice(8, -1).toLowerCase();
  }

  function isString(str) {
    return typeof str === 'string';
  }

  function isNumber(num) {
    return typeof num === 'number' && !isNaN(num);
  }

  function isUndefined(obj) {
    return typeof obj === 'undefined';
  }

  function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  function isPlainObject(obj) {
    var constructor;
    var prototype;

    if (!isObject(obj)) {
      return false;
    }

    try {
      constructor = obj.constructor;
      prototype = constructor.prototype;

      return constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (e) {
      return false;
    }
  }

  function isFunction(fn) {
    return typeOf(fn) === 'function';
  }

  function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
  }

  function toArray(obj, offset) {
    offset = offset >= 0 ? offset : 0;

    if (Array.from) {
      return Array.from(obj).slice(offset);
    }

    return slice.call(obj, offset);
  }

  function inArray(value, arr) {
    var index = -1;

    if (arr.indexOf) {
      return arr.indexOf(value);
    } else {
      each(arr, function (n, i) {
        if (n === value) {
          index = i;
          return false;
        }
      });
    }

    return index;
  }

  function trim(str) {
    if (isString(str)) {
      str = str.trim ? str.trim() : str.replace(REGEXP_TRIM, '1');
    }

    return str;
  }

  function each(obj, callback) {
    var length;
    var i;

    if (obj && isFunction(callback)) {
      if (isArray(obj) || isNumber(obj.length)/* array-like */) {
        for (i = 0, length = obj.length; i < length; i++) {
          if (callback.call(obj, obj[i], i, obj) === false) {
            break;
          }
        }
      } else if (isObject(obj)) {
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (callback.call(obj, obj[i], i, obj) === false) {
              break;
            }
          }
        }
      }
    }

    return obj;
  }

  function extend(obj) {
    var args;

    if (arguments.length > 1) {
      args = toArray(arguments);

      if (Object.assign) {
        return Object.assign.apply(Object, args);
      }

      args.shift();

      each(args, function (arg) {
        each(arg, function (prop, i) {
          obj[i] = prop;
        });
      });
    }

    return obj;
  }

  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function setStyle(element, styles) {
    var style = element.style;

    each(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value += 'px';
      }

      style[property] = value;
    });
  }

  function getStyle(element) {
    return window.getComputedStyle ?
      window.getComputedStyle(element, null) :
      element.currentStyle;
  }

  function hasClass(element, value) {
    return element.classList ?
      element.classList.contains(value) :
      element.className.indexOf(value) > -1;
  }

  function addClass(element, value) {
    var className;

    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      return each(element, function (elem) {
        addClass(elem, value);
      });
    }

    if (element.classList) {
      return element.classList.add(value);
    }

    className = trim(element.className);

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = className + ' ' + value;
    }
  }

  function removeClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      return each(element, function (elem) {
        removeClass(elem, value);
      });
    }

    if (element.classList) {
      return element.classList.remove(value);
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }

  function toggleClass(element, value, added) {
    if (isNumber(element.length)) {
      return each(element, function (elem) {
        toggleClass(elem, value, added);
      });
    }

    // IE10-11 doesn't support the second parameter of `classList.toggle`
    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }

  function getData(element, name) {
    return isObject(element[name]) ?
      element[name] :
      element.dataset ?
        element.dataset[name] :
        element.getAttribute('data-' + name);
  }

  function setData(element, name, data) {
    if (isObject(data) && isUndefined(element[name])) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute('data-' + name, data);
    }
  }

  function removeData(element, name) {
    if (isObject(element[name])) {
      delete element[name];
    } else if (element.dataset) {
      delete element.dataset[name];
    } else {
      element.removeAttribute('data-' + name);
    }
  }

  function addListener(element, type, handler, once) {
    var types = trim(type).split(REGEXP_SPACES);
    var originalHandler = handler;

    if (types.length > 1) {
      return each(types, function (type) {
        addListener(element, type, handler);
      });
    }

    if (once) {
      handler = function () {
        removeListener(element, type, handler);

        return originalHandler.apply(element, arguments);
      };
    }

    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    }
  }

  function removeListener(element, type, handler) {
    var types = trim(type).split(REGEXP_SPACES);

    if (types.length > 1) {
      return each(types, function (type) {
        removeListener(element, type, handler);
      });
    }

    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    }
  }

  function dispatchEvent(element, type, data) {
    var event;

    if (element.dispatchEvent) {

      // Event and CustomEvent on IE9-11 are global objects, not constructors
      if (isFunction(Event) && isFunction(CustomEvent)) {
        if (isUndefined(data)) {
          event = new Event(type, {
            bubbles: true,
            cancelable: true
          });
        } else {
          event = new CustomEvent(type, {
            detail: data,
            bubbles: true,
            cancelable: true
          });
        }
      } else {
        // IE9-11
        if (isUndefined(data)) {
          event = document.createEvent('Event');
          event.initEvent(type, true, true);
        } else {
          event = document.createEvent('CustomEvent');
          event.initCustomEvent(type, true, true, data);
        }
      }

      // IE9+
      return element.dispatchEvent(event);
    } else if (element.fireEvent) {

      // IE6-10 (native events only)
      return element.fireEvent('on' + type);
    }
  }

  function preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  function getEvent(event) {
    var e = event || window.event;
    var doc;

    // Fix target property (IE8)
    if (!e.target) {
      e.target = e.srcElement || document;
    }

    if (!isNumber(e.pageX)) {
      doc = document.documentElement;
      e.pageX = e.clientX + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0);
      e.pageY = e.clientY + (window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0);
    }

    return e;
  }

  function getOffset(element) {
    var doc = document.documentElement;
    var box = element.getBoundingClientRect();

    return {
      left: box.left + (window.scrollX || doc && doc.scrollLeft || 0) - (doc && doc.clientLeft || 0),
      top: box.top + (window.scrollY || doc && doc.scrollTop || 0) - (doc && doc.clientTop || 0)
    };
  }

  function getTouchesCenter(touches) {
    var length = touches.length;
    var pageX = 0;
    var pageY = 0;

    if (length) {
      each(touches, function (touch) {
        pageX += touch.pageX;
        pageY += touch.pageY;
      });

      pageX /= length;
      pageY /= length;
    }

    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  function getByTag(element, tagName) {
    return element.getElementsByTagName(tagName);
  }

  function getByClass(element, className) {
    return element.getElementsByClassName ?
      element.getElementsByClassName(className) :
      element.querySelectorAll('.' + className);
  }

  function appendChild(element, elem) {
    if (elem.length) {
      return each(elem, function (el) {
        appendChild(element, el);
      });
    }

    element.appendChild(elem);
  }

  function removeChild(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function setText(element, text) {
    if (!isUndefined(element.textContent)) {
      element.textContent = text;
    } else {
      element.innerText = text;
    }
  }

  // Force reflow to enable CSS3 transition
  function forceReflow(element) {
    return element.offsetWidth;
  }

  // e.g.: http://domain.com/path/to/picture.jpg?size=1280×960 -> picture.jpg
  function getImageName(url) {
    return isString(url) ? url.replace(/^.*\//, '').replace(/[\?&#].*$/, '') : '';
  }

  function getImageSize(image, callback) {
    var newImage;

    // Modern browsers
    if (image.naturalWidth) {
      return callback(image.naturalWidth, image.naturalHeight);
    }

    // IE8: Don't use `new Image()` here
    newImage = document.createElement('img');

    newImage.onload = function () {
      callback(this.width, this.height);
    };

    newImage.src = image.src;
  }

  function getTransform(data) {
    var transforms = [];
    var rotate = data.rotate;
    var scaleX = data.scaleX;
    var scaleY = data.scaleY;

    if (isNumber(rotate)) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (isNumber(scaleX) && isNumber(scaleY)) {
      transforms.push('scale(' + scaleX + ',' + scaleY + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  }

  function getResponsiveClass(option) {
    switch (option) {
      case 2:
        return CLASS_HIDE_XS_DOWN;

      case 3:
        return CLASS_HIDE_SM_DOWN;

      case 4:
        return CLASS_HIDE_MD_DOWN;
    }
  }
