describe('zoomOnWheel (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomOnWheel).to.be.true;
  });

  it('should zoom from a wheel event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.canvas.dispatchEvent(window.createEvent('wheel', {
        deltaY: -1,
      }));
    });

    image.addEventListener('zoom', (event) => {
      expect(event.detail.originalEvent.type).to.equal('wheel');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not zoom from a wheel event when disabled', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.canvas.dispatchEvent(window.createEvent('wheel', {
        deltaY: -1,
      }));
      expect(viewer.imageData.ratio).to.equal(viewer.initialImageData.ratio);
      viewer.hide(true);
      done();
    });

    image.addEventListener('zoom', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image, {
      zoomOnWheel: false,
    });
    viewer.show();
  });

  it('should zoom from a wheel event only when the required modifier key is pressed', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.canvas.dispatchEvent(window.createEvent('wheel', {
        deltaY: -1,
      }));
      expect(viewer.imageData.ratio).to.equal(viewer.initialImageData.ratio);

      viewer.canvas.dispatchEvent(window.createEvent('wheel', {
        deltaY: -1,
        ctrlKey: true,
      }));
    });

    image.addEventListener('zoom', (event) => {
      expect(event.detail.originalEvent.ctrlKey).to.be.true;
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image, {
      zoomOnWheel: 'ctrl',
    });
    viewer.show();
  });
});
