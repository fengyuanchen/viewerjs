describe('inline (option)', () => {
  it('should not be inline by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(viewer.fulled).to.be.true;
        expect(viewer.viewer.className).to.include('viewer-fixed');
        viewer.hide(true);
        done();
      },
    });

    expect(viewer.options.inline).to.be.false;
    viewer.show();
  });

  it('should be inline', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(viewer.fulled).to.be.false;
        expect(viewer.viewer.className).to.not.include('viewer-fixed');
        done();
      },
    });

    expect(viewer.options.inline).to.be.true;
  });

  it('should trigger the `ready`, `view` and `viewed` events', (done) => {
    const image = window.createImage();

    new Viewer(image, {
      inline: true,

      ready(event) {
        expect(event.type).to.equal('ready');
      },

      view(event) {
        expect(event.type).to.equal('view');
      },

      viewed(event) {
        expect(event.type).to.equal('viewed');
        done();
      },
    });
  });

  it('should not trigger the `show`, `shown`, `hide` and `hidden` events', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        done();
      },

      show() {
        expect.fail(1, 0);
      },

      shown() {
        viewer.hide(true);
        expect.fail(1, 0);
      },

      hide() {
        expect.fail(1, 0);
      },

      hidden() {
        expect.fail(1, 0);
      },
    });
  });
});
