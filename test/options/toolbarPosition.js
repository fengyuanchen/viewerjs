QUnit.test('options#toolbarPosition(: bottom)', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  return new Viewer(image, {
    inline: true,

    ready: function () {
      assert.ok(util.hasClassParent(this.viewer.toolbar, 'viewer-footer'));

      done();
    }
  });
});

QUnit.test('options#toolbarPosition: left', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    toolbarPosition: 'left',

    ready: function () {
      assert.ok(util.hasClassParent(this.viewer.toolbar, 'viewer-container'));
      assert.ok(util.hasClass(this.viewer.toolbar, 'viewer-toolbar-left'));

      done();
    }
  });
});
QUnit.test('options#toolbarPosition: right', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  return new Viewer(image, {
    inline: true,
    toolbarPosition: 'right',

    ready: function () {
      assert.ok(util.hasClassParent(this.viewer.toolbar, 'viewer-container'));
      assert.ok(util.hasClass(this.viewer.toolbar, 'viewer-toolbar-right'));

      done();
    }
  });
});
