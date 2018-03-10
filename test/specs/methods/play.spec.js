describe('play (method)', () => {
  it('should play the images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect(viewer.played).to.be.false;
        expect(window.getComputedStyle(viewer.player).display).to.equal('none');
        viewer.play();
        expect(viewer.played).to.be.true;
        expect(window.getComputedStyle(viewer.player).display).to.not.equal('none');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });

  it('should play the images in inline mode', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      inline: true,

      viewed() {
        expect(viewer.played).to.be.false;
        expect(window.getComputedStyle(viewer.player).display).to.equal('none');
        viewer.play();
        expect(viewer.played).to.be.true;
        expect(window.getComputedStyle(viewer.player).display).to.not.equal('none');
        done();
      },
    });
  });
});
