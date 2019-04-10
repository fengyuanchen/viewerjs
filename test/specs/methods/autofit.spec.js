describe('autofit (method)', () => {
  it('should move back when leave canvas', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const { imageData, canvas } = viewer;
        const { offsetWidth,offsetHeight } = canvas;

        viewer.moveTo(0, 0);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        viewer.moveTo(-10, -10);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(0);
        expect(imageData.top).to.equal(0);
        viewer.zoomTo(4);
        viewer.moveTo(-imageData.width + offsetWidth - 10, -imageData.height + offsetHeight - 10);
        viewer.autofit(imageData, canvas);
        expect(imageData.left).to.equal(-imageData.width + offsetWidth);
        expect(imageData.top).to.equal(-imageData.height + offsetHeight);
        done();
      },
    });
  });
});
