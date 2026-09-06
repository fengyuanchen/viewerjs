describe('navbar (option)', () => {
  it('should show navbar by default', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.not.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.be.true;
  });

  it('should not show navbar', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: false,

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.be.false;
  });

  ['small', 'medium', 'large'].forEach((size, index) => {
    it(`should show ${size} thumbnails`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: size,

        ready() {
          const item = viewer.list.firstElementChild;

          expect(item.offsetHeight).to.equal(40 + (index * 10));
          expect(item.offsetWidth / item.offsetHeight).to.equal(3 / 5);
          done();
        },
      });
    });
  });

  it('should support object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        size: 'large',
      },

      ready() {
        const item = viewer.list.firstElementChild;

        expect(window.getComputedStyle(viewer.navbar).display).to.not.equal('none');
        expect(item.offsetHeight).to.equal(60);
        expect(item.offsetWidth / item.offsetHeight).to.equal(3 / 5);
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      size: 'large',
    });
  });

  it('should hide navbar with object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        show: false,
      },

      ready() {
        expect(window.getComputedStyle(viewer.navbar).display).to.equal('none');
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      show: false,
    });
  });

  it('should support responsive visibility with object options', (done) => {
    const image = window.createImage();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        show: 3,
      },

      ready() {
        expect(viewer.navbar.className).to.include('viewer-hide-sm-down');
        done();
      },
    });

    expect(viewer.options.navbar).to.deep.equal({
      show: 3,
    });
  });

  ['small', 'medium', 'large'].forEach((size) => {
    it(`should support ${size} size in object options`, (done) => {
      const image = window.createImage();
      const viewer = new Viewer(image, {
        inline: true,
        navbar: {
          size,
        },

        ready() {
          expect(viewer.navbar.className).to.include(`viewer-${size}`);
          done();
        },
      });
    });
  });

  it('should limit the rendered thumbnail items and support distant views', (done) => {
    const image = window.createImageList();

    for (let i = 0; i < 15; i += 1) {
      const item = document.createElement('li');
      const thumbnail = document.createElement('img');

      thumbnail.src = '/base/docs/images/tibet-1.jpg';
      item.appendChild(thumbnail);
      image.appendChild(item);
    }

    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        visibleItemCount: 3,
      },

      ready() {
        expect(viewer.list.children.length).to.equal(3);

        viewer.view(19);
      },

      viewed(event) {
        expect(event.detail.index).to.equal(19);
        expect(viewer.list.children.length).to.equal(3);
        expect(viewer.list.querySelector('[data-index="19"]')).to.exist;
        const activeItem = viewer.list.querySelector('[data-index="19"]');
        const viewerRect = viewer.viewer.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        expect(itemRect.left + (itemRect.width / 2)).to.be.closeTo(
          viewerRect.left + (viewerRect.width / 2),
          1,
        );
        done();
      },
    });
  });

  it('should limit the visible item count to the number of images', (done) => {
    const image = window.createImageList();
    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        visibleItemCount: 100,
      },

      ready() {
        expect(viewer.list.children.length).to.equal(5);
        done();
      },
    });
  });

  it('should recalculate the default visible item count after resizing', (done) => {
    const image = window.createImageList();

    for (let i = 0; i < 20; i += 1) {
      const item = document.createElement('li');
      const thumbnail = document.createElement('img');

      thumbnail.src = '/base/docs/images/tibet-1.jpg';
      item.appendChild(thumbnail);
      image.appendChild(item);
    }

    const initialWidth = window.innerWidth;
    const viewer = new Viewer(image, {
      inline: true,

      ready() {
        viewer.view(19);
      },

      viewed() {
        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: 100,
        });
        viewer.resize();

        expect(viewer.list.children.length).to.equal(3);
        expect(viewer.list.querySelector('[data-index="19"]')).to.exist;

        Object.defineProperty(window, 'innerWidth', {
          configurable: true,
          value: initialWidth,
        });
        done();
      },
    });
  });

  it('should center the active item when navigating backwards to the window start', (done) => {
    const image = window.createImageList();

    for (let i = 0; i < 15; i += 1) {
      const item = document.createElement('li');
      const thumbnail = document.createElement('img');

      thumbnail.src = '/base/docs/images/tibet-1.jpg';
      item.appendChild(thumbnail);
      image.appendChild(item);
    }

    const viewer = new Viewer(image, {
      inline: true,
      initialViewIndex: 10,
      navbar: {
        visibleItemCount: 3,
      },

      ready() {
        viewer.prev();
      },

      viewed(event) {
        if (event.detail.index === 9) {
          const activeItem = viewer.list.querySelector('[data-index="9"]');
          const viewerRect = viewer.viewer.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();

          expect(itemRect.left + (itemRect.width / 2)).to.be.closeTo(
            viewerRect.left + (viewerRect.width / 2),
            1,
          );
          done();
        }
      },
    });
  });

  it('should center the last item when navigating backwards from the first item', (done) => {
    const image = window.createImageList();

    for (let i = 0; i < 15; i += 1) {
      const item = document.createElement('li');
      const thumbnail = document.createElement('img');

      thumbnail.src = '/base/docs/images/tibet-1.jpg';
      item.appendChild(thumbnail);
      image.appendChild(item);
    }

    const viewer = new Viewer(image, {
      inline: true,
      navbar: {
        visibleItemCount: 3,
      },

      ready() {
        viewer.view(0);
      },

      viewed(event) {
        if (event.detail.index === 0) {
          viewer.prev(true);
        } else if (event.detail.index === 19) {
          const activeItem = viewer.list.querySelector('[data-index="19"]');
          const viewerRect = viewer.viewer.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();

          expect(itemRect.left + (itemRect.width / 2)).to.be.closeTo(
            viewerRect.left + (viewerRect.width / 2),
            1,
          );
          done();
        }
      },
    });
  });
});
