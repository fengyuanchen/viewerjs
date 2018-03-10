describe('ready (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.ready).to.be.null;
  });

  it('should execute the `ready` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      ready(event) {
        expect(event.type).to.equal('ready');
        event.preventDefault();
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `ready` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      ready(event) {
        expect(event.type).to.equal('ready');
        done();
      },
    });
  });
});
