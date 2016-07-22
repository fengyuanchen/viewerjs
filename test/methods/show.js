QUnit.test('methods#show', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  var viewer = new Viewer(image, {
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

  util.dispatchEvent(image, 'click');
});
