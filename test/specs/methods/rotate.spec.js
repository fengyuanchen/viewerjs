describe('rotate (method)', () => {
  it('should rotate to the expected degrees', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.rotate).to.equal(0);
        viewer.rotate(90);
        expect(imageData.rotate).to.equal(90);
        viewer.rotate(90);
        expect(imageData.rotate).to.equal(180);
        viewer.rotate(-180);
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
        viewer.rotate(90);
        expect(imageData.rotate).to.be.undefined;
        done();
      },
    });
  });
});
