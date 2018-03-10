describe('hidden (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.hidden).to.be.null;
  });

  it('should execute the `hidden` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },

      hidden(event) {
        expect(event.type).to.equal('hidden');
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `hidden` hook function in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        viewer.hide(true);
        done();
      },

      hidden() {
        expect.fail(1, 0);
      },
    });
  });
});
