describe('rotate (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.rotate).to.be.null;
  });

  it('should execute the `rotate` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.rotateTo(45);
      },

      rotate(event) {
        expect(event.type).to.equal('rotate');
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
        viewer.rotateTo(45);
      },

      rotate(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('degree', 'oldDegree');
        expect(detail.degree).to.be.a('number');
        expect(detail.oldDegree).to.be.a('number');
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `rotated` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.rotateTo(45);
      },

      rotate(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      rotated() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `rotate` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.rotateTo(45);
      },

      rotate(event) {
        expect(event.type).to.equal('rotate');
        done();
      },
    });
  });
});
