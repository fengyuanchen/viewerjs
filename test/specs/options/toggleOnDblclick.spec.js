describe('toggleOnDblclick (option)', () => {
  it('should not treat a moved pointer as a double click', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.imageClicked = true;

        viewer.pointerdown({
          button: 0,
          buttons: 1,
          pageX: 0,
          pageY: 0,
          preventDefault() {},
        });
        viewer.pointermove({
          pageX: 20,
          pageY: 0,
          preventDefault() {},
        });
        viewer.pointerup({
          pageX: 20,
          pageY: 0,
          preventDefault() {},
        });

        expect(viewer.pointerMoved).to.be.true;
        expect(viewer.imageClicked).to.be.false;
        viewer.hide(true);
        done();
      },
    });
  });

  it('should be true by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.canvas.firstElementChild.dispatchEvent(window.createEvent('dblclick'));
        setTimeout(() => {
          expect(viewer.imageData.ratio).to.equal(1);
          done();
        }, 300);
      },
    });

    expect(viewer.options.toggleOnDblclick).to.be.true;
  });

  it('should be false', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      toggleOnDblclick: false,

      viewed() {
        viewer.canvas.firstElementChild.dispatchEvent(window.createEvent('dblclick'));
        setTimeout(() => {
          expect(viewer.imageData.ratio).to.not.equal(1);
          done();
        }, 300);
      },
    });

    expect(viewer.options.toggleOnDblclick).to.be.false;
  });
});
