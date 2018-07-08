describe('toggleOnDblclick (option)', () => {
  it('should be true by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.canvas.firstElementChild.dispatchEvent(window.createEvent('dblclick'));
        setTimeout(() => {
          expect(viewer.imageData.ratio).to.equal(1);
          done();
        }, 300);
      },
    });

    expect(viewer.options.toggleOnDblclick).to.be.true;
  });

  it('should be false', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      toggleOnDblclick: false,

      viewed() {
        viewer.canvas.firstElementChild.dispatchEvent(window.createEvent('dblclick'));
        setTimeout(() => {
          expect(viewer.imageData.ratio).to.not.equal(1);
          done();
        }, 300);
      },
    });

    expect(viewer.options.toggleOnDblclick).to.be.false;
  });
});
