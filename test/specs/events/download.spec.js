describe('download (event)', () => {
  it('should trigger the `download` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('download', (event) => {
      expect(event.type).to.equal('download');
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `downloaded` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('download', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('downloaded', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `download` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.download();
    });

    image.addEventListener('download', (event) => {
      expect(event.type).to.equal('download');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });
});
