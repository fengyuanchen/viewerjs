describe('toolbar (option)', () => {
  it('should show toolbar by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.toolbar).display).to.not.equal('none');
        expect(viewer.toolbar.hasAttribute('aria-hidden')).to.false;
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
        expect(viewer.toolbar.getAttribute('aria-hidden')).to.equal('true');
        done();
      },
    });

    expect(viewer.options.toolbar).to.be.false;
  });

  it('should not render a footer container', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      title: false,
      toolbar: false,
      navbar: false,

      ready() {
        expect(viewer.viewer.querySelector('.viewer-footer')).to.equal(null);
        done();
      },
    });
  });

  it('should customize toolbar buttons', (done) => {
    const image = window.createImage();
    let clicked = false;
    const viewer = new Viewer(image, {
      inline: true,
      toolbar: {
        next: {
          click() {
            clicked = true;
          },
          size: 'large',
        },
        reset: {
          show: false,
        },
        zoomIn: {
          show: 3,
          size: 'small',
        },
      },

      ready() {
        const next = viewer.toolbar.querySelector('.viewer-next');
        const reset = viewer.toolbar.querySelector('.viewer-reset');
        const zoomIn = viewer.toolbar.querySelector('.viewer-zoom-in');

        expect(next.className).to.include('viewer-large');
        expect(reset).to.equal(null);
        expect(zoomIn.className).to.include('viewer-hide-sm-down');
        expect(zoomIn.className).to.include('viewer-small');
        next.click();
        expect(clicked).to.be.true;
        done();
      },
    });

    expect(viewer.options.toolbar).to.be.an('object');
  });

  ['top', 'right', 'bottom', 'left'].forEach((position) => {
    it(`should support the ${position} position`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        toolbar: {
          position,
          zoomIn: true,
        },

        ready() {
          expect(viewer.toolbar.className).to.include(`viewer-toolbar-${position}`);
          done();
        },
      });
    });
  });

  ['small', 'medium', 'large'].forEach((size) => {
    it(`should avoid a ${size} top navbar`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: {
          position: 'top',
          size,
        },
        toolbar: {
          position: 'top',
          zoomIn: true,
        },

        ready() {
          expect(viewer.toolbar.className).to.include('viewer-toolbar-navbar-top');
          expect(viewer.toolbar.getBoundingClientRect().top)
            .to.equal(viewer.navbar.getBoundingClientRect().bottom);
          done();
        },
      });
    });
  });

  [
    {
      toolbarPosition: 'top',
      navbarPosition: 'bottom',
    },
    {
      toolbarPosition: 'bottom',
      navbarPosition: 'top',
    },
  ].forEach((configuration) => {
    it(`should not offset a ${configuration.toolbarPosition} toolbar for a ${configuration.navbarPosition} navbar`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: { position: configuration.navbarPosition },
        toolbar: {
          position: configuration.toolbarPosition,
          zoomIn: true,
        },

        ready() {
          const toolbarRect = viewer.toolbar.getBoundingClientRect();
          const navbarRect = viewer.navbar.getBoundingClientRect();
          const viewerRect = viewer.viewer.getBoundingClientRect();

          expect(viewer.toolbar.className)
            .to.not.include(`viewer-toolbar-navbar-${configuration.navbarPosition}`);

          if (configuration.toolbarPosition === 'top') {
            expect(toolbarRect.top).to.equal(viewerRect.top);
            expect(navbarRect.bottom).to.equal(viewerRect.bottom);
          } else {
            expect(toolbarRect.bottom).to.equal(viewerRect.bottom);
            expect(navbarRect.top).to.equal(viewerRect.top);
          }
          done();
        },
      });
    });
  });
});
