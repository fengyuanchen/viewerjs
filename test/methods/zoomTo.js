QUnit.test('methods#zoomTo', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;
      var initiallRatio = imageData.ratio;

      viewer.zoomTo(1);
      assert.deepEqual(imageData.ratio, 1);

      viewer.zoomTo(initiallRatio);
      assert.deepEqual(imageData.ratio, initiallRatio);

      done();
    }
  });
});
