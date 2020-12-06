describe('scaled (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.scaled).to.be.null;
  });

  it('should execute the `scaled` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.scale(-1);
      },

      scaled(event) {
        expect(event.type).to.equal('scaled');
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

      scaled(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('scaleX', 'scaleY', 'oldScaleX', 'oldScaleY');
        expect(detail.scaleX).to.be.a('number');
        expect(detail.scaleY).to.be.a('number');
        expect(detail.oldScaleX).to.be.a('number');
        expect(detail.oldScaleY).to.be.a('number');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `scaled` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.scale(-1);
      },

      scaled(event) {
        expect(event.type).to.equal('scaled');
        done();
      },
    });
  });
});
