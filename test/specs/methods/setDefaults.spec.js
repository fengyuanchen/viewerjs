describe('setDefaults', () => {
  it('should be a static method', () => {
    expect(Viewer.setDefaults).to.be.a('function');
  });

  it('should change the global default options', (done) => {
    Viewer.setDefaults({
      backdrop: false,
    });

    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.viewer.className).to.not.include('viewer-backdrop');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.backdrop).to.be.false;
    viewer.show();

    // Reverts it for the rest test suites
    Viewer.setDefaults({
      backdrop: true,
    });
  });
});
