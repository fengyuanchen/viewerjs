describe('downloadable (option)', () => {
  it('should be downloadable by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.download();
        expect(viewer.downloaded).to.be.true;
        done();
      },
    });

    expect(viewer.options.downloadable).to.be.true;
  });

  it('should not be downloadable', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      downloadable: false,

      viewed() {
        viewer.download();
        expect(viewer.downloaded).to.not.be.true;
        done();
      },
    });

    expect(viewer.options.downloadable).to.be.false;
  });
});
