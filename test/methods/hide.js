QUnit.test('methods.hide', function (assert) {
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

    shown: function () {
      this.viewer.hide();
    },

    hide: function () {
      assert.ok(this.viewer.isShown);
    },

    hidden: function () {
      assert.notOk(this.viewer.isShown);

      done();
    }
  });
});
