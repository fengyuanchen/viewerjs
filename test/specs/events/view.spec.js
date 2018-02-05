describe('view (event)', () => {
  it('should trigger the `view` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      expect(event.type).to.equal('view');
      viewer.hide();
      done();
    });

    viewer = new Viewer(image);
    viewer.view();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage');
      expect(detail.image.src).to.equal(image.src);
      expect(detail.index).to.equal(0);
      expect(detail.originalImage).to.equal(image);
      viewer.hide();
      done();
    });

    viewer = new Viewer(image);
    viewer.view();
  });

  it('should not trigger the `viewed` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      event.preventDefault();
      viewer.hide();
      done();
    });

    image.addEventListener('viewed', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.view();
  });

  it('should trigger the `view` event in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('view', (event) => {
      expect(event.type).to.equal('view');
      done();
    });

    new Viewer(image, {
      inline: true,
    });
  });
});
