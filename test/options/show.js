QUnit.test('options.show', function (assert) {
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

    show: function (e) {
      assert.ok(e.type === 'show');

      done();
    },

    shown: function () {
      this.viewer.hide();
    }
  });
});

QUnit.test('options.show: default prevented', function (assert) {
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

    show: function (e) {
      e.preventDefault();

      assert.ok(e.defaultPrevented);

      done();
    },

    shown: function () {
      assert.ok(false);
    }
  });
});
