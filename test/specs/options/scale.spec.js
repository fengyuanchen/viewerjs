describe('scale (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.scale).to.be.null;
  });

  it('should execute the `scale` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.scale(-1);
      },

      scale(event) {
        expect(event.type).to.equal('scale');
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should have expected properties in `event.detail`', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.scale(-1);
      },

      scale(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('scaleX', 'scaleY', 'oldScaleX', 'oldScaleY');
        expect(detail.scaleX).to.be.a('number');
        expect(detail.scaleY).to.be.a('number');
        expect(detail.oldScaleX).to.be.a('number');
        expect(detail.oldScaleY).to.be.a('number');
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `scaled` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.scale(-1);
      },

      scale(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      scaled() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `scale` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.scale(-1);
      },

      scale(event) {
        expect(event.type).to.equal('scale');
        done();
      },
    });
  });
});
