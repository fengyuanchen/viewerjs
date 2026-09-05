describe('minZoomRatio (option)', () => {
  it('should be `0.01` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.minZoomRatio).to.equal(0.01);
  });

  it('should not be less than the given minimum zoom ratio', (done) => {
    const image = window.createImage();
    const minZoomRatio = 0.1;
    const viewer = new Viewer(image, {
      minZoomRatio,
      inline: true,

      viewed() {
        viewer.zoomTo(0.01);
        expect(viewer.imageData.ratio).to.equal(minZoomRatio);
        done();
      },
    });

    expect(viewer.options.minZoomRatio).to.equal(minZoomRatio);
  });

  it('should support a function as the minimum zoom ratio', (done) => {
    const image = window.createImage();
    let minZoomRatio = 0.1;
    const viewer = new Viewer(image, {
      minZoomRatio(currentImage, imageData) {
        expect(this).to.equal(viewer);
        expect(currentImage).to.equal(viewer.image);
        expect(imageData).to.equal(viewer.imageData);
        return minZoomRatio;
      },
      inline: true,

      viewed() {
        viewer.zoomTo(0.01);
        expect(viewer.imageData.ratio).to.equal(minZoomRatio);
        minZoomRatio = 0.2;
        viewer.zoomTo(0.01);
        expect(viewer.imageData.ratio).to.equal(minZoomRatio);
        done();
      },
    });
  });
});
