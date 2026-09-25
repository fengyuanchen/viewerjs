describe('title (option)', () => {
  it('should show title by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.title).display).to.not.equal('none');
        expect(viewer.title.hasAttribute('aria-hidden')).to.false;
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
        expect(viewer.title.getAttribute('aria-hidden')).to.equal('true');
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

  it('should reserve space for the title when sizing the image', (done) => {
    const image = window.createImage();
    const container = image.parentNode;

    container.style.height = '300px';
    container.style.width = '1200px';

    const viewer = new Viewer(image, {
      inline: true,
      initialCoverage: 1,
      navbar: false,
      toolbar: false,

      viewed() {
        const { imageData, title } = viewer;

        expect(imageData.top + imageData.height).to.be.at.most(title.offsetTop);
        done();
      },
    });
  });

  it('should preserve image sizing between a top toolbar and bottom navbar', (done) => {
    const image = window.createImage();
    const container = image.parentNode;

    container.style.height = '100px';
    container.style.width = '1200px';

    const viewer = new Viewer(image, {
      inline: true,
      initialCoverage: 1,
      navbar: { position: 'bottom' },
      toolbar: {
        position: 'top',
        zoomIn: true,
      },

      viewed() {
        const {
          imageData, title, toolbar, viewer: viewerElement,
        } = viewer;
        const titleHeight = viewerElement.offsetHeight - title.offsetTop;

        expect(imageData.height).to.equal(Math.max(toolbar.offsetHeight, titleHeight));
        done();
      },
    });
  });

  [
    {
      name: 'no bottom controls',
      navbar: { position: 'top' },
      toolbar: { position: 'top', zoomIn: true },
      titleBottom: 0,
    },
    {
      name: 'only a bottom toolbar',
      navbar: { position: 'top' },
      toolbar: { position: 'bottom', zoomIn: true },
      titleBottom: 42,
      toolbarBottom: 0,
    },
    {
      name: 'only a bottom navbar',
      navbar: { position: 'bottom' },
      toolbar: { position: 'top', zoomIn: true },
      titleBottom: 52,
    },
    {
      name: 'both bottom controls',
      navbar: { position: 'bottom' },
      toolbar: { position: 'bottom', zoomIn: true },
      titleBottom: 94,
      toolbarBottom: 52,
    },
  ].forEach((configuration) => {
    it(`should position the title with ${configuration.name}`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: configuration.navbar,
        toolbar: configuration.toolbar,

        ready() {
          expect(parseInt(window.getComputedStyle(viewer.title).bottom, 10))
            .to.equal(configuration.titleBottom);

          if (configuration.toolbarBottom !== undefined) {
            expect(parseInt(window.getComputedStyle(viewer.toolbar).bottom, 10))
              .to.equal(configuration.toolbarBottom);
          }
          done();
        },
      });
    });
  });

  [
    {
      name: 'a left toolbar',
      navbar: false,
      toolbar: { position: 'left', zoomIn: true },
      left: 36,
      right: 0,
      classNames: ['viewer-title-toolbar-left'],
    },
    {
      name: 'a large right navbar',
      navbar: { position: 'right', size: 'large' },
      toolbar: false,
      left: 0,
      right: 62,
      classNames: ['viewer-title-navbar-right-large'],
    },
    {
      name: 'a large left navbar and toolbar',
      navbar: { position: 'left', size: 'large' },
      toolbar: { position: 'left', zoomIn: true },
      left: 98,
      right: 0,
      classNames: ['viewer-title-toolbar-left', 'viewer-title-navbar-left-large'],
    },
    {
      name: 'a large left navbar and right toolbar',
      navbar: { position: 'left', size: 'large' },
      toolbar: { position: 'right', zoomIn: true },
      left: 62,
      right: 36,
      classNames: ['viewer-title-toolbar-right', 'viewer-title-navbar-left-large'],
    },
  ].forEach((configuration) => {
    it(`should center the title beside ${configuration.name}`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: configuration.navbar,
        toolbar: configuration.toolbar,

        ready() {
          const styles = window.getComputedStyle(viewer.title);

          configuration.classNames.forEach((className) => {
            expect(viewer.title.className).to.include(className);
          });
          expect(parseInt(styles.left, 10)).to.equal(configuration.left);
          expect(parseInt(styles.right, 10)).to.equal(configuration.right);
          done();
        },
      });
    });
  });
});
