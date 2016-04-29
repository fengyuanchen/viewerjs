QUnit.test('events#viewed', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('viewed', function (e) {
    assert.ok(e.type === 'viewed');

    done();
  }, false);

  return new Viewer(image, {
    inline: true
  });
});
