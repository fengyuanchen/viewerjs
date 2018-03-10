describe('zoomRatio (option)', () => {
  it('should be 0.1 by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomRatio).to.equal(0.1);
  });

  it('should match the given zoom ratio', (done) => {
    const image = window.createImage();
    const zoomRatio = 0.2;
    const viewer = new Viewer(image, {
      zoomRatio,

      viewed() {
        const { imageData } = viewer;
        const { width } = imageData;

        viewer.viewer.dispatchEvent(window.createEvent('wheel', {
          deltaY: -1,
        }));
        expect(imageData.ratio).to.equal((width * (1 + zoomRatio)) / imageData.naturalWidth);
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.zoomRatio).to.equal(zoomRatio);
    viewer.show();
  });
});
