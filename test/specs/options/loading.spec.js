describe('loading (option)', () => {
  it('should show a loading spinner when load image by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      view() {
        setTimeout(() => {
          if (!viewer.image.complete) {
            expect(viewer.canvas.className).to.include('viewer-loading');
          }

          done();
        }, 0);
      },
    });

    expect(viewer.options.loading).to.be.true;
  });

  it('should not show a loading spinner when load image', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      loading: false,

      view() {
        setTimeout(() => {
          expect(viewer.canvas.className).to.not.include('viewer-loading');
          done();
        }, 0);
      },
    });

    expect(viewer.options.loading).to.be.false;
  });
});
