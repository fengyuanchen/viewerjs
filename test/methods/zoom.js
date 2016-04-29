QUnit.test('methods#zoom', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;
      var initiallWidth = imageData.width;

      viewer.zoom(0.1);
      assert.ok(imageData.width > initiallWidth);

      viewer.zoom(-0.2);
      assert.ok(imageData.width < initiallWidth);

      done();
    }
  });
});
