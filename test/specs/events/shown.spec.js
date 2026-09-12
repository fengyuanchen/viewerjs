describe('shown (event)', () => {
  it('should trigger the `shown` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('shown', (event) => {
      expect(event.type).to.equal('shown');
      done();
      event.preventDefault();
      viewer.hide(true);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `shown` event in inline mode', () => {
    const image = window.createImage();

    image.addEventListener('shown', () => {
      expect.fail(1, 0);
    });

    new Viewer(image, {
      inline: true,
    });
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('shown', (event) => {
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

    image.addEventListener('shown', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    image.click();
  });
});
