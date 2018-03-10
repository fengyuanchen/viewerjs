describe('minHeight (option)', () => {
  it('should be `100` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
    });

    expect(viewer.options.minHeight).to.equal(100);
  });

  it('should not less than the given minimum height', (done) => {
    const image = window.createImage();
    const minHeight = 180;

    image.parentElement.style.height = '90px';

    const viewer = new Viewer(image, {
      minHeight,
      inline: true,

      viewed() {
        expect(parseFloat(window.getComputedStyle(viewer.viewer).height)).to.equal(minHeight);
        done();
      },
    });

    expect(viewer.options.minHeight).to.equal(minHeight);
  });
});
