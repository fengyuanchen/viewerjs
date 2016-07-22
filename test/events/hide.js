QUnit.test('events#hide', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    shown: function () {
      this.viewer.hide();
    },

    hide: function (e) {
      assert.ok(e.type === 'hide');

      done();
    }
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('events#hide: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  // jshint unused: false
  var viewer = new Viewer(image, {
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

  util.dispatchEvent(image, 'click');
});
