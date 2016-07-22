QUnit.test('methods#destroy', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    ready: function () {
      assert.ok(typeof this.viewer === 'object');

      this.viewer.destroy();

      assert.ok(typeof this.viewer === 'undefined');

      done();
    }
  });
});
