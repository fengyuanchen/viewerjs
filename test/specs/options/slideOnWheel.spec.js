describe('slideOnWheel (option)', () => {
  it('should be `true` by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.slideOnWheel).to.be.true;
  });

  it('should slide to the next image from a wheel event over the navbar', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', (event) => {
      if (event.detail.index === 0) {
        viewer.navbar.dispatchEvent(window.createEvent('wheel', {
          deltaY: 1,
        }));
      } else {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      }
    });

    viewer = new Viewer(imageList);
    viewer.view(0);
  });

  it('should slide to the previous image from a wheel event over the navbar', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', (event) => {
      if (event.detail.index === 1) {
        viewer.navbar.dispatchEvent(window.createEvent('wheel', {
          deltaY: -1,
        }));
      } else {
        expect(event.detail.index).to.equal(0);
        viewer.hide(true);
        done();
      }
    });

    viewer = new Viewer(imageList);
    viewer.view(1);
  });

  it('should slide instead of zoom over the canvas when zoomable is disabled', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', (event) => {
      if (event.detail.index === 0) {
        viewer.canvas.dispatchEvent(window.createEvent('wheel', {
          deltaY: 1,
        }));
      } else {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      }
    });

    viewer = new Viewer(imageList, {
      zoomable: false,
    });
    viewer.view(0);
  });

  it('should not slide from a wheel event when disabled', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', (event) => {
      if (event.detail.index === 0) {
        viewer.navbar.dispatchEvent(window.createEvent('wheel', {
          deltaY: 1,
        }));
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 500);
      } else {
        expect.fail(1, 0);
      }
    });

    viewer = new Viewer(imageList, {
      slideOnWheel: false,
    });
    viewer.view(0);
  });

  it('should slide from a wheel event only when the required modifier key is pressed', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('viewed', (event) => {
      if (event.detail.index === 0) {
        viewer.navbar.dispatchEvent(window.createEvent('wheel', {
          deltaY: 1,
        }));

        setTimeout(() => {
          expect(viewer.index).to.equal(0);

          viewer.navbar.dispatchEvent(window.createEvent('wheel', {
            deltaY: 1,
            ctrlKey: true,
          }));
        }, 500);
      } else {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      }
    });

    viewer = new Viewer(imageList, {
      slideOnWheel: 'ctrl',
    });
    viewer.view(0);
  });
});
