describe('show (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.show).to.be.null;
  });

  it('should execute the `show` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      show(event) {
        expect(event.type).to.equal('show');
      },

      shown() {
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `shown` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      show(event) {
        event.preventDefault();
        done();
      },

      shown() {
        expect.fail(1, 0);
      },
    });

    viewer.show();
  });

  it('should not execute the `show` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      ready() {
        done();
      },

      show() {
        expect.fail(1, 0);
      },
    });
  });
});
