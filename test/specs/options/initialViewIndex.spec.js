describe('initialViewIndex (option)', () => {
  it('should be "0" by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.initialViewIndex).to.equal(0);
  });

  it('should match the given index', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      initialViewIndex: 1,

      viewed(event) {
        expect(event.detail.index).to.equal(1);
        done();
      },
    });

    expect(viewer.options.initialViewIndex).to.equal(1);
    viewer.show();
  });

  it('should work in inline mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      initialViewIndex: 1,
      inline: true,

      viewed(event) {
        expect(event.detail.index).to.equal(1);
        done();
      },
    });

    expect(viewer.options.initialViewIndex).to.equal(1);
  });
});
