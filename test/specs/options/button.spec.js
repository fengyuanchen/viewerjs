describe('button (option)', () => {
  it('should show a close button and hide the viewer on click the button by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        const { button } = viewer;

        expect(window.getComputedStyle(button).display).to.not.equal('none');
        expect(button.className).to.include('viewer-close');
        button.click();
      },

      hidden() {
        done();
      },
    });

    expect(viewer.options.button).to.be.true;
    viewer.show();
  });

  it('should hide the button', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      button: false,

      shown() {
        expect(window.getComputedStyle(viewer.button).display).to.equal('none');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.button).to.be.false;
    viewer.show();
  });

  it('should show a fullscreen button and enter modal mode on click the button in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        const { button } = viewer;

        expect(window.getComputedStyle(button).display).to.not.equal('none');
        expect(button.className).to.include('viewer-fullscreen');
        expect(button.className).to.not.include('viewer-fullscreen-exit');
        expect(viewer.fulled).to.be.false;
        viewer.button.click();
        expect(button.className).to.include('viewer-fullscreen-exit');
        expect(viewer.fulled).to.be.true;
        viewer.exit();
        done();
      },
    });
  });

  it('should show a exit fullscreen button and exit modal mode on click the button when fulled in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        const { button } = viewer;

        expect(window.getComputedStyle(button).display).to.not.equal('none');
        viewer.button.click();
        expect(button.className).to.include('viewer-fullscreen-exit');
        expect(viewer.fulled).to.be.true;
        viewer.button.click();
        expect(button.className).to.not.include('viewer-fullscreen-exit');
        expect(viewer.fulled).to.be.false;
        done();
      },
    });
  });
});
