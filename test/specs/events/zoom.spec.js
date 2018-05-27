describe('zoom (event)', () => {
  it('should trigger the `zoom` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.zoomTo(1);
    });

    image.addEventListener('zoom', (event) => {
      expect(event.type).to.equal('zoom');
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
      viewer.zoomTo(1);
    });

    image.addEventListener('zoom', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('ratio', 'oldRatio', 'originalEvent');
      expect(detail.ratio).to.be.a('number');
      expect(detail.oldRatio).to.be.a('number');
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `zoomed` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.zoomTo(1);
    });

    image.addEventListener('zoom', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('zoomed', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `zoom` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.zoomTo(1);
    });

    image.addEventListener('zoom', (event) => {
      expect(event.type).to.equal('zoom');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });
});
