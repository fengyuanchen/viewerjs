describe('keyboard (option)', () => {
  it('should be enabled by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.keyboard).to.be.true;
  });

  it('should be disabled', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      keyboard: false,

      viewed() {
        expect(viewer.isShown).to.be.true;
        image.dispatchEvent(window.createEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
        }));
        expect(viewer.isShown).to.be.true;
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.keyboard).to.be.false;
    viewer.show();
  });

  it('should hide the viewer when press the "Escape" key in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        image.dispatchEvent(window.createEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
        }));
      },

      hide() {
        done();
      },
    });

    viewer.show();
  });

  it('should exit modal mode when press the "Escape" key in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.full();
        expect(viewer.fulled).to.be.true;
        image.dispatchEvent(window.createEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
        }));
        expect(viewer.fulled).to.be.false;
        done();
      },
    });
  });

  it('should stop playing when press the "Escape" key in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.play();
        expect(viewer.played).to.be.true;
        image.dispatchEvent(window.createEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
        }));
        expect(viewer.played).to.be.false;
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should stop playing when press the "Space bar" key in modal mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
        expect(viewer.played).to.be.true;
        imageList.dispatchEvent(window.createEvent('keydown', {
          key: ' ',
          keyCode: 32,
        }));
        expect(viewer.played).to.be.false;
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should view the previous image when press the "ArrowLeft" key in modal mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.hide(true);
            done();
            break;

          case 1: {
            imageList.dispatchEvent(window.createEvent('keydown', {
              key: 'ArrowLeft',
              keyCode: 37,
            }));
            break;
          }

          default:
        }
      },
    });

    viewer.view(1);
  });

  it('should view the next image when press the "ArrowRight" key in modal mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        switch (event.detail.index) {
          case 0: {
            imageList.dispatchEvent(window.createEvent('keydown', {
              key: 'ArrowRight',
              keyCode: 39,
            }));
            break;
          }

          case 1:
            viewer.hide(true);
            done();
            break;

          default:
        }
      },
    });

    viewer.view(0);
  });

  it('should zoom in when press the "ArrowUp" key in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        const { ratio } = viewer.imageData;

        image.dispatchEvent(window.createEvent('keydown', {
          key: 'ArrowUp',
          keyCode: 38,
        }));
        expect(viewer.imageData.ratio).to.be.above(ratio);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should zoom out when press the "ArrowDown" key in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        const { ratio } = viewer.imageData;

        image.dispatchEvent(window.createEvent('keydown', {
          key: 'ArrowDown',
          keyCode: 40,
        }));
        expect(viewer.imageData.ratio).to.be.below(ratio);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should zoom out to initial size when press `Ctrl + 0` in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        const { imageData } = viewer;
        const { ratio } = imageData;

        viewer.zoomTo(1);
        expect(imageData.ratio).to.not.equal(ratio);
        image.dispatchEvent(window.createEvent('keydown', {
          ctrlKey: true,
          key: '0',
          keyCode: 48,
        }));
        expect(imageData.ratio).to.equal(ratio);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should zoom out in to natural size when press `Ctrl + 1` in modal mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        const { imageData } = viewer;

        expect(imageData.ratio).to.not.equal(1);
        image.dispatchEvent(window.createEvent('keydown', {
          ctrlKey: true,
          key: '1',
          keyCode: 49,
        }));
        expect(imageData.ratio).to.equal(1);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
