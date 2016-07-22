QUnit.test('methods#view', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(2);

  var viewer = new Viewer(imageList, {
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

  viewer.show();
});
