describe('hide (event)', () => {
  it('should trigger the `hide` event', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', (event) => {
      expect(event.type).to.equal('hide');
      done();
    });

    const viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },
    });

    viewer.show();
  });

  it('should not trigger the `hidden` event when default prevented', (done) => {
    const image = window.createImage();
    let count = 0;
    let viewer;

    image.addEventListener('hide', (event) => {
      count += 1;

      if (count === 1) {
        event.preventDefault();
        setTimeout(() => {
          viewer.hide();
          done();
        }, 350);
      }
    });

    image.addEventListener('hidden', () => {
      if (count === 1) {
        expect.fail(1, 0);
      }
    });

    viewer = new Viewer(image, {
      shown() {
        viewer.hide();
      },
    });

    viewer.show();
  });

  it('should not trigger the `hide` event in inline mode', (done) => {
    const image = window.createImage();

    image.addEventListener('hide', () => {
      expect.fail(1, 0);
    });

    const viewer = new Viewer(image, {
      inline: true,

      viewed() {
        viewer.hide();
        done();
      },
    });
  });
});
