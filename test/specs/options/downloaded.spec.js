describe('downloaded (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.downloaded).to.be.null;
  });

  it('should execute the `downloaded` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.download();
      },

      downloaded(event) {
        expect(event.type).to.equal('downloaded');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `downloaded` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.download();
      },

      downloaded(event) {
        expect(event.type).to.equal('downloaded');
        done();
      },
    });
  });
});
