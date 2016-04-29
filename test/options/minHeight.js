QUnit.test('options#minHeight', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var minHeight = image.parentNode.offsetHeight + 1;

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    minHeight: minHeight,

    viewed: function () {
      assert.deepEqual(parseInt(this.viewer.viewer.style.height, 10), minHeight);

      done();
    }
  });
});
