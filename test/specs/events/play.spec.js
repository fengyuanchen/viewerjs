describe('play (event)', () => {
  it('should trigger the `play` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      expect(viewer.played).to.false;
      viewer.play();
      expect(viewer.played).to.true;
    });

    image.addEventListener('play', (event) => {
      expect(event.type).to.equal('play');
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not play when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      expect(viewer.played).to.false;
      viewer.play();
      expect(viewer.played).to.false;
    });

    image.addEventListener('play', (event) => {
      expect(event.type).to.equal('play');
      event.preventDefault();
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
