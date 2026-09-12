describe('show (event)', () => {
  it('should trigger the `show` event', (done) => {
    const image = window.createImage();

    image.addEventListener('show', (event) => {
      expect(event.type).to.equal('show');
      event.preventDefault();
      done();
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should not trigger the `shown` event when default prevented', (done) => {
    const image = window.createImage();

    image.addEventListener('show', (event) => {
      event.preventDefault();
      done();
    });

    image.addEventListener('shown', () => {
      expect.fail(1, 0);
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should not trigger the `show` event in inline mode', () => {
    const image = window.createImage();

    image.addEventListener('show', () => {
      expect.fail(1, 0);
    });

    new Viewer(image, {
      inline: true,
    });
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();

    image.addEventListener('show', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('originalEvent');
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      done();
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('show', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    image.click();
  });
});
