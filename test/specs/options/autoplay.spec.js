describe('autoplay (option)', () => {
  it('should be true by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.autoplay).to.be.true;
  });
});
