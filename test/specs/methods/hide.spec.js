describe('hide (method)', () => {
  it('should hide the viewer in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.isShown).to.be.true;
        viewer.hide();
      },

      hidden() {
        expect(viewer.isShown).to.be.false;
        done();
      },
    });

    viewer.show();
  });

  it('should hide immediately the viewer in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.isShown).to.be.true;
        viewer.hide(true);
        expect(viewer.isShown).to.be.false;
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
        expect(viewer.isShown).to.be.true;
        viewer.hide(true);
        expect(viewer.isShown).to.be.true;
        done();
      },
    });
  });
});
