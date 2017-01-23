QUnit.test('methods#stop', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(4);

  return new Viewer(imageList, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.play();
      assert.ok(viewer.played);
      assert.ok(util.hasClass(viewer.player, 'viewer-show'));

      setTimeout(function () {
        viewer.stop();
        assert.notOk(viewer.played);
        assert.notOk(util.hasClass(viewer.player, 'viewer-show'));

        done();
      }, 1000);
    }
  });
});
