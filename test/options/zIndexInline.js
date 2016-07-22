QUnit.test('options#zIndexInline', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var zIndexInline = 1;

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    zIndexInline: zIndexInline,

    ready: function () {
      assert.deepEqual(parseInt(this.viewer.viewer.style.zIndex, 10), zIndexInline);

      done();
    }
  });
});
