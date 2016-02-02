QUnit.test('options.build', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    build: function (e) {
      assert.ok(e.type === 'build');

      done();
    }
  });
});

QUnit.test('options.build: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    build: function (e) {
      e.preventDefault();

      assert.ok(e.defaultPrevented);

      done();
    },

    built: function () {
      assert.ok(false);
    }
  });
});
