describe('hide (event)', () => {
  it('should trigger the `hide` event', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', (event) => {
      expect(event.type).to.equal('hide');
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should stop hiding when destroyed in the `hide` callback', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      hide() {
        viewer.destroy();
      },

      shown() {
        viewer.hide();

        expect(viewer.destroyed).to.be.true;
        expect(viewer.hiding).to.be.false;
        expect(viewer.viewer.parentNode).to.be.null;
        done();
      },
    });

    viewer.show();
  });

  it('should not trigger the `hidden` event when default prevented', (done) => {
    const image = window.createImage();
    let count = 0;
    let viewer;

    image.addEventListener('hide', (event) => {
      count += 1;

      if (count === 1) {
        event.preventDefault();
        viewer.hide(true);
        done();
      }
    });

    image.addEventListener('hidden', () => {
      if (count === 1) {
        expect.fail(1, 0);
      }
    });

    viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },
    });

    viewer.show();
  });

  it('should not trigger the `hide` event in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', () => {
      expect.fail(1, 0);
    });

    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.hide(true);
        done();
      },
    });
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('originalEvent');
      expect(detail.originalEvent).to.be.null;
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', (event) => {
      expect(event.detail.originalEvent).to.be.an.instanceOf(window.MouseEvent);
      done();
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.button.click();
      },
    });

    viewer.show();
  });
});
