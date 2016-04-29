QUnit.test('options#inline', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      assert.notOk(util.hasClass(this.viewer.viewer, 'viewer-fixed'));

      done();
    }
  });
});
