QUnit.test('options#scalable', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.scale(-1, -1);
      assert.deepEqual(imageData.scaleX, -1);
      assert.deepEqual(imageData.scaleY, -1);

      done();
    }
  });
});

QUnit.test('options#scalable: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    scalable: false,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.scale(-1, -1);
      assert.notDeepEqual(imageData.scaleX, -1);
      assert.notDeepEqual(imageData.scaleY, -1);

      done();
    }
  });
});
