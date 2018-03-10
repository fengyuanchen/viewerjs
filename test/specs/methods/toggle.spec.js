describe('toggle (method)', () => {
  it('should toggle the scale of the current viewing image between its initial ratio and 1', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        const { imageData } = viewer;
        const { ratio } = imageData;

        viewer.toggle();
        expect(imageData.ratio).to.equal(1);
        viewer.toggle();
        expect(imageData.ratio).to.equal(ratio);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not work when it is not zoomable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      zoomable: false,

      viewed() {
        const { imageData } = viewer;
        const { ratio } = imageData;

        viewer.toggle();
        expect(imageData.ratio).to.equal(ratio);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
