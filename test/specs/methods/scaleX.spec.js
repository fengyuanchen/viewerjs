describe('scaleX (method)', () => {
  it('should scale to the given value in x-axis', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        expect(imageData.scaleX).to.equal(1);
        viewer.scaleX(-1);
        expect(imageData.scaleX).to.equal(-1);
        viewer.scaleX(1);
        expect(imageData.scaleX).to.equal(1);
        done();
      },
    });
  });

  it('should preserve the transition direction after scaling on the y-axis', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.scaleY(-1);
        viewer.scaleX(-1);

        expect(viewer.image.style.transform).to.equal('scaleX(-1) scaleY(-1)');
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
        viewer.scaleX(-1);
        expect(imageData.scaleX).to.be.undefined;
        done();
      },
    });
  });
});
