describe('scalable (option)', () => {
  it('should be scalable by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.scale(-1, -1);

        const { imageData } = viewer;

        expect(imageData.scaleX).to.equal(-1);
        expect(imageData.scaleY).to.equal(-1);
        done();
      },
    });

    expect(viewer.options.scalable).to.be.true;
  });

  it('should not be scalable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      scalable: false,

      viewed() {
        viewer.scale(-1, -1);

        const { imageData } = viewer;

        expect(imageData.scaleX).to.not.equal(-1);
        expect(imageData.scaleY).to.not.equal(-1);
        done();
      },
    });

    expect(viewer.options.scalable).to.be.false;
  });
});
