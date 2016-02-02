QUnit.test('options.hide', function (assert) {
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
      this.viewer.hide();
    },

    hide: function (e) {
      assert.ok(e.type === 'hide');

      done();
    }
  });
});

QUnit.test('options.hide: default prevented', function (assert) {
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
      this.viewer.hide();
    },

    hide: function (e) {
      var viewer = this.viewer;

      e.preventDefault();

      assert.ok(e.defaultPrevented);

      done();

      setTimeout(function () {
        viewer.destroy();
      }, 1000);
    },

    hidden: function () {
      assert.ok(false);
    }
  });
});
