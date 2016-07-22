QUnit.test('options#rotatable', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.rotateTo(90);
      assert.deepEqual(viewer.imageData.rotate, 90);

      done();
    }
  });
});

QUnit.test('options#rotatable: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    rotatable: false,

    viewed: function () {
      var viewer = this.viewer;

      viewer.rotateTo(90);
      assert.notDeepEqual(viewer.imageData.rotate, 90);

      done();
    }
  });
});
