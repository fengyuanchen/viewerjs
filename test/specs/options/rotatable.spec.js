describe('rotatable (option)', () => {
  it('should be rotatable by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.rotateTo(90);
        expect(viewer.imageData.rotate).to.equal(90);
        done();
      },
    });

    expect(viewer.options.rotatable).to.be.true;
  });

  it('should not be rotatable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      rotatable: false,

      viewed() {
        viewer.rotateTo(90);
        expect(viewer.imageData.rotate).to.not.equal(90);
        done();
      },
    });

    expect(viewer.options.rotatable).to.be.false;
  });
});
