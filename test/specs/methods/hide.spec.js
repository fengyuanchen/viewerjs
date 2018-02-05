describe('hide (method)', () => {
  it('should hide the viewer in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.visible).to.be.true;
        viewer.hide();
        setTimeout(() => {
          expect(viewer.visible).to.be.false;
          done();
        }, 350);
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
