describe('shown (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.shown).to.be.null;
  });

  it('should execute the `shown` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown(event) {
        expect(event.type).to.equal('shown');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `shown` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      ready() {
        done();
      },

      shown() {
        expect.fail(1, 0);
      },
    });
  });
});
