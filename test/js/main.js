window.Util = {
  hasClass: function (element, className) {
    return element.classList.contains(className);
  },
  getByClass: function (element, className) {
    return element.getElementsByClassName ?
      element.getElementsByClassName(className) :
      element.querySelectorAll('.' + className);
  },
  createImage: function () {
    var container = document.createElement('div');
    var image = document.createElement('img');

    image.src = '../docs/images/tibet-1.jpg';
    container.className = 'container';
    container.appendChild(image);
    document.body.appendChild(container);

    return image;
  },
  createImageList: function () {
    var container = document.createElement('div');
    var list = document.createElement('ul');

    container.className = 'container';
    list.innerHTML = (
      '<li><img src="../docs/images/tibet-1.jpg"></li>' +
      '<li><img src="../docs/images/tibet-2.jpg"></li>' +
      '<li><img src="../docs/images/tibet-3.jpg"></li>' +
      '<li><img src="../docs/images/tibet-4.jpg"></li>'
    );
    container.appendChild(list);
    document.body.appendChild(container);

    return list;
  },
  dispatchEvent: function (element, type) {
    var event;

    if (element.dispatchEvent) {
      // Event on IE is a global object, not a constructor
      if (typeof Event === 'function') {
        event = new Event(type, {
          bubbles: true,
          cancelable: true
        });
      } else {
        event = document.createEvent('Event');
        event.initEvent(type, true, true);
      }

      // IE9+
      return element.dispatchEvent(event);
    } else if (element.fireEvent) {
      // IE6-10
      return element.fireEvent('on' + type);
    }
  }
};
