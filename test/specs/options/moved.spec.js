describe('moved (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.moved).to.be.null;
  });

  it('should execute the `moved` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.moveTo(0);
      },

      moved(event) {
        expect(event.type).to.equal('moved');
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
        viewer.moveTo(0);
      },

      moved(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('x', 'y', 'oldX', 'oldY', 'originalEvent');
        expect(detail.x).to.be.a('number');
        expect(detail.y).to.be.a('number');
        expect(detail.oldX).to.be.a('number');
        expect(detail.oldY).to.be.a('number');
        expect(detail.originalEvent).to.be.null;
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should execute the `moved` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.moveTo(0);
      },

      moved(event) {
        expect(event.type).to.equal('moved');
        done();
      },
    });
  });
});
