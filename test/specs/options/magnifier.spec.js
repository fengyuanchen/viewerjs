import {
  EVENT_POINTER_ENTER,
  EVENT_POINTER_LEAVE,
} from '../../../src/js/constants';

describe('magnifier (option)', () => {
  it('should be disabled by default', () => {
    const image = window.createImage();
    const viewer = new Viewer(image);

    expect(viewer.options.magnifier).to.be.false;
  });

  it('should show a configured magnifier while hovering in fullscreen mode', (done) => {
    const image = window.createImage();
    let viewer;

    image.addEventListener('viewed', () => {
      const rect = viewer.viewer.getBoundingClientRect();

      viewer.viewer.dispatchEvent(window.createEvent(EVENT_POINTER_ENTER, {
        clientX: rect.left + viewer.imageData.x + viewer.imageData.width / 2,
        clientY: rect.top + viewer.imageData.y + viewer.imageData.height / 2,
        pointerType: 'mouse',
      }));

      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;
      expect(viewer.magnifier.style.width).to.equal('120px');
      expect(viewer.magnifier.style.height).to.equal('120px');
      expect(viewer.magnifier.style.opacity).to.equal('0.5');
      expect(viewer.magnifierImage.src).to.contain('tibet-1.jpg');
      expect(viewer.magnifier.style.left).to.equal('');
      expect(viewer.magnifier.style.top).to.equal('');

      const initialMagnifierImageLeft = viewer.magnifierImage.style.left;
      viewer.move(20, 10);
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;
      expect(viewer.magnifierImage.style.left).to.not.equal(initialMagnifierImageLeft);

      viewer.rotate(90);
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;
      viewer.viewer.dispatchEvent(window.createEvent('pointermove', {
        clientX: rect.left + viewer.imageData.x + viewer.imageData.width / 2,
        clientY: rect.top + viewer.imageData.y + viewer.imageData.height / 2,
        pointerType: 'mouse',
      }));
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;
      expect(viewer.magnifierImage.style.transform).to.contain('rotate(90deg)');

      viewer.scaleX(-1);
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;
      viewer.viewer.dispatchEvent(window.createEvent('pointermove', {
        clientX: rect.left + viewer.imageData.x + viewer.imageData.width / 2,
        clientY: rect.top + viewer.imageData.y + viewer.imageData.height / 2,
        pointerType: 'mouse',
      }));
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.true;

      viewer.scaleX(0);
      viewer.viewer.dispatchEvent(window.createEvent('pointermove', {
        clientX: rect.left + viewer.imageData.x + viewer.imageData.width / 2,
        clientY: rect.top + viewer.imageData.y + viewer.imageData.height / 2,
        pointerType: 'mouse',
      }));
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.false;

      viewer.viewer.dispatchEvent(window.createEvent(EVENT_POINTER_LEAVE));
      expect(viewer.magnifier.classList.contains('viewer-show')).to.be.false;
      viewer.hide(true);
      done();
    });

    viewer = new Viewer(image, {
      magnifier: {
        size: 120,
        zoomRatio: 3,
        opacity: 0.5,
      },
    });
    viewer.show(true);
  });
});
