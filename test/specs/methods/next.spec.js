describe('next (method)', () => {
  it('should view the next image', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.next();
            break;

          case 1:
            viewer.hide(true);
            done();
            break;

          default:
        }
      },
    });

    viewer.show();
  });

  it('should not work when the current image already is the last one', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            expect.fail(1, 0);
            break;

          case 4:
            viewer.next();
            setTimeout(() => {
              viewer.hide(true);
              done();
            }, 500);
            break;

          default:
        }
      },
    });

    viewer.view(4);
  });

  it('should work when the current image is the last one and the first argument is set to `true`', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.hide(true);
            done();
            break;

          case 4:
            viewer.next(true);
            break;

          default:
        }
      },
    });

    viewer.view(4);
  });

  it('should work in inline mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.next();
            break;

          case 1:
            done();
            break;

          default:
        }
      },
    });
  });
});
