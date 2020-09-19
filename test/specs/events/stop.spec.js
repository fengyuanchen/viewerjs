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
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
      done();
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
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
      event.preventDefault();
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
