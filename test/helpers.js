window.createContainer = () => {
  const container = document.createElement('div');

  container.className = 'container';
  document.body.appendChild(container);

  return container;
};

window.createImage = () => {
  const container = window.createContainer();
  const image = document.createElement('img');

  image.src = '/base/docs/images/tibet-1.jpg';
  container.appendChild(image);

  return image;
};

window.createImageList = () => {
  const container = window.createContainer();
  const list = document.createElement('ul');

  list.innerHTML = (
    '<li><img src="/base/docs/images/tibet-1.jpg"></li>'
    + '<li><img src="/base/docs/images/tibet-2.jpg"></li>'
    + '<li><img src="/base/docs/images/tibet-3.jpg"></li>'
    + '<li><img src="/base/docs/images/tibet-4.jpg"></li>'
    + '<li><img src="/base/docs/images/tibet-5.jpg"></li>'
  );
  container.appendChild(list);

  return list;
};

window.createEvent = (type, data = {}) => {
  const { detail } = data;
  let event;

  if (typeof Event === 'function' && typeof CustomEvent === 'function') {
    if (typeof detail === 'undefined') {
      event = new Event(type, {
        bubbles: true,
        cancelable: true,
      });
    } else {
      event = new CustomEvent(type, {
        detail,
        bubbles: true,
        cancelable: true,
      });
    }
  } else if (typeof detail === 'undefined') {
    event = document.createEvent('Event');
    event.initEvent(type, true, true);
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, true, true, detail);
  }

  Object.keys(data).forEach((key) => {
    if (key !== 'detail') {
      event[key] = data[key];
    }
  });

  return event;
};
