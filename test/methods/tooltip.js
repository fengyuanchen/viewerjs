QUnit.test('methods#tooltip', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      assert.notOk(util.hasClass(viewer.tooltipBox, 'viewer-show'));

      viewer.tooltip();
      assert.ok(util.hasClass(viewer.tooltipBox, 'viewer-show'));

      done();
    }
  });
});
