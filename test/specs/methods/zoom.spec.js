describe('zoom (method)', () => {
  it('should zoom with the given offset ratio', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;
        const { width } = imageData;

        viewer.zoom(0.1);
        expect(imageData.width).to.be.above(width);
        viewer.zoom(-0.2);
        expect(imageData.width).to.be.below(width);
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

        viewer.zoom(0.1);
        expect(imageData.width).to.equal(width);
        done();
      },
    });
  });
});
