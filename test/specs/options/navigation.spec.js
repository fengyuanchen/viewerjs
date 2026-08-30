describe('navigation (option)', () => {
  it('should not show navigation buttons by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(window.getComputedStyle(viewer.navigation).display).to.equal('none');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.navigation).to.be.false;
    viewer.show();
  });

  it('should show navigation buttons and view the next image', (done) => {
    const imageList = window.createImageList();
    let viewed = 0;
    const viewer = new Viewer(imageList, {
      navigation: true,

      viewed(event) {
        viewed += 1;

        if (viewed === 1) {
          expect(window.getComputedStyle(viewer.navigation).display).to.not.equal('none');
          viewer.navigation.querySelector('.viewer-next').click();
        } else {
          expect(event.detail.index).to.equal(1);
          viewer.hide(true);
          done();
        }
      },
    });

    viewer.show();
  });

  it('should customize navigation buttons', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      navigation: {
        prev: {
          size: 'large',
        },
        next: {
          show: false,
          size: 'small',
        },
      },

      viewed() {
        const prev = viewer.navigation.querySelector('.viewer-prev');
        const next = viewer.navigation.querySelector('.viewer-next');

        expect(prev.className).to.include('viewer-large');
        expect(next.className).to.include('viewer-hide');
        expect(next.className).to.include('viewer-small');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should view the previous image from the navigation button', (done) => {
    const imageList = window.createImageList();
    let viewed = 0;
    const viewer = new Viewer(imageList, {
      initialViewIndex: 1,
      navigation: true,

      viewed(event) {
        viewed += 1;

        if (viewed === 1) {
          viewer.navigation.querySelector('.viewer-prev').click();
        } else {
          expect(event.detail.index).to.equal(0);
          viewer.hide(true);
          done();
        }
      },
    });

    viewer.show();
  });
});
