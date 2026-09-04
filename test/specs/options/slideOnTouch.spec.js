describe('slideOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.slideOnTouch).to.be.true;
  });

  it('should switch images from a touch gesture', (done) => {
    const imageList = window.createImageList();
    let viewer;
    let viewed = 0;

    imageList.addEventListener('viewed', (event) => {
      viewed += 1;

      if (viewed === 1) {
        viewer.image.dispatchEvent(window.createEvent('pointerdown', {
          pointerId: 1,
          pointerType: 'touch',
          pageX: 100,
          pageY: 0,
        }));
        viewer.image.dispatchEvent(window.createEvent('pointermove', {
          pointerId: 1,
          pointerType: 'touch',
          pageX: 0,
          pageY: 0,
        }));
        viewer.image.dispatchEvent(window.createEvent('pointerup', {
          pointerId: 1,
          pointerType: 'touch',
          pageX: 0,
          pageY: 0,
        }));
      } else {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      }
    });

    viewer = new Viewer(imageList);
    viewer.show();
  });

  it('should not switch images from a touch gesture when disabled', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', () => {
      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 100,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      expect(viewer.index).to.equal(0);
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(imageList, {
      slideOnTouch: false,
    });
    viewer.show();
  });
});
