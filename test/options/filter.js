QUnit.test('options#filter', function (assert) {
  var util = window.Util;
  var image = util.createImage();

  assert.expect(0);

  var viewer = new Viewer(image, {
    inline: true,

    filter: function (image) {
      return false;
    },

    ready: function (e) {
      assert.ok(false);
    },
  });
});
