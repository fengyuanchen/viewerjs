describe('noConflict', () => {
  it('should be a static method', () => {
    expect(Viewer.noConflict).to.be.a('function');
  });

  it('should return the Viewer class itself', () => {
    const { Viewer } = window;
    const ImageViewer = Viewer.noConflict();

    expect(ImageViewer).to.equal(Viewer);
    expect(window.Viewer).to.be.undefined;

    // Reverts it for the rest test suites
    window.Viewer = ImageViewer;
  });
});
