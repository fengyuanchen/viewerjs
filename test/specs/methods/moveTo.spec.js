describe('moveTo (method)', () => {
  it('should move to the expected position', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;

        viewer.moveTo(0, 0);
        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        viewer.moveTo(-10, -10);
        expect(imageData.left).to.equal(-10);
        expect(imageData.top).to.equal(-10);
        done();
      },
    });
  });

  it('should not work when it is not movable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      movable: false,

      viewed() {
        const { imageData } = viewer;
        const { left, top } = imageData;

        viewer.moveTo(0, 0);
        expect(imageData.left).to.equal(left);
        expect(imageData.top).to.equal(top);
        done();
      },
    });
  });
});
