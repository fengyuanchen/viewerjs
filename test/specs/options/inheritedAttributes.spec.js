describe('inheritedAttributes (option)', () => {
  it('should inherit the `crossOrigin` and `referrerPolicy` attributes', (done) => {
    const image = window.createImage({
      crossOrigin: '',
      referrerPolicy: 'no-referrer',
    });
    const viewer = new Viewer(image, {
      inline: true,

      viewed(event) {
        expect(event.detail.image.getAttribute('crossOrigin')).to.equal('');
        expect(event.detail.image.crossOrigin).to.equal('anonymous');
        expect(event.detail.image.getAttribute('referrerPolicy')).to.equal('no-referrer');
        expect(event.detail.image.referrerPolicy).to.equal('no-referrer');
        done();
      },
    });

    expect(viewer.options.inheritedAttributes).to.include('crossOrigin');
    expect(viewer.options.inheritedAttributes).to.include('referrerPolicy');
  });

  it('should not inherit the `crossOrigin` and `referrerPolicy` attributes', (done) => {
    const image = window.createImage({
      crossOrigin: '',
      referrerPolicy: 'no-referrer',
    });
    const viewer = new Viewer(image, {
      inheritedAttributes: [],
      inline: true,

      viewed(event) {
        expect(event.detail.image.getAttribute('crossOrigin')).to.be.null;
        expect(event.detail.image.crossOrigin).to.be.null;
        expect(event.detail.image.getAttribute('referrerPolicy')).to.be.null;
        expect(event.detail.image.referrerPolicy).to.equal('');
        done();
      },
    });

    expect(viewer.options.inheritedAttributes).to.be.empty;
  });
});
