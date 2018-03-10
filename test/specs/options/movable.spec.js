describe('movable (option)', () => {
  it('should be movable by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.moveTo(0, 0);

        const { imageData } = viewer;

        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        done();
      },
    });

    expect(viewer.options.movable).to.be.true;
  });

  it('should not be movable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      movable: false,

      viewed() {
        viewer.moveTo(0, 0);

        const { imageData } = viewer;

        expect(imageData.left).to.not.equal(0);
        expect(imageData.top).to.not.equal(0);
        done();
      },
    });

    expect(viewer.options.movable).to.be.false;
  });
});
