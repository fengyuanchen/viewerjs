describe('moved (event)', () => {
  it('should trigger the `moved` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('moved', (event) => {
      expect(event.type).to.equal('moved');
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
      viewer.moveTo(0);
    });

    image.addEventListener('moved', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('x', 'y', 'oldX', 'oldY', 'originalEvent');
      expect(detail.x).to.be.a('number');
      expect(detail.y).to.be.a('number');
      expect(detail.oldX).to.be.a('number');
      expect(detail.oldY).to.be.a('number');
      expect(detail.originalEvent).to.be.null;
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `moved` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('moved', (event) => {
      expect(event.type).to.equal('moved');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });

  it('should not cancel the `moved` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('moved', (event) => {
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
