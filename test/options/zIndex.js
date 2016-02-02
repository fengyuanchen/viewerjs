QUnit.test('options.zIndex', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var zIndex = 2016;

  assert.expect(1);

  return new Viewer(image, {
    zIndex: zIndex,

    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    },

    shown: function () {
      var viewer = this.viewer;

      assert.deepEqual(parseInt(viewer.viewer.style.zIndex, 10), zIndex);

      done();

      viewer.hide();
    }
  });
});
