describe('hide (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.hide).to.be.null;
  });

  it('should execute the `hide` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },

      hide(event) {
        expect(event.type).to.equal('hide');
        done();
      },
    });

    viewer.show();
  });

  it('should not trigger the `hidden` event when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },

      hide(event) {
        event.preventDefault();
        done();
      },

      hidden() {
        expect.fail(1, 0);
      },
    });

    viewer.show();
  });

  it('should not execute the `hide` hook function in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.hide();
        done();
      },

      hide() {
        expect.fail(1, 0);
      },
    });
  });
});
