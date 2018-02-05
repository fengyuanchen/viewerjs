describe('rotateTo (method)', () => {
  it('should rotate to the given degrees', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.rotate).to.equal(0);
        viewer.rotateTo(360);
        expect(imageData.rotate).to.equal(360);
        viewer.rotateTo(-180);
        expect(imageData.rotate).to.equal(-180);
        viewer.rotateTo(0);
        expect(imageData.rotate).to.equal(0);
        done();
      },
    });
  });

  it('should not work when it is not rotatable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      rotatable: false,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.rotate).to.be.undefined;
        viewer.rotateTo(90);
        expect(imageData.rotate).to.be.undefined;
        done();
      },
    });
  });
});
