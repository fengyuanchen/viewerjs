describe('zoom (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoom).to.be.null;
  });

  it('should execute the `zoom` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.zoomTo(1);
      },

      zoom(event) {
        expect(event.type).to.equal('zoom');
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
        viewer.zoomTo(1);
      },

      zoom(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('ratio', 'oldRatio', 'originalEvent');
        expect(detail.ratio).to.be.a('number');
        expect(detail.oldRatio).to.be.a('number');
        expect(detail.originalEvent).to.be.null;
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `zoomed` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.zoomTo(1);
      },

      zoom(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      zoomed() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `zoom` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.zoomTo(1);
      },

      zoom(event) {
        expect(event.type).to.equal('zoom');
        done();
      },
    });
  });
});
