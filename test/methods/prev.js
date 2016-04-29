QUnit.test('methods#prev', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(1);

  return new Viewer(imageList, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      switch (viewer.index) {
        case 0:
          viewer.view(2);
          break;

        case 1:
          assert.ok(true);

          done();
          break;

        case 2:
          viewer.prev();
          break;
      }
    }
  });
});
