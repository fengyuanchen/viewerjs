describe('transition (option)', () => {
  it('should be enabled by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(viewer.viewer.className).to.include('viewer-transition');
        expect(viewer.list.className).to.include('viewer-transition');
        expect(viewer.image.className).to.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.transition).to.be.true;
    viewer.show();
  });

  it('should be disabled', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: false,

      viewed() {
        expect(viewer.viewer.className).to.not.include('viewer-transition');
        expect(viewer.list.className).to.not.include('viewer-transition');
        expect(viewer.image.className).to.not.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.transition).to.be.false;
    viewer.show();
  });
});
