describe('play (option)', () => {
  it('should be null be default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.play).to.be.null;
  });

  it('should execute the `play` hook function', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(viewer.played).to.false;
        viewer.play();
        expect(viewer.played).to.true;
        done();
      },

      play(event) {
        expect(event.type).to.equal('play');
      },
    });

    viewer.show();
  });

  it('should not execute the `play` hook function when default prevented', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      viewed() {
        expect(viewer.played).to.false;
        viewer.play();
        expect(viewer.played).to.false;
        done();
      },

      play(event) {
        expect(event.type).to.equal('play');
        event.preventDefault();
      },
    });

    viewer.show();
  });
});
