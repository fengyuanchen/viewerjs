describe('slideOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.slideOnTouch).to.be.true;
  });
});
