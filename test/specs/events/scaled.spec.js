describe('scaled (event)', () => {
  it('should trigger the `scaled` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scaled', (event) => {
      expect(event.type).to.equal('scaled');
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

    image.addEventListener('scaled', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('scaleX', 'scaleY', 'oldScaleX', 'oldScaleY');
      expect(detail.scaleX).to.be.a('number');
      expect(detail.scaleY).to.be.a('number');
      expect(detail.oldScaleX).to.be.a('number');
      expect(detail.oldScaleY).to.be.a('number');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `scaled` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scaled', (event) => {
      expect(event.type).to.equal('scaled');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });

  it('should not cancel the `scaled` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.scale(-1);
    });

    image.addEventListener('scaled', (event) => {
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
