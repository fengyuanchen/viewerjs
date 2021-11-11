describe('downloaded (event)', () => {
  it('should trigger the `downloaded` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('downloaded', (event) => {
      expect(event.type).to.equal('downloaded');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `downloaded` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('downloaded', (event) => {
      expect(event.type).to.equal('downloaded');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });

  it('should not cancel the `downloaded` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('downloaded', (event) => {
      expect(event.defaultPrevented).to.false;
      event.preventDefault();
      expect(event.defaultPrevented).to.false;
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
