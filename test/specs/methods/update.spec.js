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

  it('should view the new image', (done) => {
    const container = window.createContainer();
    const image = window.createImage();
    const viewer = new Viewer(container, {
      viewed(event) {
        expect(event.detail.originalImage).to.equal(image);
        viewer.hide(true);
        done();
      },
    });

    container.appendChild(image);
    viewer.update();
    image.click();
  });

  it('should view the new image in inline mode', (done) => {
    const container = window.createContainer();
    const image = window.createImage();
    const viewer = new Viewer(container, {
      inline: true,
      viewed(event) {
        expect(event.detail.originalImage).to.equal(image);
        done();
      },
    });

    container.appendChild(image);
    viewer.update();
  });
});
