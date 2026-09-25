describe('navigation (option)', () => {
  it('should not show navigation buttons by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(window.getComputedStyle(viewer.navigation).display).to.equal('none');
        expect(viewer.navigation.getAttribute('aria-hidden')).to.equal('true');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.navigation).to.be.false;
    viewer.show();
  });

  it('should show navigation buttons and view the next image', (done) => {
    const imageList = window.createImageList();
    let viewed = 0;
    const viewer = new Viewer(imageList, {
      navigation: true,

      viewed(event) {
        viewed += 1;

        if (viewed === 1) {
          expect(window.getComputedStyle(viewer.navigation).display).to.not.equal('none');
          expect(viewer.navigation.hasAttribute('aria-hidden')).to.false;
          viewer.navigation.querySelector('.viewer-next').click();
        } else {
          expect(event.detail.index).to.equal(1);
          viewer.hide(true);
          done();
        }
      },
    });

    viewer.show();
  });

  it('should customize navigation buttons', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      navigation: {
        prev: {
          size: 'large',
        },
        next: {
          show: false,
          size: 'small',
        },
      },

      viewed() {
        const prev = viewer.navigation.querySelector('.viewer-prev');
        const next = viewer.navigation.querySelector('.viewer-next');

        expect(prev.className).to.include('viewer-large');
        expect(next.className).to.include('viewer-hide');
        expect(next.className).to.include('viewer-small');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should not avoid a hidden side navbar', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navigation: true,
      toolbar: false,
      navbar: {
        position: 'left',
        show: false,
        size: 'large',
      },

      ready() {
        const previous = viewer.navigation.querySelector('.viewer-prev');

        expect(viewer.navigation.className).to.not.include('viewer-navigation-navbar-left');
        expect(parseInt(window.getComputedStyle(previous).left, 10)).to.equal(15);
        done();
      },
    });
  });

  it('should view the previous image from the navigation button', (done) => {
    const imageList = window.createImageList();
    let viewed = 0;
    const viewer = new Viewer(imageList, {
      initialViewIndex: 1,
      navigation: true,

      viewed(event) {
        viewed += 1;

        if (viewed === 1) {
          viewer.navigation.querySelector('.viewer-prev').click();
        } else {
          expect(event.detail.index).to.equal(0);
          viewer.hide(true);
          done();
        }
      },
    });

    viewer.show();
  });

  ['left', 'right'].forEach((position) => {
    const action = position === 'left' ? 'prev' : 'next';
    const property = position === 'left' ? 'left' : 'right';

    [
      {
        name: 'toolbar',
        toolbar: { position, zoomIn: true },
        navbar: false,
        offset: 51,
        className: `viewer-navigation-toolbar-${position}`,
      },
      {
        name: 'small navbar',
        toolbar: false,
        navbar: { position, size: 'small' },
        offset: 57,
        className: `viewer-navigation-navbar-${position}-small`,
      },
      {
        name: 'medium navbar',
        toolbar: false,
        navbar: { position, size: 'medium' },
        offset: 67,
        className: `viewer-navigation-navbar-${position}`,
      },
      {
        name: 'large navbar',
        toolbar: false,
        navbar: { position, size: 'large' },
        offset: 77,
        className: `viewer-navigation-navbar-${position}-large`,
      },
      {
        name: 'large navbar and toolbar',
        toolbar: { position, zoomIn: true },
        navbar: { position, size: 'large' },
        offset: 113,
        className: `viewer-navigation-navbar-${position}-large`,
      },
    ].forEach((configuration) => {
      it(`should avoid a ${position}-positioned ${configuration.name}`, (done) => {
        const image = window.createImage();
        const viewer = new Viewer(image, {
          inline: true,
          navigation: true,
          navbar: configuration.navbar,
          toolbar: configuration.toolbar,

          ready() {
            const button = viewer.navigation.querySelector(`.viewer-${action}`);

            expect(viewer.navigation.className).to.include(configuration.className);
            expect(parseInt(window.getComputedStyle(button)[property], 10))
              .to.equal(configuration.offset);
            done();
          },
        });
      });
    });
  });

  [
    {
      position: 'top',
      action: 'prev',
      property: 'left',
      offset: 15,
    },
    {
      position: 'left',
      action: 'prev',
      property: 'left',
      offset: 113,
    },
    {
      position: 'right',
      action: 'next',
      property: 'right',
      offset: 113,
    },
  ].forEach((configuration) => {
    it(`should support toolbar and navbar at the ${configuration.position}`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navigation: true,
        navbar: {
          position: configuration.position,
          size: 'large',
        },
        toolbar: {
          position: configuration.position,
          zoomIn: true,
        },

        ready() {
          const button = viewer.navigation.querySelector(`.viewer-${configuration.action}`);

          expect(viewer.toolbar.className).to.include(`viewer-toolbar-${configuration.position}`);
          expect(viewer.navbar.className).to.include(`viewer-navbar-${configuration.position}`);
          expect(parseInt(window.getComputedStyle(button)[configuration.property], 10))
            .to.equal(configuration.offset);

          if (configuration.position === 'left') {
            expect(viewer.toolbar.getBoundingClientRect().left)
              .to.equal(viewer.navbar.getBoundingClientRect().right);
          } else if (configuration.position === 'right') {
            expect(viewer.toolbar.getBoundingClientRect().right)
              .to.equal(viewer.navbar.getBoundingClientRect().left);
          }
          done();
        },
      });
    });
  });
});
