QUnit.test('options.built', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    built: function (e) {
      assert.ok(e.type === 'built');

      done();
    }
  });
});
