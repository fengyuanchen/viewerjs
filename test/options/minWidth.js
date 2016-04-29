QUnit.test('options#minWidth', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var minWidth = image.parentNode.offsetWidth + 1;

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    minWidth: minWidth,

    viewed: function () {
      assert.deepEqual(parseInt(this.viewer.viewer.style.width, 10), minWidth);

      done();
    }
  });
});
