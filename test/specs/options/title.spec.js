describe('title (option)', () => {
  it('should show title by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.title).display).to.not.equal('none');
        done();
      },
    });

    expect(viewer.options.title).to.be.true;
  });

  it('show not show title', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      title: false,

      ready() {
        expect(window.getComputedStyle(viewer.title).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.title).to.be.false;
  });
});
