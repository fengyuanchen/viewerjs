  if (typeof define === 'function' && define.amd) {
    define('viewer', [], function () {
      return Viewer;
    });
  }

  if (!noGlobal) {
    window.Viewer = Viewer;
  }

  return Viewer;

});
