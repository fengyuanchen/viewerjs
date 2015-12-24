  var _Viewer = window.Viewer;

  Viewer.noConflict = function () {
    window.Viewer = _Viewer;
    return Viewer;
  };

  Viewer.setDefaults = function (options) {
    extend(Viewer.DEFAULTS, options);
  };
