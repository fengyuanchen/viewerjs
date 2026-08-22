describe('hide (method)', () => {
  it('should blur focused element in viewer before setting aria-hidden', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.button.focus();
        expect(viewer.viewer.ownerDocument.activeElement).to.equal(viewer.button);
        viewer.hide(true);
      },

      hidden() {
        expect(viewer.viewer.contains(viewer.viewer.ownerDocument.activeElement)).to.be.false;
        done();
      },
    });

    viewer.show();
  });

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
