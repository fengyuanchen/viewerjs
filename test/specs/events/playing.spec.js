describe('playing (event)', () => {
  it('should trigger the `playing` event', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('playing', (event) => {
      expect(event.type).to.equal('playing');
      done();
      setTimeout(() => {
        viewer.stop();
        viewer.hide(true);
      }, 0);
    });

    viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
      },
    });

    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('playing', (event) => {
      const { detail } = event;
      const images = imageList.querySelectorAll('img');

      expect(detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage', 'originalEvent');
      expect(detail.index).to.equal(1);
      expect(detail.image).to.be.an.instanceOf(HTMLImageElement);
      expect(detail.originalImage).to.equal(images[1]);
      expect(detail.originalEvent).to.be.null;
      done();
      setTimeout(() => {
        viewer.stop();
        viewer.hide(true);
      }, 0);
    });

    viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
      },
    });

    viewer.show();
  });

  it('should not switch image when default prevented', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('playing', (event) => {
      event.preventDefault();

      const activeImages = viewer.player.querySelectorAll('.viewer-in');

      expect(activeImages.length).to.equal(1);
      expect(activeImages[0].src).to.equal(viewer.images[0].src);
      done();
      setTimeout(() => {
        viewer.stop();
        viewer.hide(true);
      }, 0);
    });

    viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
      },
    });

    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a keyboard event', (done) => {
    const imageList = window.createImageList();
    let viewer;

    imageList.addEventListener('playing', (event) => {
      expect(event.detail.originalEvent.type).to.be.equal('keydown');
      done();
      setTimeout(() => {
        viewer.stop();
        viewer.hide(true);
      }, 0);
    });

    viewer = new Viewer(imageList, {
      autoplay: false,
      viewed() {
        viewer.play();
        document.dispatchEvent(window.createEvent('keydown', {
          key: 'ArrowRight',
          keyCode: 39,
        }));
      },
    });

    viewer.show();
  });
});
