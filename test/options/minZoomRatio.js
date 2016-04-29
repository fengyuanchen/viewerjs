QUnit.test('options#minZoomRatio', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var minZoomRatio = 0.1;

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    minZoomRatio: minZoomRatio,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.zoomTo(1);
      assert.deepEqual(imageData.ratio, 1);

      viewer.zoomTo(0.01);
      assert.deepEqual(imageData.ratio, minZoomRatio);

      done();
    }
  });
});
