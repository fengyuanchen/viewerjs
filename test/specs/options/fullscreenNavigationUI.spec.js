describe('fullscreenNavigationUI (option)', () => {
    it('should be `auto` by default', () => {
        const image = window.createImage();
        const viewer = new Viewer(image);

        expect(viewer.options.fullscreenNavigationUI).to.equal('auto');
    });
});
