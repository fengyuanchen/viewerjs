QUnit.test('options#view', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    view: function (e) {
      assert.ok(e.type === 'view');

      done();
    }
  });
});

QUnit.test('options#view: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    view: function (e) {
      e.preventDefault();

      assert.ok(e.defaultPrevented);

      done();
    },

    viewed: function () {
      assert.ok(false);

      done();
    }
  });
});
