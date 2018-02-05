describe('zoomable (option)', () => {
  it('should be zoomable by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomable).to.be.true;
  });

  it('should not be zoomable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      zoomable: false,

      viewed() {
        viewer.zoomTo(1);
        expect(viewer.imageData.ratio).to.not.equal(1);
        done();
      },
    });

    expect(viewer.options.zoomable).to.be.false;
  });
});
