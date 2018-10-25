describe('className (option)', () => {
  it('should be empty string by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.className).to.equal('');
  });

  it('should add the given class name to the viewer', (done) => {
    const image = window.createImage();
    const className = 'custom-viewer';
    const viewer = new Viewer(image, {
      className,
      ready(event) {
        expect(viewer.viewer.className).to.include(className);
        event.preventDefault();
        done();
      },
    });

    viewer.show();
  });

  it('should support multiple class names', (done) => {
    const image = window.createImage();
    const className = 'custom-viewer another-custom-viewer';
    const viewer = new Viewer(image, {
      className,
      ready(event) {
        expect(viewer.viewer.className).to.include(className);
        event.preventDefault();
        done();
      },
    });

    viewer.show();
  });
});
