describe('zoomOnWheel (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomOnWheel).to.be.true;
  });
});
