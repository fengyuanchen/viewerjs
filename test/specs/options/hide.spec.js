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
        viewer.hide(true);
      },

      hide(event) {
        expect(event.type).to.equal('hide');
      },

      hidden() {
        done();
      },
    });

    viewer.show();
  });

  it('should not trigger the `hidden` event when default prevented', (done) => {
    const image = window.createImage();
    let hidable = false;
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },

      hide(event) {
        if (!hidable) {
          event.preventDefault();
          setTimeout(() => {
            hidable = true;
            viewer.hide(true);
          }, 350);
        }
      },

      hidden() {
        if (!hidable) {
          expect.fail(1, 0);
        } else {
          done();
        }
      },
    });

    viewer.show();
  });

  it('should not execute the `hide` hook function in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.hide(true);
        done();
      },

      hide() {
        expect.fail(1, 0);
      },
    });
  });
});
