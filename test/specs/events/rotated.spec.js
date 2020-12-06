describe('rotated (event)', () => {
  it('should trigger the `rotated` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotated', (event) => {
      expect(event.type).to.equal('rotated');
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

    image.addEventListener('rotated', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('degree', 'oldDegree');
      expect(detail.degree).to.be.a('number');
      expect(detail.oldDegree).to.be.a('number');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `rotated` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotated', (event) => {
      expect(event.type).to.equal('rotated');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });

  it('should not cancel the `rotated` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.rotateTo(45);
    });

    image.addEventListener('rotated', (event) => {
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
