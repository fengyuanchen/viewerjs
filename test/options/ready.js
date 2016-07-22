QUnit.test('options#ready', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    ready: function (e) {
      assert.ok(e.type === 'ready');

      done();
    }
  });
});
