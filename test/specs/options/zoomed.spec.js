describe('zoomed (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.zoomed).to.be.null;
  });

  it('should execute the `zoomed` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.zoomTo(1);
      },

      zoomed(event) {
        expect(event.type).to.equal('zoomed');
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

      zoomed(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('ratio', 'oldRatio', 'originalEvent');
        expect(detail.ratio).to.be.a('number');
        expect(detail.oldRatio).to.be.a('number');
        expect(detail.originalEvent).to.be.null;
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `zoomed` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.zoomTo(1);
      },

      zoomed(event) {
        expect(event.type).to.equal('zoomed');
        done();
      },
    });
  });
});
