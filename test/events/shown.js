QUnit.test('events#shown', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();

  assert.expect(1);

  image.addEventListener('shown', function (e) {
    assert.ok(e.type === 'shown');

    done();

    this.viewer.hide();
  }, false);

  var viewer = new Viewer(image);

  util.dispatchEvent(image, 'click');
});
