describe('rotate (event)', () => {
  it('should trigger the `rotate` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotate', (event) => {
      expect(event.type).to.equal('rotate');
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

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotate', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('degree', 'oldDegree', 'originalEvent');
      expect(detail.degree).to.be.a('number');
      expect(detail.oldDegree).to.be.a('number');
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `rotated` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotate', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('rotated', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `rotate` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotate', (event) => {
      expect(event.type).to.equal('rotate');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.toolbar.querySelector('.viewer-rotate-left').click();
    });

    image.addEventListener('rotate', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
