describe('view (method)', () => {
  it('should view the image of the given index', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      },
    });

    viewer.view(1);
  });

  it('should not work when the given index is less than 0', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(-1);
    setTimeout(() => {
      viewer.hide(true);
      done();
    }, 500);
  });

  it('should not work when the given index is greater than or equal to the length of the images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(imageList.childElementCount);
    setTimeout(() => {
      viewer.hide(true);
      done();
    }, 500);
  });
});
