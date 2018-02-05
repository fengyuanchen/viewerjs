describe('filter (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.filter).to.be.null;
  });

  it('should match the filtered image', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      filter(image) {
        expect(this).to.be.an.instanceof(Viewer);

        return /1\.jpg$/.test(image.src);
      },

      ready() {
        expect(viewer.list.childElementCount).to.equal(1);
        expect(viewer.list.querySelector('img').src).to.match(/1\.jpg$/);
        done();
      },
    });
  });

  it('should not be ready when ignore all images', () => {
    const imageList = window.createImageList();

    new Viewer(imageList, {
      inline: true,

      filter() {
        return false;
      },

      ready() {
        expect.fail(1, 0);
      },
    });
  });
});
