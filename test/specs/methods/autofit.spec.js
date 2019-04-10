describe('autofit (method)', () => {
  it('should move back when leave canvas', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData, canvas } = viewer;

        viewer.moveTo(0, 0);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        viewer.moveTo(-10, -10);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        viewer.zoomTo(4);
        viewer.moveTo(-imageData.width + canvas.offsetWidth - 10, -imageData.height + canvas.offsetHeight - 10);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(-imageData.width + canvas.offsetWidth);
        expect(imageData.top).to.equal(-imageData.height + canvas.offsetHeight);
        done();
      },
    });
  });
});
