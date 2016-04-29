QUnit.test('methods#rotateTo', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(4);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      assert.deepEqual(imageData.rotate, 0);

      viewer.rotateTo(360);
      assert.deepEqual(imageData.rotate, 360);

      viewer.rotateTo(-180);
      assert.deepEqual(imageData.rotate, -180);

      viewer.rotateTo(0);
      assert.deepEqual(imageData.rotate, 0);

      done();
    }
  });
});
