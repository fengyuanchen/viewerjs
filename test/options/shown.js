QUnit.test('options#shown', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  var viewer = new Viewer(image, {
    shown: function (e) {
      assert.ok(e.type === 'shown');

      done();

      this.viewer.hide();
    }
  });

  util.dispatchEvent(image, 'click');
});
