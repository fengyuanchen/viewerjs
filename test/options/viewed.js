QUnit.test('options#viewed', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function (e) {
      assert.ok(e.type === 'viewed');

      done();
    }
  });
});
