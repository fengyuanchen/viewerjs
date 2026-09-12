describe('view (event)', () => {
  it('should trigger the `view` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      expect(event.type).to.equal('view');
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage', 'originalEvent');
      expect(detail.image.src).to.equal(image.src);
      expect(detail.index).to.equal(0);
      expect(detail.originalImage).to.equal(image);
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `viewed` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('viewed', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
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

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('view', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    image.click();
  });
});
