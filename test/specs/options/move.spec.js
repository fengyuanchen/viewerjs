describe('move (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.move).to.be.null;
  });

  it('should execute the `move` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        viewer.moveTo(0);
      },

      move(event) {
        expect(event.type).to.equal('move');
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
        viewer.moveTo(0);
      },

      move(event) {
        const { detail } = event;

        expect(detail).to.be.an('object').that.has.all.keys('x', 'y', 'oldX', 'oldY', 'originalEvent');
        expect(detail.x).to.be.a('number');
        expect(detail.y).to.be.a('number');
        expect(detail.oldX).to.be.a('number');
        expect(detail.oldY).to.be.a('number');
        expect(detail.originalEvent).to.be.null;
        event.preventDefault();
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not execute the `moved` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.moveTo(0);
      },

      move(event) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide(true);
          done();
        }, 350);
      },

      moved() {
        expect.fail(1, 0);
      },
    });
  });

  it('should execute the `move` hook function in inline mode', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      viewed() {
        this.viewer.moveTo(0);
      },

      move(event) {
        expect(event.type).to.equal('move');
        done();
      },
    });
  });
});
