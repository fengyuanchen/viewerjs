describe('prev (method)', () => {
  it('should view the previous image', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            done();
            break;

          case 1:
            viewer.prev();
            break;

          default:
        }
      },
    });

    viewer.view(1);
  });

  it('should not work when the current image already is the first one', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.prev();
            setTimeout(() => {
              viewer.hide(true);
              done();
            }, 500);
            break;

          case 3:
            expect.fail(1, 0);
            break;

          default:
        }
      },
    });

    viewer.show();
  });

  it('should work when the current image is the first one and the first argument is set to `true`', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.prev(true);
            break;

          case 4:
            viewer.hide(true);
            done();
            break;

          default:
        }
      },
    });

    viewer.show();
  });

  it('should work in inline mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.view(2);
            break;

          case 1:
            done();
            break;

          case 2:
            viewer.prev();
            break;

          default:
        }
      },
    });
  });
});
