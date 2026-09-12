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

  it('should not show footer when title, toolbar, and navbar are disabled', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      title: false,
      toolbar: false,
      navbar: false,

      ready() {
        expect(window.getComputedStyle(viewer.footer).display).to.equal('none');
        expect(viewer.footer.getAttribute('aria-hidden')).to.equal('true');
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
});
