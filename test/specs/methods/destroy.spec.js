describe('destroy (method)', () => {
  it('should destroy before ready', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      ready() {
        expect.fail(1, 0);
      },
    });

    viewer.show();
    expect(image.viewer).to.be.an.instanceof(Viewer);
    viewer.destroy();
    expect(image.viewer).to.be.undefined;
  });

  it('should destroy after ready', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      ready() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });
});
