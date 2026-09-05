describe('rotateOnGesture (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.rotateOnGesture).to.be.true;
  });

  it('should rotate from a Safari gesture', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        rotation: 0,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        rotation: 30,
      }));
    });

    image.addEventListener('rotate', (event) => {
      expect(event.detail.degree).to.equal(30);
    });

    image.addEventListener('rotated', () => {
      expect(viewer.imageData.rotate).to.equal(30);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should zoom and rotate from a Safari gesture', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        scale: 1,
        rotation: 0,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        scale: 1.2,
        rotation: 30,
      }));
    });

    image.addEventListener('rotate', (event) => {
      expect(event.detail.degree).to.equal(30);
    });

    image.addEventListener('rotated', () => {
      expect(viewer.imageData.rotate).to.equal(30);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not rotate from a Safari gesture when disabled', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.viewer.dispatchEvent(window.createEvent('gesturestart', {
        rotation: 0,
      }));
      viewer.viewer.dispatchEvent(window.createEvent('gesturechange', {
        rotation: 30,
      }));
      viewer.hide(true);
      done();
    });

    image.addEventListener('rotate', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image, {
      rotateOnGesture: false,
    });
    viewer.show();
  });
});
