QUnit.test('methods#reset', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.move(10, 10).reset();
      assert.deepEqual(viewer.imageData, viewer.initialImageData);

      done();
    }
  });
});
