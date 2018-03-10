describe('stop (method)', () => {
  it('should stop to play the images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        viewer.play();
        expect(viewer.played).to.be.true;
        expect(window.getComputedStyle(viewer.player).display).to.not.equal('none');
        viewer.stop();
        expect(viewer.played).to.be.false;
        expect(window.getComputedStyle(viewer.player).display).to.equal('none');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should stop to play the images in inline mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed() {
        viewer.play();
        expect(viewer.played).to.be.true;
        expect(window.getComputedStyle(viewer.player).display).to.not.equal('none');
        viewer.stop();
        expect(viewer.played).to.be.false;
        expect(window.getComputedStyle(viewer.player).display).to.equal('none');
        done();
      },
    });
  });
});
