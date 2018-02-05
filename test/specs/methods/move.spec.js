describe('move (method)', () => {
  it('should move with the given offsets', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData } = viewer;
        const { left, top } = imageData;

        viewer.move(10, 10);
        expect(imageData.left).to.equal(left + 10);
        expect(imageData.top).to.equal(top + 10);
        viewer.move(-10, -10);
        expect(imageData.left).to.equal(left);
        expect(imageData.top).to.equal(top);
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

        viewer.move(10, 10);
        expect(imageData.left).to.equal(left);
        expect(imageData.top).to.equal(top);
        done();
      },
    });
  });
});
