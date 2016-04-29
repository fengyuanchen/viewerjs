QUnit.test('options#maxZoomRatio', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var maxZoomRatio = 10;

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    maxZoomRatio: maxZoomRatio,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.zoomTo(1);
      assert.deepEqual(imageData.ratio, 1);

      viewer.zoomTo(100);
      assert.deepEqual(imageData.ratio, maxZoomRatio);

      done();
    }
  });
});
