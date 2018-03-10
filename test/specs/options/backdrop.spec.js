describe('backdrop (option)', () => {
  it('should show backdrop and hide the viewer on click the backdrop by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.viewer.className).to.include('viewer-backdrop');
        viewer.canvas.click();
      },

      hidden() {
        done();
      },
    });

    expect(viewer.options.backdrop).to.be.true;
    viewer.show();
  });

  it('should not show backdrop and hide the viewer on click the backdrop', (done) => {
    const image = window.createImage();
    let hidable = false;
    const viewer = new Viewer(image, {
      backdrop: false,

      shown() {
        expect(viewer.viewer.className).to.not.include('viewer-backdrop');
        viewer.canvas.click();
        hidable = true;
        viewer.hide(true);
        done();
      },

      hide() {
        if (!hidable) {
          expect.fail(1, 0);
        }
      },
    });

    expect(viewer.options.backdrop).to.be.false;
    viewer.show();
  });

  it('should show backdrop but not hide the viewer on click the backdrop', (done) => {
    const image = window.createImage();
    let hidable = false;
    const viewer = new Viewer(image, {
      backdrop: 'static',

      shown() {
        expect(viewer.viewer.className).to.include('viewer-backdrop');
        viewer.canvas.click();
        hidable = true;
        viewer.hide(true);
        done();
      },

      hide() {
        if (!hidable) {
          expect.fail(1, 0);
        }
      },
    });

    expect(viewer.options.backdrop).to.equal('static');
    viewer.show();
  });
});
