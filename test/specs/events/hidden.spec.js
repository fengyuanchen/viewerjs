describe('hidden (event)', () => {
  it('should trigger the `hidden` event', (done) => {
    const image = window.createImage();

    image.addEventListener('hidden', (event) => {
      expect(event.type).to.equal('hidden');
      done();
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },
    });

    viewer.show();
  });

  it('should not trigger the `hidden` event in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('hidden', () => {
      expect.fail(1, 0);
    });

    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        viewer.hide(true);
        done();
      },
    });
  });

  it('should not cancel the `hidden` event', (done) => {
    const image = window.createImage();

    image.addEventListener('hidden', (event) => {
      expect(event.defaultPrevented).to.false;
      event.preventDefault();
      expect(event.defaultPrevented).to.false;
      done();
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },
    });

    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();

    image.addEventListener('hidden', (event) => {
      const { detail } = event;

      expect(detail).to.be.an('object').that.has.all.keys('originalEvent');
      expect(detail.originalEvent).to.be.null;
      done();
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide(true);
      },
    });

    viewer.show();
  });

  it('should pass the original event to `event.detail.originalEvent` when triggered by a click', (done) => {
    const image = window.createImage();

    image.addEventListener('hidden', (event) => {
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
