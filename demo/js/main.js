window.onload = function () {

  'use strict';

  var Viewer = window.Viewer;
  var console = window.console || { log: function () {} };
  var pictures = document.querySelector('.docs-pictures');
  var toggles = document.querySelector('.docs-toggles');
  var buttons = document.querySelector('.docs-buttons');
  var options = {
        // inline: true,
        url: 'data-original',
        zoomable: false,
        scalable: false,
        toolbarCustom: {
          override: true,
          buttons: [{
            clazz: 'fa fa-plus-circle',
            action: 'zoom-in'
          }, {
            clazz: 'fa fa-minus-circle',
            action: 'zoom-out'
          }, {
            clazz: 'fa fa-eye',
            action: 'one-to-one'
          }, {
            clazz: 'fa fa-undo',
            action: 'reset'
          }, {
            clazz: 'fa fa-angle-left',
            action: 'prev'
          }, {
            clazz: 'fa fa-play',
            action: 'play'
          }, {
            clazz: 'fa fa-angle-right',
            action: 'next'
          }, {
            clazz: 'fa fa-reply',
            action: 'rotate-left'
          }, {
            clazz: 'fa fa-mail-forward',
            action: 'rotate-right'
          }, {
            clazz: 'fa fa-arrows-h',
            action: 'flip-horizontal'
          }, {
            clazz: 'fa fa-arrows-v',
            action: 'flip-vertical'
          }]
        },
        build: function (e) {
          console.log(e.type);
        },
        built:  function (e) {
          console.log(e.type);
        },
        show:  function (e) {
          console.log(e.type);
        },
        shown:  function (e) {
          console.log(e.type);
        },
        hide:  function (e) {
          console.log(e.type);
        },
        hidden:  function (e) {
          console.log(e.type);
        },
        view:  function (e) {
          console.log(e.type, e.detail.index);
        },
        viewed:  function (e) {
          console.log(e.type, e.detail.index);
          // this.viewer.zoomTo(1).rotateTo(180);
        }
      };
  var viewer;

  function toggleButtons(mode) {
    var targets;
    var target;
    var length;
    var i;

    if (/modal|inline|none/.test(mode)) {
      targets = buttons.querySelectorAll('button[data-enable]');

      for (i = 0, length = targets.length; i < length; i++) {
        target = targets[i];
        target.disabled = true;

        if (String(target.getAttribute('data-enable')).indexOf(mode) > -1) {
          target.disabled = false;
        }
      }
    }
  }

  function addEventListener(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    }
  }

  addEventListener(pictures, 'build', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'built', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'show', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'shown', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'hide', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'hidden', function (e) {
    console.log(e.type);
  });
  addEventListener(pictures, 'view', function (e) {
    console.log(e.type, e.detail.index);
  });
  addEventListener(pictures, 'viewed', function (e) {
    console.log(e.type, e.detail.index);
  });
  viewer = new Viewer(pictures, options);

  toggleButtons(options.inline ? 'inline' : 'modal');

  toggles.onchange = function (event) {
    var e = event || window.event;
    var input = e.target || e.srcElement;
    var name;

    if (viewer) {
      name = input.getAttribute('name');
      options[name] = name === 'inline' ? JSON.parse(input.getAttribute('data-value')) : input.checked;
      if (name === 'customToolbar' && !input.checked) {
        delete options.toolbarCustom;
      }
      viewer.destroy();
      viewer = new Viewer(pictures, options);
      toggleButtons(options.inline ? 'inline' : 'modal');
    }
  };

  buttons.onclick = function (event) {
    var e = event || window.event;
    var button = e.target || e.srcElement;
    var method = button.getAttribute('data-method');
    var target = button.getAttribute('data-target');
    var args = JSON.parse(button.getAttribute('data-arguments')) || [];

    if (viewer && method) {
      if (target) {
        viewer[method](target.value);
      } else {
        viewer[method](args[0], args[1]);
      }

      switch (method) {
        case 'scaleX':
        case 'scaleY':
          args[0] = -args[0];
          break;

        case 'destroy':
          viewer = null;
          toggleButtons('none');
          break;
      }
    }
  };

};
