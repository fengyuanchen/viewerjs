describe('stop (event)', () => {
  it('should trigger the `stop` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        expect(viewer.played).to.true;
        viewer.stop();
        expect(viewer.played).to.false;
        done();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not stop when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        expect(viewer.played).to.true;
        viewer.stop();
        expect(viewer.played).to.true;
        done();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
      event.preventDefault();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
