describe('container (option)', () => {
  it('should be "body" by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      ready() {
        expect(viewer.viewer.parentElement).to.equal(image.ownerDocument.body);
        done();
      },
    });

    expect(viewer.options.container).to.equal('body');
    viewer.show();
  });

  it('should support selector', (done) => {
    const image = window.createImage();
    const container = window.createContainer();

    container.id = 'container';

    const viewer = new Viewer(image, {
      container: '#container',

      ready() {
        expect(container.firstElementChild).to.equal(viewer.viewer);
        done();
      },
    });

    viewer.show();
  });

  it('should support element', (done) => {
    const image = window.createImage();
    const container = window.createContainer();
    const viewer = new Viewer(image, {
      container,

      ready() {
        expect(container.firstElementChild).to.equal(viewer.viewer);
        done();
      },
    });

    viewer.show();
  });
});
