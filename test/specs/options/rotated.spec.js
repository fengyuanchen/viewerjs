describe('rotated (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.rotated).to.be.null;
  });

  it('should execute the `rotated` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.rotateTo(45);
      },

      rotated(event) {
        expect(event.type).to.equal('rotated');
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
        viewer.rotateTo(45);
      },

      rotated(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('degree', 'oldDegree');
        expect(detail.degree).to.be.a('number');
        expect(detail.oldDegree).to.be.a('number');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `rotated` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.rotateTo(45);
      },

      rotated(event) {
        expect(event.type).to.equal('rotated');
        done();
      },
    });
  });
});
