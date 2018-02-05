describe('toolbar (option)', () => {
  it('should show toolbar by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.toolbar).display).to.not.equal('none');
        done();
      },
    });

    expect(viewer.options.toolbar).to.be.true;
  });

  it('should not show toolbar', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      toolbar: false,

      ready() {
        expect(window.getComputedStyle(viewer.toolbar).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.toolbar).to.be.false;
  });
});
