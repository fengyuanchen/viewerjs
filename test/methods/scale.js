QUnit.test('methods#scale', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(6);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      assert.deepEqual(imageData.scaleX, 1);
      assert.deepEqual(imageData.scaleY, 1);

      viewer.scale(-1);
      assert.deepEqual(imageData.scaleX, -1);
      assert.deepEqual(imageData.scaleY, -1);

      viewer.scale(1, -1);
      assert.deepEqual(imageData.scaleX, 1);
      assert.deepEqual(imageData.scaleY, -1);

      done();
    }
  });
});
