QUnit.test('methods#moveTo', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(4);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.moveTo(0, 0);
      assert.deepEqual(imageData.left, 0);
      assert.deepEqual(imageData.top, 0);

      viewer.moveTo(-10, -10);
      assert.deepEqual(imageData.left, -10);
      assert.deepEqual(imageData.top, -10);

      done();
    }
  });
});
