QUnit.test('options#toolbar', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    ready: function () {
      assert.notOk(util.hasClass(this.viewer.toolbar, 'viewer-hide'));

      done();
    }
  });
});

QUnit.test('options#toolbar: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    toolbar: false,

    ready: function () {
      assert.ok(util.hasClass(this.viewer.toolbar, 'viewer-hide'));

      done();
    }
  });
});
