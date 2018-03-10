describe('viewed (event)', () => {
  it('should trigger the `viewed` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', (event) => {
      expect(event.type).to.equal('viewed');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage');
      expect(detail.image.src).to.equal(image.src);
      expect(detail.index).to.equal(0);
      expect(detail.originalImage).to.equal(image);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `viewed` event in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('viewed', (event) => {
      expect(event.type).to.equal('viewed');
      done();
    });

    new Viewer(image, {
      inline: true,
    });
  });
});
