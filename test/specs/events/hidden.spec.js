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
});
