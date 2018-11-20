describe('destroy (method)', () => {
  it('should destroy successfully when there are not any images', () => {
    const container = window.createContainer();
    const viewer = new Viewer(container);

    expect(container.viewer).to.be.an.instanceof(Viewer);
    viewer.destroy();
    expect(container.viewer).to.be.undefined;
  });

  it('should destroy successfully when there are not any images in inline mode', () => {
    const container = window.createContainer();
    const viewer = new Viewer(container, {
      inline: true,
    });

    expect(container.viewer).to.be.an.instanceof(Viewer);
    viewer.destroy();
    expect(container.viewer).to.be.undefined;
  });

  it('should destroy before ready', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    viewer.show();
    expect(image.viewer).to.be.an.instanceof(Viewer);
    viewer.destroy();
    expect(image.viewer).to.be.undefined;
  });

  it('should destroy before ready in inline mode', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
    });

    expect(image.viewer).to.be.an.instanceof(Viewer);
    viewer.destroy();
    expect(image.viewer).to.be.undefined;
  });

  it('should destroy after ready', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      ready() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
      },
    });

    viewer.show();
  });

  it('should destroy after ready in inline mode', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });
  });

  it('should destroy successfully when show', () => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      show() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
      },
    });

    viewer.show();
  });

  it('should destroy successfully when shown', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });

  it('should destroy successfully when hide', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },

      hide() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });

  it('should destroy successfully when hidden', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },

      hidden() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });

  it('should destroy successfully when view', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      view() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });

  it('should destroy successfully when viewed', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(image.viewer).to.be.an.instanceof(Viewer);
        viewer.destroy();
        expect(image.viewer).to.be.undefined;
        done();
      },
    });

    viewer.show();
  });
});
