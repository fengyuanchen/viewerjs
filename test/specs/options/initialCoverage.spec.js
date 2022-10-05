describe('initialCoverage (option)', () => {
  it('should be "0.9" by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.initialCoverage).to.equal(0.9);
  });
});
