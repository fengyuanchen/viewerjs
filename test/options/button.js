QUnit.test('options.button', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    },

    shown: function () {
      var viewer = this.viewer;

      assert.ok(util.hasClass(viewer.button, 'viewer-close'));

      done();

      viewer.hide();
    }
  });
});

QUnit.test('options.button: inline', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    built: function () {
      assert.ok(util.hasClass(this.viewer.button, 'viewer-fullscreen'));

      done();
    }
  });
});

QUnit.test('options.button: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    button: false,

    built: function () {
      assert.ok(util.hasClass(this.viewer.button, 'viewer-hide'));

      done();
    }
  });
});
