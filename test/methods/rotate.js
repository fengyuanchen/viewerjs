QUnit.test('methods#rotate', function (assert) {
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

      viewer.rotate(90);
      assert.deepEqual(imageData.rotate, 90);

      viewer.rotate(90);
      assert.deepEqual(imageData.rotate, 180);

      viewer.rotate(-180);
      assert.deepEqual(imageData.rotate, 0);

      done();
    }
  });
});
