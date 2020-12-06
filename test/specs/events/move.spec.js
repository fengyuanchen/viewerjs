describe('move (event)', () => {
  it('should trigger the `move` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('move', (event) => {
      expect(event.type).to.equal('move');
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
      viewer.moveTo(0);
    });

    image.addEventListener('move', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('x', 'y', 'oldX', 'oldY', 'originalEvent');
      expect(detail.x).to.be.a('number');
      expect(detail.y).to.be.a('number');
      expect(detail.oldX).to.be.a('number');
      expect(detail.oldY).to.be.a('number');
      expect(detail.originalEvent).to.be.null;
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `moved` event when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('move', (event) => {
      event.preventDefault();
      viewer.hide(true);
      done();
    });

    image.addEventListener('moved', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `move` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.moveTo(0);
    });

    image.addEventListener('move', (event) => {
      expect(event.type).to.equal('move');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });
});
