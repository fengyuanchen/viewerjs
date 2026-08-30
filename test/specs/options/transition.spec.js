describe('transition (option)', () => {
  it('should be enabled by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(viewer.viewer.className).to.include('viewer-transition');
        expect(viewer.list.className).to.include('viewer-transition');
        expect(viewer.image.className).to.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.transition).to.be.true;
    viewer.show();
  });

  it('should be disabled', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: false,

      viewed() {
        expect(viewer.viewer.className).to.not.include('viewer-transition');
        expect(viewer.list.className).to.not.include('viewer-transition');
        expect(viewer.image.className).to.not.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.transition).to.be.false;
    viewer.show();
  });

  it('should disable the transition when showing the viewer', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        show: false,
      },

      shown() {
        expect(viewer.viewer.className).to.not.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should disable the transition when hiding the viewer', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        hide: false,
      },

      shown() {
        viewer.hide();
        expect(viewer.isShown).to.be.false;
        done();
      },
    });

    viewer.show();
  });

  it('should disable the transition when viewing an image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        view: false,
      },

      viewed() {
        expect(viewer.image.className).to.not.include('viewer-transition');

        setTimeout(() => {
          expect(viewer.image.className).to.include('viewer-transition');
          viewer.hide(true);
          done();
        }, 350);
      },
    });

    viewer.show();
  });

  it('should disable the transition when moving an image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        move: false,
      },

      viewed() {
        setTimeout(() => {
          expect(viewer.image.className).to.include('viewer-transition');
          viewer.move(1);
          expect(viewer.image.className).to.not.include('viewer-transition');
          viewer.hide(true);
          done();
        }, 350);
      },
    });

    viewer.show();
  });

  it('should disable the transition when zooming an image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        zoom: false,
      },

      viewed() {
        setTimeout(() => {
          viewer.zoom(0.1);
          expect(viewer.image.className).to.not.include('viewer-transition');
          viewer.hide(true);
          done();
        }, 350);
      },
    });

    viewer.show();
  });

  it('should disable the transition when rotating an image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        rotate: false,
      },

      viewed() {
        setTimeout(() => {
          viewer.rotate(90);
          expect(viewer.image.className).to.not.include('viewer-transition');
          viewer.hide(true);
          done();
        }, 350);
      },
    });

    viewer.show();
  });

  it('should disable the transition when scaling an image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        scale: false,
      },

      viewed() {
        setTimeout(() => {
          viewer.scale(-1);
          expect(viewer.image.className).to.not.include('viewer-transition');
          viewer.hide(true);
          done();
        }, 350);
      },
    });

    viewer.show();
  });

  it('should disable the transition when playing images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      transition: {
        play: false,
      },

      viewed() {
        viewer.play();
        expect(viewer.player.querySelector('img').className).to.not.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should disable the transition when showing a tooltip', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      transition: {
        tooltip: false,
      },

      viewed() {
        viewer.tooltip();
        expect(viewer.tooltipBox.className).to.not.include('viewer-transition');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
