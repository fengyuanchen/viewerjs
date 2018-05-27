describe('view (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.view).to.be.null;
  });

  it('should execute the `view` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      view(event) {
        expect(event.type).to.equal('view');
      },

      viewed() {
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      view(event) {
        expect(event.detail).to.be.an('object').that.has.all.keys('image', 'index', 'originalImage');
        expect(event.detail.image.src).to.equal(image.src);
        expect(event.detail.index).to.equal(0);
        expect(event.detail.originalImage).to.equal(image);
      },

      viewed() {
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `viewed` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      view(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      viewed() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `view` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      view(event) {
        expect(event.type).to.equal('view');
        done();
      },
    });
  });
});
