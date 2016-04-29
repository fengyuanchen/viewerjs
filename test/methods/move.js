QUnit.test('methods#move', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(4);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;
      var initiallLeft = imageData.left;
      var initiallTop = imageData.top;

      viewer.move(10, 10);
      assert.deepEqual(imageData.left, initiallLeft + 10);
      assert.deepEqual(imageData.top, initiallTop + 10);

      viewer.move(-10, -10);
      assert.deepEqual(imageData.left, initiallLeft);
      assert.deepEqual(imageData.top, initiallTop);

      done();
    }
  });
});
