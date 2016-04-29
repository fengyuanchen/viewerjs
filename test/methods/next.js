QUnit.test('methods#next', function (assert) {
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
          viewer.next();
          break;

        case 1:
          assert.ok(true);

          done();
          break;
      }
    }
  });
});
