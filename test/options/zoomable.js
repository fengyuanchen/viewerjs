QUnit.test('options#zoomable', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.zoomTo(1);
      assert.deepEqual(viewer.imageData.ratio, 1);

      done();
    }
  });
});

QUnit.test('options#zoomable: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    zoomable: false,

    viewed: function () {
      var viewer = this.viewer;

      viewer.zoomTo(1);
      assert.notDeepEqual(viewer.imageData.ratio, 1);

      done();
    }
  });
});
