describe('tooltip (option)', () => {
  it('should show tooltip when zoom by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.zoomTo(1, true);
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.not.equal('none');
        done();
      },
    });

    expect(viewer.options.tooltip).to.be.true;
  });

  it('should not show tooltip', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      tooltip: false,

      viewed() {
        viewer.zoomTo(1, true);
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.tooltip).to.be.false;
  });
});
