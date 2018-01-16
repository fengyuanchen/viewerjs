QUnit.test('options#container: String', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var container = document.createElement('div');

  assert.expect(1);
  container.id = 'container';
  document.body.appendChild(container);

  var viewer = new Viewer(image, {
    container: '#container',

    shown: function () {
      var viewer = this.viewer;

      assert.deepEqual(container.firstElementChild, viewer.viewer);
      done();
      viewer.hide();
    },
  });

  util.dispatchEvent(image, 'click');
});

QUnit.test('options#container: Element', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var image = util.createImage();
  var container = document.createElement('div');

  assert.expect(1);
  document.body.appendChild(container);

  var viewer = new Viewer(image, {
    container: container,

    shown: function () {
      var viewer = this.viewer;

      assert.deepEqual(container.firstElementChild, viewer.viewer);
      done();
      viewer.hide();
    },
  });

  util.dispatchEvent(image, 'click');
});
