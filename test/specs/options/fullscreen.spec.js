describe('fullscreen (option)', () => {
  it('should be enabled by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.fullscreen).to.be.true;
  });

  it('should be disabled', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      fullscreen: false,
    });

    expect(viewer.options.fullscreen).to.be.false;
  });
});
