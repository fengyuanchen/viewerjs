describe('slideOnTouch (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.slideOnTouch).to.be.true;
  });

  it('should switch images after a touch gesture moves over half the viewer width', (done) => {
    const imageList = window.createImageList();
    let viewer;
    let viewed = 0;

    imageList.addEventListener('viewed', (event) => {
      viewed += 1;

      if (viewed === 1) {
        const { width } = viewer.viewerData;

        viewer.image.dispatchEvent(window.createEvent('pointerdown', {
          pointerId: 1,
          pointerType: 'touch',
          pageX: width,
          pageY: 0,
        }));
        viewer.image.dispatchEvent(window.createEvent('pointermove', {
          pointerId: 1,
          pointerType: 'touch',
          pageX: 0,
          pageY: 0,
        }));
        expect(viewer.index).to.equal(0);
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

  it('should restore the image position after a short touch gesture', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', () => {
      const { x, y } = viewer.imageData;
      const { width } = viewer.viewerData;

      viewer.image.dispatchEvent(window.createEvent('pointerdown', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: width / 2,
        pageY: 0,
      }));
      viewer.image.dispatchEvent(window.createEvent('pointermove', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      expect(viewer.imageData.x).to.not.equal(x);
      viewer.image.dispatchEvent(window.createEvent('pointerup', {
        pointerId: 1,
        pointerType: 'touch',
        pageX: 0,
        pageY: 0,
      }));
      expect(viewer.index).to.equal(0);
      expect(viewer.imageData.x).to.equal(x);
      expect(viewer.imageData.y).to.equal(y);
      viewer.hide(true);
      done();
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
