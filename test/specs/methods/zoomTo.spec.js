describe('zoomTo (method)', () => {
  it('should zoom to the given ratio', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;
        const { ratio } = imageData;

        viewer.zoomTo(1);
        expect(imageData.ratio).to.equal(1);
        viewer.zoomTo(ratio);
        expect(imageData.ratio).to.equal(ratio);
        viewer.hide(true);
        done();
      },
    });
  });

  it('should not work when it is not zoomable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      zoomable: false,

      viewed() {
        const { imageData } = viewer;
        const { width } = imageData;

        viewer.zoomTo(1);
        expect(imageData.width).to.equal(width);
        done();
      },
    });
  });
});
