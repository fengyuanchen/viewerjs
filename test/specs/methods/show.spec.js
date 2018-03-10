describe('show (method)', () => {
  it('should show the viewer in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.isShown).to.be.true;
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.isShown).to.be.false;
    viewer.show();
  });

  it('should view the first image after shown', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed(event) {
        expect(event.detail.index).to.equal(0);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
