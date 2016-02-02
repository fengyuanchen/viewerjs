QUnit.test('options.toolbar', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    built: function () {
      assert.notOk(util.hasClass(this.viewer.toolbar, 'viewer-hide'));

      done();
    }
  });
});

QUnit.test('options.toolbar: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    toolbar: false,

    built: function () {
      assert.ok(util.hasClass(this.viewer.toolbar, 'viewer-hide'));

      done();
    }
  });
});
