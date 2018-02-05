describe('maxZoomRatio (option)', () => {
  it('should be `100` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.maxZoomRatio).to.equal(100);
  });

  it('should not be greater than the given maximum zoom ratio', (done) => {
    const image = window.createImage();
    const maxZoomRatio = 10;
    const viewer = new Viewer(image, {
      inline: true,
      maxZoomRatio,

      viewed() {
        viewer.zoomTo(11);
        expect(viewer.imageData.ratio).to.equal(maxZoomRatio);
        done();
      },
    });

    expect(viewer.options.maxZoomRatio).to.equal(maxZoomRatio);
  });
});
