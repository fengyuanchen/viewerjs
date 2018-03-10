describe('zIndexInline (option)', () => {
  it('should be 0 by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
    });

    expect(viewer.options.zIndexInline).to.equal(0);
  });

  it('should match the given value', (done) => {
    const image = window.createImage();
    const zIndexInline = 1;
    const viewer = new Viewer(image, {
      zIndexInline,
      inline: true,

      viewed() {
        expect(Number(window.getComputedStyle(viewer.viewer).zIndex)).to.equal(zIndexInline);
        done();
      },
    });

    expect(viewer.options.zIndexInline).to.equal(zIndexInline);
  });

  it('should not work when it is not inline', (done) => {
    const image = window.createImage();
    const zIndexInline = 1;
    const viewer = new Viewer(image, {
      zIndexInline,

      viewed() {
        expect(Number(window.getComputedStyle(viewer.viewer).zIndex)).to.not.equal(zIndexInline);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
