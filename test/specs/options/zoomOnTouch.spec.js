describe('zoomOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomOnTouch).to.be.true;
  });

  it('should zoom from a two-pointer gesture', (done) => {
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
        pageX: 40,
        pageY: 0,
      }));
    });

    image.addEventListener('zoom', (event) => {
      expect(event.detail.originalEvent.type).to.equal('pointermove');
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

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not zoom from a two-pointer gesture when disabled', (done) => {
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
        pageX: 40,
        pageY: 0,
      }));
      expect(viewer.action).to.equal('switch');
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

    image.addEventListener('zoom', () => {
      expect.fail(1, 0);
    });

    viewer = new Viewer(image, {
      zoomOnTouch: false,
    });
    viewer.show();
  });
});
