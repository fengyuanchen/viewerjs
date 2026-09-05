describe('Viewer', () => {
  it('should be a class (function)', () => {
    expect(Viewer).to.be.a('function');
  });

  it('should throw error when the first argument is not an element', () => {
    expect(() => {
      new Viewer(document);
    }).to.throw('The first argument is required and must be an element.');
  });

  it('should support a ShadowRoot as the target', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const image = document.createElement('img');

    image.src = '/base/docs/images/tibet-1.jpg';
    shadowRoot.appendChild(image);
    document.body.appendChild(host);

    const viewer = new Viewer(shadowRoot);

    expect(viewer.images).to.have.members([image]);

    viewer.destroy();
    host.remove();
  });
});
