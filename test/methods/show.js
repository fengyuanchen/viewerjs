QUnit.test('methods.show', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    },

    show: function () {
      assert.notOk(this.viewer.isShown);
    },

    shown: function () {
      var viewer = this.viewer;

      assert.ok(viewer.isShown);

      done();

      viewer.hide();
    }
  });
});
