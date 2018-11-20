describe('Viewer', () => {
  it('should be a class (function)', () => {
    expect(Viewer).to.be.a('function');
  });

  it('should throw error when the first argument is not an element', () => {
    expect(() => {
      new Viewer(document);
    }).to.throw('The first argument is required and must be an element.');
  });
});
