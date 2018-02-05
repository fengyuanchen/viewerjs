describe('scaleY (method)', () => {
  it('should scale to the given value in y-axis', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.scaleY).to.equal(1);
        viewer.scaleY(-1);
        expect(imageData.scaleY).to.equal(-1);
        viewer.scaleY(1);
        expect(imageData.scaleY).to.equal(1);
        done();
      },
    });
  });

  it('should not work when it is not scalable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      scalable: false,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.scaleY).to.be.undefined;
        viewer.scaleY(-1);
        expect(imageData.scaleY).to.be.undefined;
        done();
      },
    });
  });
});
