describe('download (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.download).to.be.null;
  });

  it('should execute the `download` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.download();
      },

      download(event) {
        expect(event.type).to.equal('download');
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `downloaded` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.download();
      },

      download(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      downloaded() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `download` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.download();
      },

      download(event) {
        expect(event.type).to.equal('download');
        done();
      },
    });
  });
});
