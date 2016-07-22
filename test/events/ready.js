QUnit.test('events#ready', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('ready', function (e) {
    assert.ok(e.type === 'ready');

    done();
  }, false);

  return new Viewer(image, {
    inline: true
  });
});
