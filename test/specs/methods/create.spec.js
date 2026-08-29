describe('create', () => {
  it('should be a static method', () => {
    expect(Viewer.create).to.be.a('function');
  });

  it('should create a new Viewer instance', () => {
    const image = window.createImage();
    const viewer = Viewer.create(image, {
      inline: true,
    });

    expect(viewer).to.be.an.instanceof(Viewer);
    expect(viewer.options.inline).to.be.true;
  });
});
