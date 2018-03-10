describe('interval (option)', () => {
  it('should be `5000` by default', () => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList);

    expect(viewer.options.interval).to.equal(5000);
  });

  it('should show the next image after the delay time', (done) => {
    const imageList = window.createImageList();
    const interval = 1000;
    const viewer = new Viewer(imageList, {
      interval,
      inline: true,

      viewed() {
        viewer.play();

        const { children } = viewer.player;

        expect(children[0].className).to.include('viewer-in');
        expect(children[1].className).to.not.include('viewer-in');
        expect(children[2].className).to.not.include('viewer-in');
        setTimeout(() => {
          expect(children[0].className).to.not.include('viewer-in');
          expect(children[1].className).to.include('viewer-in');
          expect(children[2].className).to.not.include('viewer-in');
          viewer.stop();
          done();
        }, interval + 10);
      },
    });

    expect(viewer.options.interval).to.equal(interval);
  });
});
