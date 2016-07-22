QUnit.test('events#hidden', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    shown: function () {
      this.viewer.hide();
    },

    hidden: function (e) {
      assert.ok(e.type === 'hidden');

      done();
    }
  });

  util.dispatchEvent(image, 'click');
});
