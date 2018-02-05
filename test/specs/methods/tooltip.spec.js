describe('tooltip (method)', () => {
  it('should show tooltip by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.equal('none');
        viewer.tooltip();
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.not.equal('none');
        done();
      },
    });
  });

  it('should not show tooltip when the `tooltip` option is set to `false`', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      tooltip: false,

      viewed() {
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.equal('none');
        viewer.tooltip();
        expect(window.getComputedStyle(viewer.tooltipBox).display).to.equal('none');
        done();
      },
    });
  });
});
