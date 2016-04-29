QUnit.test('methods#update', function (assert) {
  var done = assert.async();
  var util = window.Util;
  var imageList = util.createImageList();
  var viewed;

  assert.expect(2);

  return new Viewer(imageList, {
    inline: true,

    viewed: function () {
      var viewer = this.viewer;
      var items;
      var images;
      var imageListLength;
      var itemsLength;

      if (viewed) {
        return;
      }

      viewed = true;
      items = imageList.getElementsByTagName('li');
      images = imageList.getElementsByTagName('img');
      imageListLength = images.length;
      itemsLength = viewer.items.length;

      imageList.removeChild(items.item(0));
      viewer.update();
      assert.deepEqual(images.length, itemsLength - 1);
      assert.deepEqual(viewer.items.length, itemsLength - 1);

      done();
    }
  });
});
