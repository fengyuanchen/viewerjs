describe('play (event)', () => {
  it('should trigger the `play` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      expect(viewer.played).to.false;
      viewer.play();
      expect(viewer.played).to.true;
      done();
    });

    image.addEventListener('play', (event) => {
      expect(event.type).to.equal('play');
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
      done();
    });

    image.addEventListener('play', (event) => {
      expect(event.type).to.equal('play');
      event.preventDefault();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
