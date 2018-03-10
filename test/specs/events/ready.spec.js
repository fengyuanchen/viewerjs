describe('ready (event)', () => {
  it('should not trigger the `ready` event by default', () => {
    const image = window.createImage();

    image.addEventListener('ready', () => {
      expect.fail(1, 0);
    });

    new Viewer(image);
  });

  it('should trigger the `ready` event when show the viewer', (done) => {
    const image = window.createImage();

    image.addEventListener('ready', (event) => {
      expect(event.type).to.equal('ready');
      event.preventDefault();
      done();
    });

    const viewer = new Viewer(image);

    viewer.show();
  });

  it('should trigger the `ready` event immediately in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('ready', (event) => {
      expect(event.type).to.equal('ready');
      done();
    });

    new Viewer(image, {
      inline: true,
    });
  });
});
