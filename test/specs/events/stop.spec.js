describe('stop (event)', () => {
  it('should trigger the `stop` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        expect(viewer.played).to.true;
        viewer.stop();
        expect(viewer.played).to.false;
        done();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not stop when default prevented', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        expect(viewer.played).to.true;
        viewer.stop();
        expect(viewer.played).to.true;
        done();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.type).to.equal('stop');
      event.preventDefault();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        viewer.stop();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('originalEvent');
      expect(detail.originalEvent).to.be.null;
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      viewer.play();
      setTimeout(() => {
        viewer.player.click();
      }, 500);
    });

    image.addEventListener('stop', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      done();
    });

    viewer = new Viewer(image);
    viewer.show();
  });
});
