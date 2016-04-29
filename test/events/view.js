QUnit.test('events#view', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('view', function (e) {
    assert.ok(e.type === 'view');

    done();
  }, false);

  return new Viewer(image, {
    inline: true
  });
});

QUnit.test('events#view: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('view', function (e) {
    e.preventDefault();

    assert.ok(e.defaultPrevented);

    done();
  }, false);

  image.addEventListener('viewed', function () {
    assert.ok(false);
  }, false);

  return new Viewer(image, {
    inline: true
  });
});
