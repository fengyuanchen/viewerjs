describe('ResizeObserver (inline mode)', () => {
  it('should create parentResizeObserver in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(viewer.parentResizeObserver).to.be.an.instanceof(ResizeObserver);
        done();
      },
    });
  });

  it('should not create parentResizeObserver in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.parentResizeObserver).to.be.undefined;
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should update viewerData when parent container resizes', (done) => {
    const container = window.createContainer();
    const image = document.createElement('img');

    image.src = '/base/docs/images/tibet-1.jpg';
    container.appendChild(image);

    container.style.width = '400px';
    container.style.height = '300px';

    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        const initialWidth = viewer.viewerData.width;
        const initialHeight = viewer.viewerData.height;

        expect(initialWidth).to.equal(400);
        expect(initialHeight).to.equal(300);

        container.style.width = '600px';
        container.style.height = '500px';

        setTimeout(() => {
          expect(viewer.viewerData.width).to.equal(600);
          expect(viewer.viewerData.height).to.equal(500);
          done();
        }, 100);
      },
    });
  });

  it('should respect minWidth and minHeight when resizing', (done) => {
    const container = window.createContainer();
    const image = document.createElement('img');

    image.src = '/base/docs/images/tibet-1.jpg';
    container.appendChild(image);

    container.style.width = '400px';
    container.style.height = '300px';

    const viewer = new Viewer(image, {
      inline: true,
      minWidth: 500,
      minHeight: 400,

      ready() {
        expect(viewer.viewerData.width).to.equal(500);
        expect(viewer.viewerData.height).to.equal(400);

        container.style.width = '300px';
        container.style.height = '200px';

        setTimeout(() => {
          expect(viewer.viewerData.width).to.equal(500);
          expect(viewer.viewerData.height).to.equal(400);
          done();
        }, 100);
      },
    });
  });

  it('should clean up parentResizeObserver on destroy', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(viewer.parentResizeObserver).to.be.an.instanceof(ResizeObserver);
        viewer.destroy();
        expect(viewer.parentResizeObserver).to.be.null;
        done();
      },
    });
  });

  it('should handle multiple resize events', (done) => {
    const container = window.createContainer();
    const image = document.createElement('img');

    image.src = '/base/docs/images/tibet-1.jpg';
    container.appendChild(image);

    container.style.width = '400px';
    container.style.height = '300px';

    let resizeCount = 0;
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        const originalRenderViewer = viewer.renderViewer.bind(viewer);
        viewer.renderViewer = function () {
          resizeCount += 1;
          return originalRenderViewer();
        };

        container.style.width = '500px';

        setTimeout(() => {
          container.style.height = '400px';

          setTimeout(() => {
            container.style.width = '600px';
            container.style.height = '500px';

            setTimeout(() => {
              expect(resizeCount).to.be.at.least(2);
              done();
            }, 100);
          }, 50);
        }, 50);
      },
    });
  });

  it('should re-render image when container resizes and image is viewed', (done) => {
    const container = window.createContainer();
    const image = document.createElement('img');

    image.src = '/base/docs/images/tibet-1.jpg';
    container.appendChild(image);

    container.style.width = '400px';
    container.style.height = '300px';

    let initImageCalled = false;
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        const originalInitImage = viewer.initImage.bind(viewer);
        viewer.initImage = function (callback) {
          initImageCalled = true;
          return originalInitImage(callback);
        };

        container.style.width = '600px';
        container.style.height = '500px';

        setTimeout(() => {
          expect(initImageCalled).to.be.true;
          done();
        }, 100);
      },
    });
  });
});
