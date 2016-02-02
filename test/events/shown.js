QUnit.test('events.shown', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('shown', function (e) {
    assert.ok(e.type === 'shown');

    done();

    this.viewer.hide();
  }, false);

  return new Viewer(image, {
    build: function () {
      setTimeout(function () {
        util.dispatchEvent(image, 'click');
      }, 0);
    }
  });
});
