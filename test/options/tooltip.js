QUnit.test('options#tooltip', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;

      viewer.tooltip();
      assert.ok(util.hasClass(viewer.tooltipBox, 'viewer-show'));
      done();
    }
  });
});

QUnit.test('options#tooltip: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,
    tooltip: false,

    viewed: function () {
      var viewer = this.viewer;

      viewer.tooltip();
      assert.notOk(util.hasClass(viewer.tooltipBox, 'viewer-show'));

      done();
    }
  });
});
