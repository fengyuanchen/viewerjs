QUnit.test('methods.view', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(2);

  return new Viewer(imageList, {
    build: function () {
      var viewer = this.viewer;

      setTimeout(function () {
        viewer.show();
      }, 0);
    },

    shown: function () {
      var viewer = this.viewer;

      assert.deepEqual(viewer.index, 0);

      viewer.view(1);
    },

    viewed: function () {
      var viewer = this.viewer;

      if (viewer.index === 1) {
        assert.ok(true);

        done();

        viewer.hide();
      }
    }
  });
});
