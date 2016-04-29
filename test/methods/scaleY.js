QUnit.test('methods#scaleY', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(3);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      assert.deepEqual(imageData.scaleY, 1);

      viewer.scaleY(-1);
      assert.deepEqual(imageData.scaleY, -1);

      viewer.scaleY(1);
      assert.deepEqual(imageData.scaleY, 1);

      done();
    }
  });
});
