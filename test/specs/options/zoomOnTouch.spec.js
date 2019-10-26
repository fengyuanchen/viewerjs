describe('zoomOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomOnTouch).to.be.true;
  });
});
