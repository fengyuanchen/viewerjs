describe('reset (method)', () => {
  it('should reset the image to its initial state', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.move(10, 10).reset();
        expect(viewer.imageData).to.deep.equal(viewer.initialImageData);
        done();
      },
    });
  });
});
