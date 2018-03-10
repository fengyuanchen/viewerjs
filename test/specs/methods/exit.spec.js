describe('exit (method)', () => {
  it('should exit modal mode in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(viewer.fulled).to.be.false;
        expect(viewer.button.className).to.not.include('viewer-fullscreen-exit');
        expect(viewer.viewer.className).to.not.include('viewer-fixed');
        viewer.full();
        expect(viewer.fulled).to.be.true;
        expect(viewer.button.className).to.include('viewer-fullscreen-exit');
        expect(viewer.viewer.className).to.include('viewer-fixed');
        viewer.exit();
        expect(viewer.fulled).to.be.false;
        expect(viewer.button.className).to.not.include('viewer-fullscreen-exit');
        expect(viewer.viewer.className).to.not.include('viewer-fixed');
        done();
      },
    });
  });

  it('should not work in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.fulled).to.be.true;
        expect(viewer.viewer.className).to.include('viewer-fixed');
        viewer.exit();
        expect(viewer.fulled).to.be.true;
        expect(viewer.viewer.className).to.include('viewer-fixed');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
