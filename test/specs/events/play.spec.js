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

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
    });

    image.addEventListener('play', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('originalEvent');
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.toolbar.querySelector('.viewer-play').click();
    });

    image.addEventListener('play', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
