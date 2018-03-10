describe('update (method)', () => {
  it('should update the image list', (done) => {
    const imageList = window.createImageList();
    let viewed;
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed() {
        if (viewed) {
          return;
        }

        viewed = true;
        const items = imageList.getElementsByTagName('li');
        const itemsLength = viewer.items.length;

        imageList.removeChild(items.item(0));
        viewer.update();
        expect(viewer.items.length).to.equal(itemsLength - 1);
        viewer.hide(true);
        done();
      },
    });
  });
});
