describe('shown (event)', () => {
  it('should trigger the `shown` event', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('shown', (event) => {
      expect(event.type).to.equal('shown');
      done();
      event.preventDefault();
      viewer.hide(true);
    });

    viewer = new Viewer(image);
    viewer.show();
  });

  it('should not trigger the `shown` event in inline mode', () => {
    const image = window.createImage();

    image.addEventListener('shown', () => {
      expect.fail(1, 0);
    });

    new Viewer(image, {
      inline: true,
    });
  });
});
