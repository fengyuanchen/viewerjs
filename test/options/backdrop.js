QUnit.test('options#backdrop', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  var viewer = new Viewer(image, {
    shown: function () {
      var viewer = this.viewer;

      assert.ok(viewer.viewer.classList.contains('viewer-backdrop'));
      util.dispatchEvent(viewer.canvas, 'click');

      setTimeout(function () {
        assert.notOk(viewer.viewer.classList.contains('viewer-in'));
        done();
      }, 350);
    },
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('options#backdrop: false', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  var viewer = new Viewer(image, {
    backdrop: false,

    shown: function () {
      var viewer = this.viewer;

      assert.notOk(viewer.viewer.classList.contains('viewer-backdrop'));
      util.dispatchEvent(viewer.canvas, 'click');

      setTimeout(function () {
        assert.ok(viewer.viewer.classList.contains('viewer-in'));
        viewer.hide();
        done();
      }, 350);
    },
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('options#backdrop: static', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(2);

  var viewer = new Viewer(image, {
    backdrop: false,

    shown: function () {
      var viewer = this.viewer;

      assert.notOk(viewer.viewer.classList.contains('viewer-backdrop'));
      util.dispatchEvent(viewer.canvas, 'click');

      setTimeout(function () {
        assert.ok(viewer.viewer.classList.contains('viewer-in'));
        viewer.hide();
        done();
      }, 350);
    },
  });

  util.dispatchEvent(image, 'click');
});
