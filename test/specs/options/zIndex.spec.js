describe('zIndex (option)', () => {
  it('should be `2015` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zIndex).to.equal(2015);
  });

  it('should match the given z-index', (done) => {
    const image = window.createImage();
    const zIndex = 2016;
    const viewer = new Viewer(image, {
      zIndex,

      viewed() {
        expect(Number(window.getComputedStyle(viewer.viewer).zIndex)).to.equal(zIndex);
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.zIndex).to.equal(zIndex);
    viewer.show();
  });

  it('should not work in inline mode', (done) => {
    const image = window.createImage();
    const zIndex = 2016;
    const viewer = new Viewer(image, {
      zIndex,
      inline: true,

      viewed() {
        expect(Number(window.getComputedStyle(viewer.viewer).zIndex)).to.not.equal(zIndex);
        done();
      },
    });
  });
});
