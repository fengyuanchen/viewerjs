describe('scale (event)', () => {
  it('should trigger the `scale` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scale', (event) => {
      expect(event.type).to.equal('scale');
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
      viewer.scale(-1);
    });

    image.addEventListener('scale', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('scaleX', 'scaleY', 'oldScaleX', 'oldScaleY');
      expect(detail.scaleX).to.be.a('number');
      expect(detail.scaleY).to.be.a('number');
      expect(detail.oldScaleX).to.be.a('number');
      expect(detail.oldScaleY).to.be.a('number');
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `scaled` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scale', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('scaled', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `scale` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scale', (event) => {
      expect(event.type).to.equal('scale');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });
});
