# Viewer.js

[![Build Status](https://img.shields.io/travis/fengyuanchen/viewerjs.svg)](https://travis-ci.org/fengyuanchen/viewerjs) [![Downloads](https://img.shields.io/npm/dm/viewerjs.svg)](https://www.npmjs.com/package/viewerjs) [![Version](https://img.shields.io/npm/v/viewerjs.svg)](https://www.npmjs.com/package/viewerjs)

> JavaScript image viewer.

- [Website](https://fengyuanchen.github.io/viewerjs)
- [jquery-viewer](https://github.com/fengyuanchen/jquery-viewer) - A jQuery plugin wrapper for Viewer.js.

## Table of contents

- [Features](#features)
- [Main](#main)
- [Getting started](#getting-started)
- [Keyboard support](#keyboard-support)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [License](#license)

## Features

- Supports 42 [options](#options)
- Supports 23 [methods](#methods)
- Supports 9 [events](#events)
- Supports modal and inline modes
- Supports touch
- Supports move
- Supports zoom
- Supports rotation
- Supports scale (flip)
- Supports keyboard
- Cross-browser support

## Main

```text
dist/
├── viewer.css
├── viewer.min.css   (compressed)
├── viewer.js        (UMD)
├── viewer.min.js    (UMD, compressed)
├── viewer.common.js (CommonJS, default)
└── viewer.esm.js    (ES Module)
```

## Getting started

### Installation

```shell
npm install viewerjs
```

In browser:

```html
<link  href="/path/to/viewer.css" rel="stylesheet">
<script src="/path/to/viewer.js"></script>
```

The [cdnjs](https://github.com/cdnjs/cdnjs) provides CDN support for Viewer.js's CSS and JavaScript. You can find the links [here](https://cdnjs.com/libraries/viewerjs).

### Usage

#### Syntax

```js
new Viewer(element[, options])
```

- **element**
  - Type: `HTMLElement`
  - The target image or container of images for viewing.

- **options** (optional)
  - Type: `Object`
  - The options for viewing. Check out the available [options](#options).

#### Example

```html
<!-- a block container is required -->
<div>
  <img id="image" src="picture.jpg" alt="Picture">
</div>

<div>
  <ul id="images">
    <li><img src="picture-1.jpg" alt="Picture 1"></li>
    <li><img src="picture-2.jpg" alt="Picture 2"></li>
    <li><img src="picture-3.jpg" alt="Picture 3"></li>
  </ul>
</div>
```

```js
// You should import the CSS file.
// import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

// View an image
const viewer = new Viewer(document.getElementById('image'), {
  inline: true,
  viewed() {
    viewer.zoomTo(1);
  },
});
// Then, show the image by click it, or call `viewer.show()`.

// View a list of images
const gallery = new Viewer(document.getElementById('images'));
// Then, show one image by click it, or call `gallery.show()`.
```

## Keyboard support

> Only available in modal mode.

- `Esc`: Exit full screen or close the viewer or exit modal mode or stop play.
- `Space`: Stop play.
- `←`: View the previous image.
- `→`: View the next image.
- `↑`: Zoom in the image.
- `↓`: Zoom out the image.
- `Ctrl + 0`: Zoom out to initial size.
- `Ctrl + 1`: Zoom in to natural size.

[⬆ back to top](#table-of-contents)

## Options

You may set viewer options with `new Viewer(image, options)`.
If you want to change the global default options, You may use `Viewer.setDefaults(options)`.

### backdrop

- Type: `Boolean` or `String`
- Default: `true`

Enable a modal backdrop, specify `static` for a backdrop which doesn't close the modal on click.

### button

- Type: `Boolean`
- Default: `true`

Show the button on the top-right of the viewer.

### navbar

- Type: `Boolean` or `Number`
- Default: `true`
- Options:
  - `0` or `false`: hide the navbar
  - `1` or `true`: show the navbar
  - `2`: show the navbar only when the screen width is greater than 768 pixels
  - `3`: show the navbar only when the screen width is greater than 992 pixels
  - `4`: show the navbar only when the screen width is greater than 1200 pixels

Specify the visibility of the navbar.

### title

- Type: `Boolean` or `Number` or `Function` or `Array`
- Default: `true`
- Options:
  - `0` or `false`: hide the title
  - `1` or `true` or `Function` or `Array`: show the title
  - `2`: show the title only when the screen width is greater than 768 pixels
  - `3`: show the title only when the screen width is greater than 992 pixels
  - `4`: show the title only when the screen width is greater than 1200 pixels
  - `Function`: customize the title content
  - `[Number, Function]`: the first element indicate the visibility, the second element customize the title content

Specify the visibility and the content of the title.

> The name comes from the `alt` attribute of an image element or the image name parsed from URL.

For example, `title: 4` equals to:

```js
new Viewer(image, {
  title: [4, (image, imageData) => `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`]
});
```

### toolbar

- Type: `Boolean` or `Number` or `Object`
- Default: `true`
- Options:
  - `0` or `false`: hide the toolbar.
  - `1` or `true`: show the toolbar.
  - `2`: show the toolbar only when the screen width is greater than 768 pixels.
  - `3`: show the toolbar only when the screen width is greater than 992 pixels.
  - `4`: show the toolbar only when the screen width is greater than 1200 pixels.
  - `{ key: Boolean | Number }`: show or hide the toolbar.
  - `{ key: String }`: customize the size of the button.
  - `{ key: Function }`: customize the click handler of the button.
  - `{ key: { show: Boolean | Number, size: String, click: Function }`: customize each property of the button.
  - Available keys: "zoomIn", "zoomOut", "oneToOne", "reset", "prev", "play", "next", "rotateLeft", "rotateRight", "flipHorizontal" and "flipVertical".
  - Available sizes: "small", "medium" (default) and "large".

Specify the visibility and layout of the toolbar its buttons.

For example, `toolbar: 4` equals to:

```js
new Viewer(image, {
  toolbar: {
    zoomIn: 4,
    zoomOut: 4,
    oneToOne: 4,
    reset: 4,
    prev: 4,
    play: {
      show: 4,
      size: 'large',
    },
    next: 4,
    rotateLeft: 4,
    rotateRight: 4,
    flipHorizontal: 4,
    flipVertical: 4,
  },
});
```

### className

- Type: `String`
- Default: `''`

Custom class name(s) to add to the viewer's root element.

### container

- Type: `Element` or `String`
- Default: `'body'`
- An element or a valid selector for [Document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

The container to put the viewer in modal mode.

> Only available when the `inline` option is set to `false`.

### filter

- Type: `Function`
- Default: `null`

Filter the images for viewing (should return `true` if the image is viewable).

For example:

```js
new Viewer(image, {
  filter(image) {
    return image.complete;
  },
});
```

### fullscreen

- Type: `Boolean`
- Default: `true`

Enable to request full screen when play.

> Requires the browser supports [Full Screen API](https://caniuse.com/fullscreen).

### initialViewIndex

- Type: `Number`
- Default: `0`

Define the initial index of image for viewing.

> Also used as the default parameter value of the `view` method.

### inline

- Type: `Boolean`
- Default: `false`

Enable inline mode.

### interval

- Type: `Number`
- Default: `5000`

The amount of time to delay between automatically cycling an image when playing.

### keyboard

- Type: `Boolean`
- Default: `true`

Enable keyboard support.

### loading

- Type: `Boolean`
- Default: `true`

Indicate if show a loading spinner when load image or not.

### loop

- Type: `Boolean`
- Default: `true`

Indicate if enable loop viewing or not.

> If the current image is the last one, then the next one to view is the first one, and vice versa.

### minWidth

- Type: `Number`
- Default: 200

Define the minimum width of the viewer.

> Only available in inline mode (set the `inline` option to `true`).

### minHeight

- Type: `Number`
- Default: 100

Define the minimum height of the viewer.

> Only available in inline mode (set the `inline` option to `true`).

### movable

- Type: `Boolean`
- Default: `true`

Enable to move the image.

### rotatable

- Type: `Boolean`
- Default: `true`

Enable to rotate the image.

### scalable

- Type: `Boolean`
- Default: `true`

Enable to scale the image.

### zoomable

- Type: `Boolean`
- Default: `true`

Enable to zoom the image.

### zoomOnTouch

- Type: `Boolean`
- Default: `true`

Enable to zoom the current image by dragging on the touch screen.

### zoomOnWheel

- Type: `Boolean`
- Default: `true`

Enable to zoom the image by wheeling mouse.

### slideOnTouch

- Type: `Boolean`
- Default: `true`

Enable to slide to the next or previous image by swiping on the touch screen.

### toggleOnDblclick

- Type: `Boolean`
- Default: `true`

Indicate if toggle the image size between its natural size and initial size when double click on the image or not.

In other words, call the [`toggle`](#toggle) method automatically when double click on the image.

> Requires [`dblclick`](https://developer.mozilla.org/en-US/docs/Web/Events/dblclick) event support.

### tooltip

- Type: `Boolean`
- Default: `true`

Show the tooltip with image ratio (percentage) when zoom in or zoom out.

### transition

- Type: `Boolean`
- Default: `true`

Enable CSS3 Transition for some special elements.

### zIndex

- Type: `Number`
- Default: `2015`

Define the CSS `z-index` value of viewer in modal mode.

### zIndexInline

- Type: `Number`
- Default: `0`

Define the CSS `z-index` value of viewer in inline mode.

### zoomRatio

- Type: `Number`
- Default: `0.1`

Define the ratio when zoom the image by wheeling mouse.

### minZoomRatio

- Type: `Number`
- Default: `0.01`

Define the min ratio of the image when zoom out.

### maxZoomRatio

- Type: `Number`
- Default: `100`

Define the max ratio of the image when zoom in.

### url

- Type: `String` or `Function`
- Default: `'src'`

Define where to get the original image URL for viewing.

> If it is a string, it should be one of the attributes of each image element.
> If it is a function, it should return a valid image URL.

For example:

```html
<img src="picture.jpg?size=160">
```

```js
new Viewer(image, {
  url(image) {
    return image.src.replace('?size=160', '');
  },
});
```

### ready

- Type: `Function`
- Default: `null`

A shortcut of the `ready` event.

### show

- Type: `Function`
- Default: `null`

A shortcut of the `show` event.

### shown

- Type: `Function`
- Default: `null`

A shortcut of the `shown` event.

### hide

- Type: `Function`
- Default: `null`

A shortcut of the `hide` event.

### hidden

- Type: `Function`
- Default: `null`

A shortcut of the `hidden` event.

### view

- Type: `Function`
- Default: `null`

A shortcut of the `view` event.

### viewed

- Type: `Function`
- Default: `null`

A shortcut of the `viewed` event.

### zoom

- Type: `Function`
- Default: `null`

A shortcut of the `zoom` event.

### zoomed

- Type: `Function`
- Default: `null`

A shortcut of the `zoomed` event.

[⬆ back to top](#table-of-contents)

## Methods

All methods allow chain composition.

As there are some **asynchronous** processes when start the viewer, you should call a method only when it is available, see the following **lifecycle**:

```js
new Viewer(image, {
  ready() {
    // 2 methods are available here: "show" and "destroy".
  },
  shown() {
    // 9 methods are available here: "hide", "view", "prev", "next", "play", "stop", "full", "exit" and "destroy".
  },
  viewed() {
    // All methods are available here except "show".
    this.viewer.zoomTo(1).rotateTo(180);
  }
});
```

### show([immediate])

- **immediate** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Indicates if show the viewer immediately or not.

Show the viewer.

> Only available in modal mode.

### hide([immediate])

- **immediate** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Indicates if hide the viewer immediately or not.

hide the viewer.

> Only available in modal mode.

### view([index])

- **index** (optional):
  - Type: `Number`
  - Default: `0` (inherits from the `initialViewIndex` option)
  - The index of the image for viewing

View one of the images with image's index. If the viewer is not shown, will show the viewer first.

```js
viewer.view(1); // View the second image
```

### prev([loop=false])

- **loop** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Indicate if turn to view the last one when it is the first one at present.

View the previous image.

### next([loop=false])

- **loop** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Indicate if turn to view the first one  when it is the last one at present.

View the next image.

### move(offsetX[, offsetY])

- **offsetX**:
  - Type: `Number`
  - Moving size (px) in the horizontal direction

- **offsetY** (optional):
  - Type: `Number`
  - Moving size (px) in the vertical direction.
  - If not present, its default value is `offsetX`

Move the image with relative offsets.

```js
viewer.move(1);
viewer.move(-1, 0); // Move left
viewer.move(1, 0);  // Move right
viewer.move(0, -1); // Move up
viewer.move(0, 1);  // Move down
```

### moveTo(x[, y])

- **x**:
  - Type: `Number`
  - The `left` value of the image

- **y** (optional):
  - Type: `Number`
  - The `top` value of the image
  - If not present, its default value is `x`.

Move the image to an absolute point.

### zoom(ratio[, hasTooltip])

- **ratio**:
  - Type: `Number`
  - Zoom in: requires a positive number (ratio > 0)
  - Zoom out: requires a negative number (ratio < 0)

- **hasTooltip** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Show tooltip

Zoom the image with a relative ratio

```js
viewer.zoom(0.1);
viewer.zoom(-0.1);
```

### zoomTo(ratio[, hasTooltip])

- **ratio**:
  - Type: `Number`
  - Requires a positive number (ratio > 0)

- **hasTooltip** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Show tooltip

Zoom the image to an absolute ratio.

```js
viewer.zoomTo(0); // Zoom to zero size (0%)
viewer.zoomTo(1); // Zoom to natural size (100%)
```

### rotate(degree)

- **degree**:
  - Type: `Number`
  - Rotate right: requires a positive number (degree > 0)
  - Rotate left: requires a negative number (degree < 0)

Rotate the image with a relative degree.

```js
viewer.rotate(90);
viewer.rotate(-90);
```

### rotateTo(degree)

- **degree**:
  - Type: `Number`

Rotate the image to an absolute degree.

```js
viewer.rotateTo(0); // Reset to zero degree
viewer.rotateTo(360); // Rotate a full round
```

### scale(scaleX[, scaleY])

- **scaleX**:
  - Type: `Number`
  - Default: `1`
  - The scaling factor to apply on the abscissa of the image
  - When equal to `1` it does nothing.

- **scaleY** (optional):
  - Type: `Number`
  - The scaling factor to apply on the ordinate of the image
  - If not present, its default value is `scaleX`.

Scale the image.

```js
viewer.scale(-1); // Flip both horizontal and vertical
viewer.scale(-1, 1); // Flip horizontal
viewer.scale(1, -1); // Flip vertical
```

### scaleX(scaleX)

- **scaleX**:
  - Type: `Number`
  - Default: `1`
  - The scaling factor to apply on the abscissa of the image
  - When equal to `1` it does nothing

Scale the abscissa of the image.

```js
viewer.scaleX(-1); // Flip horizontal
```

### scaleY(scaleY)

- **scaleY**:
  - Type: `Number`
  - Default: `1`
  - The scaling factor to apply on the ordinate of the image
  - When equal to `1` it does nothing

Scale the ordinate of the image.

```js
viewer.scaleY(-1); // Flip vertical
```

### play([fullscreen])

- **fullscreen** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Indicate if request fullscreen or not.

Play the images.

### stop()

Stop play.

### full()

Enter modal mode.

> Only available in inline mode.

### exit()

Exit  modal mode.

> Only available in inline mode.

### tooltip()

Show the current ratio of the image with percentage.

> Requires the `tooltip` option set to `true`.

### toggle()

Toggle the image size between its natural size and initial size.

> Used by the [`toggleOnDblclick`](#toggleOnDblclick) option.

### reset()

Reset the image to its initial state.

### update()

Update the viewer instance when the source images changed (added, removed or sorted).

> If you load images dynamically (with XMLHTTPRequest), you can use this method to add the new images to the viewer instance.

### destroy()

Destroy the viewer and remove the instance.

[⬆ back to top](#table-of-contents)

## Events

All events can access the viewer instance with `this.viewer` in its handler.

> Be careful to use these events in other component which has the same event names, e.g.: [Bootstrap](https://getbootstrap.com/)'s modal.

```js
let viewer;

image.addEventListener('viewed', function () {
  console.log(this.viewer === viewer);
  // > true
});

viewer = new Viewer(image);
```

### ready

This event fires when a viewer instance is ready for viewing.

> In modal mode, this event will not be triggered until you click on one of the images.

### show

This event fires when the viewer modal starts to show.

> Only available in modal mode.

### shown

This event fires when the viewer modal has shown.

> Only available in modal mode.

### hide

This event fires when the viewer modal starts to hide.

> Only available in modal mode.

### hidden

This event fires when the viewer modal has hidden.

> Only available in modal mode.

### view

- **event.detail.originalImage**:
  - Type: `HTMLImageElement`
  - The original image.

- **event.detail.index**:
  - Type: `Number`
  - The index of the original image.

- **event.detail.image**:
  - Type: `HTMLImageElement`
  - The current image (a clone of the original image).

This event fires when a viewer starts to show (view) an image.

### viewed

- **event.detail**: the same as the `view` event.

This event fires when a viewer has shown (viewed) an image.

### zoom

- **event.detail.originalEvent**:
  - Type: `Event`
  - Options: `wheel`, `touchmove`.

- **event.detail.oldRatio**:
  - Type: `Number`
  - The old (current) ratio of the image.

- **event.detail.ratio**:
  - Type: `Number`
  - The new (next) ratio of the image (`imageData.width / imageData.naturalWidth`).

This event fires when a viewer starts to zoom (in or out) an image.

### zoomed

- **event.detail**: the same as the `zoom` event.

This event fires when a viewer has zoomed (in or out) an image.

[⬆ back to top](#table-of-contents)

## No conflict

If you have to use other viewer with the same namespace, just call the `Viewer.noConflict` static method to revert to it.

```html
<script src="other-viewer.js"></script>
<script src="viewer.js"></script>
<script>
  Viewer.noConflict();
  // Code that uses other `Viewer` can follow here.
</script>
```

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)
- Internet Explorer 9+

## Contributing

Please read through our [contributing guidelines](.github/CONTRIBUTING.md).

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Chen Fengyuan](https://chenfengyuan.com/)

[⬆ back to top](#table-of-contents)
