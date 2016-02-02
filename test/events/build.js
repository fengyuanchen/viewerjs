QUnit.test('events.build', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('build', function (e) {
    assert.ok(e.type === 'build');

    done();
  }, false);

  return new Viewer(image);
});

QUnit.test('events.build: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('build', function (e) {
    e.preventDefault();

    assert.ok(e.defaultPrevented);

    done();
  }, false);

  image.addEventListener('built', function () {
    assert.ok(false);
  }, false);

  return new Viewer(image, {
    inline: true
  });
});
