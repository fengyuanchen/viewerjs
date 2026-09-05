describe('zoomOnGesture (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomOnGesture).to.be.true;
  });

  it('should zoom from a Safari gesture', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        scale: 1,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        scale: 1.2,
      }));
    });

    image.addEventListener('zoom', (event) => {
      expect(event.detail.originalEvent.type).to.equal('gesturechange');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should zoom from a Safari gesture when zoomOnTouch is disabled', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', { scale: 1 }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', { scale: 1.2 }));
    });

    image.addEventListener('zoom', (event) => {
      expect(event.detail.originalEvent.type).to.equal('gesturechange');
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image, {
      zoomOnTouch: false,
    });
    viewer.show();
  });

  it('should ignore a Safari gesture without scale change', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        scale: 1,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        scale: 1,
      }));
      viewer.hide(true);
      done();
    });

    image.addEventListener('zoom', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not zoom from a Safari gesture when disabled', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        scale: 1,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        scale: 1.2,
      }));
      viewer.hide(true);
      done();
    });

    image.addEventListener('zoom', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image, {
      zoomOnGesture: false,
    });
    viewer.show();
  });

  it('should not zoom twice when a Safari gesture also triggers a wheel event', (done) => {
    const image = window.createImage();
    let viewer;
    let zoomCount = 0;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        scale: 1,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('wheel', {
        deltaY: -100,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        scale: 1.2,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gestureend', {
        scale: 1.2,
      }));
    });

    image.addEventListener('zoom', () => {
      zoomCount += 1;
    });

    image.addEventListener('zoomed', () => {
      expect(zoomCount).to.equal(1);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
