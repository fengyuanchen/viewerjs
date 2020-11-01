describe('focus (option)', () => {
  it('should be enabled by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(document.activeElement).to.equal(viewer.image.parentElement);
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
        expect(document.activeElement).to.not.equal(viewer.image.parentElement);
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.focus).to.be.false;
    viewer.show();
  });
});
