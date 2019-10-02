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

  it('should not show title', (done) => {
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

  it('should support function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      title(img) {
        return img.alt;
      },

      ready() {
        expect(viewer.title.innerHTML).to.equal(image.alt);
        done();
      },
    });

    expect(viewer.options.title).to.be.a('function');
  });

  it('should support array', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      title: [3, (img) => img.alt],

      ready() {
        expect(viewer.title.className).to.include('viewer-hide-sm-down');
        expect(viewer.title.innerHTML).to.equal(image.alt);
        done();
      },
    });

    expect(viewer.options.title).to.be.an('array');
  });
});
