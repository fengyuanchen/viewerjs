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

  ['small', 'medium', 'large'].forEach((size, index) => {
    it(`should show ${size} thumbnails`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: size,

        ready() {
          const item = viewer.list.firstElementChild;

          expect(item.offsetHeight).to.equal(40 + (index * 10));
          expect(item.offsetWidth / item.offsetHeight).to.equal(3 / 5);
          done();
        },
      });
    });
  });

  it('should support object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        size: 'large',
      },

      ready() {
        const item = viewer.list.firstElementChild;

        expect(window.getComputedStyle(viewer.navbar).display).to.not.equal('none');
        expect(item.offsetHeight).to.equal(60);
        expect(item.offsetWidth / item.offsetHeight).to.equal(3 / 5);
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      size: 'large',
    });
  });

  it('should hide navbar with object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        show: false,
      },

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      show: false,
    });
  });

  it('should support responsive visibility with object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        show: 3,
      },

      ready() {
        expect(viewer.navbar.className).to.include('viewer-hide-sm-down');
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      show: 3,
    });
  });

  ['small', 'medium', 'large'].forEach((size) => {
    it(`should support ${size} size in object options`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: {
          size,
        },

        ready() {
          expect(viewer.navbar.className).to.include(`viewer-${size}`);
          done();
        },
      });
    });
  });
});
