QUnit.test('methods.play', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(4);

  return new Viewer(imageList, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      assert.notOk(viewer.isPlayed);
      assert.notOk(util.hasClass(viewer.player, 'viewer-show'));

      viewer.play();
      assert.ok(viewer.isPlayed);
      assert.ok(util.hasClass(viewer.player, 'viewer-show'));

      done();

      setTimeout(function () {
        viewer.stop();
      }, 1000);
    }
  });
});
