describe('rotateOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.rotateOnTouch).to.be.true;
  });

  it('should rotate from a two-pointer gesture', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 20,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 0,
        pageY: 20,
      }));
      expect(viewer.imageData.rotate).to.equal(90);
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 2,
        pointerType: 'touch',
      }));
      expect(viewer.imageData.rotate).to.equal(90);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should restore a zero-degree image after rotating within 45 degrees', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 20,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 19.92,
        pageY: 1.74,
      }));
      expect(viewer.imageData.rotate).to.be.closeTo(5, 0.1);
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 2,
        pointerType: 'touch',
      }));
      expect(viewer.imageData.rotate).to.equal(0);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should rotate immediately when the image is already rotated', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.imageData.rotate = 15;
      viewer.renderImage();
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 20,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 19.92,
        pageY: 1.74,
      }));
      expect(viewer.imageData.rotate).to.be.closeTo(20, 0.1);
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 2,
        pointerType: 'touch',
      }));
      expect(viewer.imageData.rotate).to.be.closeTo(20, 0.1);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not rotate from a two-pointer gesture when disabled', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 20,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 2,
        pointerType: 'touch',
        pageX: 0,
        pageY: 20,
      }));
      expect(viewer.imageData.rotate).to.equal(0);
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 2,
        pointerType: 'touch',
      }));
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image, {
      rotateOnTouch: false,
      zoomOnTouch: false,
    });
    viewer.show();
  });
});
