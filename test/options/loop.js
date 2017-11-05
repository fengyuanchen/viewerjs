QUnit.test('options#loop', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();

  assert.expect(1);

  return new Viewer(imageList, {
    inline: true,
    loop: true,

    viewed: function () {
      var viewer = this.viewer;

      switch (viewer.index) {
        case 0:
          viewer.toolbar.querySelector('.viewer-prev').click();
          break;

        case 3:
          assert.ok(true);

          done();
          break;
      }
    }
  });
});
