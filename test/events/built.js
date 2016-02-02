QUnit.test('events.built', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('built', function (e) {
    assert.ok(e.type === 'built');

    done();
  }, false);

  return new Viewer(image, {
    inline: true
  });
});
