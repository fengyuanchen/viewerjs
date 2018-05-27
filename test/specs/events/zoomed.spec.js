describe('zoomed (event)', () => {
  it('should trigger the `zoomed` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.zoomTo(1);
    });

    image.addEventListener('zoomed', (event) => {
      expect(event.type).to.equal('zoomed');
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

    image.addEventListener('zoomed', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('ratio', 'oldRatio', 'originalEvent');
      expect(detail.ratio).to.be.a('number');
      expect(detail.oldRatio).to.be.a('number');
      expect(detail.originalEvent).to.be.null;
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should trigger the `zoomed` event in inline mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.zoomTo(1);
    });

    image.addEventListener('zoomed', (event) => {
      expect(event.type).to.equal('zoomed');
      done();
    });

    viewer = new Viewer(image, {
      inline: true,
    });
  });
});
