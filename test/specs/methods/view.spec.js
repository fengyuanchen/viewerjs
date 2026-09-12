describe('view (method)', () => {
  it('should view the image of the given index', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed(event) {
        expect(event.detail.index).to.equal(1);
        viewer.hide(true);
        done();
      },
    });

    viewer.view(1);
  });

  it('should not work when the given index is less than 0', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(-1);
    setTimeout(() => {
      viewer.hide(true);
      done();
    }, 500);
  });

  it('should not work when the given index is greater than or equal to the length of the images', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      viewed() {
        expect.fail(1, 0);
      },
    });

    viewer.view(imageList.childElementCount);
    setTimeout(() => {
      viewer.hide(true);
      done();
    }, 500);
  });

  it('should preload the next image', (done) => {
    const imageList = window.createImageList();
    const { createElement } = document;
    const images = [];

    const viewer = new Viewer(imageList, {
      navbar: false,

      viewed() {
        document.createElement = createElement;
        expect(images.some((image) => image.src.endsWith('/tibet-2.jpg'))).to.be.true;
        viewer.hide(true);
        done();
      },
    });

    document.createElement = (name, options) => {
      const image = createElement.call(document, name, options);

      if (name === 'img') {
        images.push(image);
      }

      return image;
    };

    viewer.show();
  });

  it('should preload the previous image when viewing a lower index', (done) => {
    const imageList = window.createImageList();
    const { createElement } = document;
    const images = [];
    let viewed = 0;

    const viewer = new Viewer(imageList, {
      initialViewIndex: 1,
      navbar: false,

      viewed() {
        viewed += 1;

        if (viewed === 1) {
          images.length = 0;
          viewer.view(0);
        } else {
          document.createElement = createElement;
          expect(images.some((image) => image.src.endsWith('/tibet-5.jpg'))).to.be.true;
          viewer.hide(true);
          done();
        }
      },
    });

    document.createElement = (name, options) => {
      const image = createElement.call(document, name, options);

      if (name === 'img') {
        images.push(image);
      }

      return image;
    };

    viewer.show();
  });

  it('should not preload the next image when disabled', (done) => {
    const imageList = window.createImageList();
    const { createElement } = document;
    const images = [];

    const viewer = new Viewer(imageList, {
      navbar: false,
      preload: false,

      viewed() {
        document.createElement = createElement;
        expect(images.some((image) => image.src.endsWith('/tibet-2.jpg'))).to.be.false;
        viewer.hide(true);
        done();
      },
    });

    document.createElement = (name, options) => {
      const image = createElement.call(document, name, options);

      if (name === 'img') {
        images.push(image);
      }

      return image;
    };

    viewer.show();
  });

  it('should fallback to thumbnail when the original image fails to load', (done) => {
    const imageList = window.createImageList();
    const viewer = new Viewer(imageList, {
      url() {
        return 'https://invalid-domain.example/invalid-image.jpg';
      },
      viewed(event) {
        expect(viewer.image.src).to.include('/base/docs/images/tibet-1.jpg');
        expect(event.detail.image.src).to.include('/base/docs/images/tibet-1.jpg');
        viewer.hide(true);
        done();
      },
    });

    viewer.show();
  });
});
