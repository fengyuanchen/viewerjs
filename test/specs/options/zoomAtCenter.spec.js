describe('zoomAtCenter (option)', () => {
  it('should be false be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomAtCenter).to.be.false;
  });
});
