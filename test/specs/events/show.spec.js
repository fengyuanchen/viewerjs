describe('show (event)', () => {
  it('should trigger the `show` event', (done) => {
    const image = window.createImage();

    image.addEventListener('show', (event) => {
      expect(event.type).to.equal('show');
      event.preventDefault();
      done();
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should not trigger the `shown` event when default prevented', (done) => {
    const image = window.createImage();

    image.addEventListener('show', (event) => {
      event.preventDefault();
      done();
    });

    image.addEventListener('shown', () => {
      expect.fail(1, 0);
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should not trigger the `show` event in inline mode', () => {
    const image = window.createImage();

    image.addEventListener('show', () => {
      expect.fail(1, 0);
    });

    new Viewer(image, {
      inline: true,
    });
  });
});
