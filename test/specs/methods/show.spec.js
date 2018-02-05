describe('show (method)', () => {
  it('should show the viewer in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.visible).to.be.true;
        done();
      },
    });

    expect(viewer.visible).to.be.false;
    viewer.show();
  });

  it('should view the first image after shown', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed(event) {
        expect(event.detail.index).to.equal(0);
        done();
      },
    });

    viewer.show();
  });

  it('should not work in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(viewer.visible).to.be.true;
        viewer.hide();
        expect(viewer.visible).to.be.true;
        done();
      },
    });
  });
});
