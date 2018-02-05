describe('url (option)', () => {
  it('should be "src" by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.url).to.equal('src');
  });

  it('should support string', (done) => {
    const image = window.createImage();

    image.dataset.url = image.url;

    new Viewer(image, {
      inline: true,
      url: 'data-src',

      viewed() {
        done();
      },
    });
  });

  it('should support function', (done) => {
    const image = window.createImage();

    image.dataset.url = image.url;

    new Viewer(image, {
      inline: true,

      url(img) {
        expect(this).to.be.an.instanceof(Viewer);

        return img.dataset.src;
      },

      viewed() {
        done();
      },
    });
  });
});
