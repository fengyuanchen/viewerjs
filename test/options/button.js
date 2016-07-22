QUnit.test('options#button', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    shown: function () {
      var viewer = this.viewer;

      assert.ok(util.hasClass(viewer.button, 'viewer-close'));

      done();

      viewer.hide();
    }
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('options#button: inline', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    ready: function () {
      assert.ok(util.hasClass(this.viewer.button, 'viewer-fullscreen'));

      done();
    }
  });
});

QUnit.test('options#button: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    button: false,

    ready: function () {
      assert.ok(util.hasClass(this.viewer.button, 'viewer-hide'));

      done();
    }
  });
});
