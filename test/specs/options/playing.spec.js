describe('playing (option)', () => {
  it('should be null by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.playing).to.be.null;
  });

  it('should execute the `playing` hook function', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
      },

      playing(event) {
        expect(event.type).to.equal('playing');
        done();
        setTimeout(() => {
          viewer.stop();
          viewer.hide(true);
        }, 0);
      },
    });

    viewer.show();
  });

  it('should not switch image when default prevented in `playing` hook function', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
      },
      playing(event) {
        event.preventDefault();
        const activeImages = viewer.player.querySelectorAll('.viewer-in');

        expect(activeImages.length).to.equal(1);
        expect(activeImages[0].src).to.equal(viewer.images[0].src);
        done();
        setTimeout(() => {
          viewer.stop();
          viewer.hide(true);
        }, 0);
      },
    });

    viewer.show();
  });
});
