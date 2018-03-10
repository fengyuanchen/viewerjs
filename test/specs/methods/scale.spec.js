describe('scale (method)', () => {
  it('should scale to the given values', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.scaleX).to.equal(1);
        expect(imageData.scaleY).to.equal(1);
        viewer.scale(-1);
        expect(imageData.scaleX).to.equal(-1);
        expect(imageData.scaleY).to.equal(-1);
        viewer.scale(1, -1);
        expect(imageData.scaleX).to.equal(1);
        expect(imageData.scaleY).to.equal(-1);
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

        expect(imageData.scaleX).to.be.undefined;
        expect(imageData.scaleY).to.be.undefined;
        viewer.scale(-1, -1);
        expect(imageData.scaleX).to.be.undefined;
        expect(imageData.scaleY).to.be.undefined;
        done();
      },
    });
  });
});
