QUnit.test('options#url', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    url: 'src',

    viewed: function () {
      assert.ok(true);

      done();
    }
  });
});

QUnit.test('options#url: function', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    url: function () {
      return this.src;
    },

    viewed: function () {
      assert.ok(true);

      done();
    }
  });
});
