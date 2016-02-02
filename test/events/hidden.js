QUnit.test('events.hidden', function (assert) {
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

    hidden: function (e) {
      assert.ok(e.type === 'hidden');

      done();
    }
  });
});
