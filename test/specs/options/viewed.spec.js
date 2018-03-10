describe('viewed (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.viewed).to.be.null;
  });

  it('should execute the `viewed` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed(event) {
        expect(event.type).to.equal('viewed');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed(event) {
        expect(event.detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage');
        expect(event.detail.image.src).to.equal(image.src);
        expect(event.detail.index).to.equal(0);
        expect(event.detail.originalImage).to.equal(image);
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `viewed` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed(event) {
        expect(event.type).to.equal('viewed');
        done();
      },
    });
  });
});
