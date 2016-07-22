QUnit.test('options#movable', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.moveTo(0, 0);
      assert.deepEqual(imageData.left, 0);
      assert.deepEqual(imageData.top, 0);

      done();
    }
  });
});

QUnit.test('options#movable: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    movable: false,

    viewed: function () {
      var viewer = this.viewer;
      var imageData = viewer.imageData;

      viewer.moveTo(0, 0);
      assert.notDeepEqual(imageData.left, 0);
      assert.notDeepEqual(imageData.top, 0);

      done();
    }
  });
});
