describe('stop (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.stop).to.be.null;
  });

  it('should execute the `stop` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.play();
        setTimeout(() => {
          expect(viewer.played).to.true;
          viewer.stop();
          expect(viewer.played).to.false;
          done();
        }, 500);
      },

      stop(event) {
        expect(event.type).to.equal('stop');
      },
    });

    viewer.show();
  });

  it('should not execute the `stop` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.play();
        setTimeout(() => {
          expect(viewer.played).to.true;
          viewer.stop();
          expect(viewer.played).to.true;
          done();
        }, 500);
      },

      stop(event) {
        expect(event.type).to.equal('stop');
        event.preventDefault();
      },
    });

    viewer.show();
  });
});
