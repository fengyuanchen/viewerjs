QUnit.test('methods#exit', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(8);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.full();
      assert.ok(viewer.fulled);
      assert.ok(util.hasClass(viewer.body, 'viewer-open'));
      assert.ok(util.hasClass(viewer.button, 'viewer-fullscreen-exit'));
      assert.ok(util.hasClass(viewer.viewer, 'viewer-fixed'));

      viewer.exit();
      assert.notOk(viewer.fulled);
      assert.notOk(util.hasClass(viewer.body, 'viewer-open'));
      assert.notOk(util.hasClass(viewer.button, 'viewer-fullscreen-exit'));
      assert.notOk(util.hasClass(viewer.viewer, 'viewer-fixed'));

      done();
    }
  });
});
