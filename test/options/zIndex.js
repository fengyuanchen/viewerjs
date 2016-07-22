QUnit.test('options#zIndex', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var zIndex = 2016;

  assert.expect(1);

  var viewer = new Viewer(image, {
    zIndex: zIndex,

    shown: function () {
      var viewer = this.viewer;

      assert.deepEqual(parseInt(viewer.viewer.style.zIndex, 10), zIndex);

      done();

      viewer.hide();
    }
  });

  util.dispatchEvent(image, 'click');
});
