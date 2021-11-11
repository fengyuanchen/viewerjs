describe('download (method)', () => {
  it('should download', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        expect(viewer.downloaded).to.be.false;
        viewer.download();
        expect(viewer.downloaded).to.be.true;
        done();
      },
    });
  });

  it('should not work when it is not downloadable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      downloadable: false,

      viewed() {
        expect(viewer.downloaded).to.be.false;
        viewer.download();
        expect(viewer.downloaded).to.be.false;
        done();
      },
    });
  });
});
