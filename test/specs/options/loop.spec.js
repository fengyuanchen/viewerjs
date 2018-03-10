describe('loop (option)', () => {
  it('should be loop by default', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.toolbar.querySelector('.viewer-prev').click();
            break;

          case 4:
            done();
            break;

          default:
        }
      },
    });

    expect(viewer.options.loop).to.be.true;
  });

  it('should not be loop', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,
      loop: false,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.toolbar.querySelector('.viewer-prev').click();
            done();
            break;

          case 4:
            expect.fail(1, 0);
            break;

          default:
        }
      },
    });

    expect(viewer.options.loop).to.be.false;
  });
});
