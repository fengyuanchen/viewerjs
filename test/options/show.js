QUnit.test('options#show', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    show: function (e) {
      assert.ok(e.type === 'show');

      done();
    },

    shown: function () {
      this.viewer.hide();
    }
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('options#show: default prevented', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    show: function (e) {
      e.preventDefault();

      assert.ok(e.defaultPrevented);

      done();
    },

    shown: function () {
      assert.ok(false);
    }
  });

  util.dispatchEvent(image, 'click');
});
