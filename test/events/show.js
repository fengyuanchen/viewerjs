QUnit.test('events.show', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('show', function (e) {
    assert.ok(e.type === 'show');

    done();
  }, false);

  return new Viewer(image, {
    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    },

    shown: function () {
      this.viewer.hide();
    }
  });
});

QUnit.test('events.show: default prevented', function (assert) {
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

  return new Viewer(image, {
    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    }
  });
});
