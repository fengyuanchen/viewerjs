export default {
  /**
   * Enable a modal backdrop, specify `static` for a backdrop
   * which doesn't close the modal on click.
   * @type {boolean}
   */
  backdrop: true,

  /**
   * Show the button on the top-right of the viewer.
   * @type {boolean}
   */
  button: true,

  /**
   * Show the navbar.
   * @type {boolean | number}
   */
  navbar: true,

  /**
   * Specify the visibility and the content of the title.
   * @type {boolean | number | Function | Array}
   */
  title: true,

  /**
   * Show the toolbar.
   * @type {boolean | number | Object}
   */
  toolbar: true,

  /**
   * Custom class name(s) to add to the viewer's root element.
   * @type {string}
   */
  className: '',

  /**
   * Define where to put the viewer in modal mode.
   * @type {string | Element}
   */
  container: 'body',

  /**
   * Filter the images for viewing. Return true if the image is viewable.
   * @type {Function}
   */
  filter: null,

  /**
   * Enable to request fullscreen when play.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions}
   * @type {boolean|FullscreenOptions}
   */
  fullscreen: true,

  /**
   * Define the extra attributes to inherit from the original image.
   * @type {Array}
   */
  inheritedAttributes: [
    'crossOrigin',
    'decoding',
    'isMap',
    'loading',
    'referrerPolicy',
    'sizes',
    'srcset',
    'useMap',
  ],

  /**
   * Define the initial coverage of the viewing image.
   * @type {number}
   */
  initialCoverage: 0.9,

  /**
   * Define the initial index of the image for viewing.
   * @type {number}
   */
  initialViewIndex: 0,

  /**
   * Enable inline mode.
   * @type {boolean}
   */
  inline: false,

  /**
   * The amount of time to delay between automatically cycling an image when playing.
   * @type {number}
   */
  interval: 5000,

  /**
   * Enable keyboard support.
   * @type {boolean}
   */
  keyboard: true,

  /**
   * Focus the viewer when initialized.
   * @type {boolean}
   */
  focus: true,

  /**
   * Indicate if show a loading spinner when load image or not.
   * @type {boolean}
   */
  loading: true,

  /**
   * Indicate if enable loop viewing or not.
   * @type {boolean}
   */
  loop: true,

  /**
   * Min width of the viewer in inline mode.
   * @type {number}
   */
  minWidth: 200,

  /**
   * Min height of the viewer in inline mode.
   * @type {number}
   */
  minHeight: 100,

  /**
   * Enable to move the image.
   * @type {boolean}
   */
  movable: true,

  /**
   * Enable to rotate the image.
   * @type {boolean}
   */
  rotatable: true,

  /**
   * Enable to scale the image.
   * @type {boolean}
   */
  scalable: true,

  /**
   * Enable to zoom the image.
   * @type {boolean}
   */
  zoomable: true,

  /**
   * Enable to zoom the current image by dragging on the touch screen.
   * @type {boolean}
   */
  zoomOnTouch: true,

  /**
   * Enable to zoom the image by wheeling mouse.
   * @type {boolean}
   */
  zoomOnWheel: true,

  /**
   * Enable to slide to the next or previous image by swiping on the touch screen.
   * @type {boolean}
   */
  slideOnTouch: true,

  /**
   * Indicate if toggle the image size between its natural size
   * and initial size when double click on the image or not.
   * @type {boolean}
   */
  toggleOnDblclick: true,

  /**
   * Show the tooltip with image ratio (percentage) when zoom in or zoom out.
   * @type {boolean}
   */
  tooltip: true,

  /**
   * Enable CSS3 Transition for some special elements.
   * @type {boolean}
   */
  transition: true,

  /**
   * Define the CSS `z-index` value of viewer in modal mode.
   * @type {number}
   */
  zIndex: 2015,

  /**
   * Define the CSS `z-index` value of viewer in inline mode.
   * @type {number}
   */
  zIndexInline: 0,

  /**
   * Define the ratio when zoom the image by wheeling mouse.
   * @type {number}
   */
  zoomRatio: 0.1,

  /**
   * Define the min ratio of the image when zoom out.
   * @type {number}
   */
  minZoomRatio: 0.01,

  /**
   * Define the max ratio of the image when zoom in.
   * @type {number}
   */
  maxZoomRatio: 100,

  /**
   * Define where to get the original image URL for viewing.
   * @type {string | Function}
   */
  url: 'src',

  /**
   * Event shortcuts.
   * @type {Function}
   */
  ready: null,
  show: null,
  shown: null,
  hide: null,
  hidden: null,
  view: null,
  viewed: null,
  move: null,
  moved: null,
  rotate: null,
  rotated: null,
  scale: null,
  scaled: null,
  zoom: null,
  zoomed: null,
  play: null,
  stop: null,
};
