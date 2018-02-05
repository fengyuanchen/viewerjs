describe('navbar (option)', () => {
  it('should show navbar by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.not.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.be.true;
  });

  it('should not show navbar', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: false,

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.be.false;
  });
});
