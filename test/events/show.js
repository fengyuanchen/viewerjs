QUnit.test('events#show', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('show', function (e) {
    assert.ok(e.type === 'show');

    done();
  }, false);

  var viewer = new Viewer(image, {
    shown: function () {
      this.viewer.hide();
    }
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('events#show: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('show', function (e) {
    e.preventDefault();

    assert.ok(e.defaultPrevented);

    done();
  }, false);

  image.addEventListener('shown', function () {
    assert.ok(false);
  }, false);

  var viewer = new Viewer(image);

  util.dispatchEvent(image, 'click');
});
