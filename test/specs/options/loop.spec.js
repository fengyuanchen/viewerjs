describe('loop (option)', () => {
  it('should not be loop by default', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.toolbar.querySelector('.viewer-prev').click();
            done();
            break;

          case 3:
            expect.fail(1, 0);
            break;

          default:
        }
      },
    });

    expect(viewer.options.loop).to.be.false;
  });

  it('should be loop', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,
      loop: true,

      viewed(event) {
        switch (event.detail.index) {
          case 0:
            viewer.toolbar.querySelector('.viewer-prev').click();
            break;

          case 3:
            done();
            break;

          default:
        }
      },
    });

    expect(viewer.options.loop).to.be.true;
  });
});
