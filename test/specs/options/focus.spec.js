describe('focus (option)', () => {
  it('should be enabled by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(document.activeElement).to.equal(viewer.items[viewer.index]);
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.focus).to.be.true;
    viewer.show();
  });

  it('should be disabled', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      focus: false,

      viewed() {
        expect(document.activeElement).to.not.equal(viewer.items[viewer.index]);
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.focus).to.be.false;
    viewer.show();
  });

  it('should be disabled when the `keyboard` option to set to `false`', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      keyboard: false,
    });

    expect(viewer.options.focus).to.be.false;
  });
});
