describe('view (method)', () => {
  it('show view the image of the given index', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        expect(event.detail.index).to.equal(1);
        done();
      },
    });

    viewer.view(1);
  });

  it('show not work when the given index is less than 0', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(-1);
    done();
  });

  it('show not work when the given index is greater than or equal to the length of the images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(imageList.childElementCount);
    done();
  });
});
