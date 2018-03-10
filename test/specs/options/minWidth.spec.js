describe('minWidth (option)', () => {
  it('should be `200` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
    });

    expect(viewer.options.minWidth).to.equal(200);
  });

  it('should not less than the given minimum width', (done) => {
    const image = window.createImage();
    const minWidth = 320;

    image.parentElement.style.width = '160px';

    const viewer = new Viewer(image, {
      minWidth,
      inline: true,

      viewed() {
        expect(parseFloat(window.getComputedStyle(viewer.viewer).width)).to.equal(minWidth);
        done();
      },
    });

    expect(viewer.options.minWidth).to.equal(minWidth);
  });
});
