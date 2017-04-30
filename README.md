# Viewer.js

> JavaScript image viewer.

- [Website](https://fengyuanchen.github.io/viewerjs)

[![Build Status Images](https://travis-ci.org/fengyuanchen/viewerjs.svg)](https://travis-ci.org/fengyuanchen/viewerjs)



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

- Supports 29 [options](#options)
- Supports 23 [methods](#methods)
- Supports 7 [events](#events)
- Supports modal and inline modes
- Supports touch
- Supports move
- Supports zoom
- Supports rotation
- Supports scale (flip)
- Supports keyboard
- Cross-browser support



## Main

```
dist/
├── viewer.css       ( 8 KB)
├── viewer.min.css   ( 7 KB)
├── viewer.js        (60 KB, UMD)
├── viewer.min.js    (26 KB, UMD, compressed)
├── viewer.common.js (60 KB, CommonJS)
└── viewer.esm.js    (60 KB, ES Module)
```



## Getting started

### Quick start

Three quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/viewerjs/archive/master.zip).
- Clone the repository: `git clone https://github.com/fengyuanchen/viewerjs.git`.
- Install with [NPM](https://npmjs.com): `npm install viewerjs`.



### Installation

Include files:

```html
<link  href="/path/to/viewer.css" rel="stylesheet">
<script src="/path/to/viewer.js"></script>
```



### Usage

Initialize with `Viewer` constructor:

- Browser: `window.Viewer`
- CommonJS: `var Viewer = require('viewerjs')`
- ES2015: `import Viewer from 'viewerjs'`

```html
<!-- a block container is required -->
<div>
  <img id="image" src="picture.jpg" alt="Picture">
</div>

<div>
  <ul id="images">
    <li><img src="picture.jpg" alt="Picture"></li>
    <li><img src="picture-2.jpg" alt="Picture 2"></li>
    <li><img src="picture-3.jpg" alt="Picture 3"></li>
  </ul>
</div>
```

```js
// View one image
var viewer = new Viewer(document.getElementById('image'), options);

// View some images
var viewer = new Viewer(document.getElementById('images'), options);
```



## Keyboard support

> Only available in modal mode.

- `Esc`: Exit full screen or stop play.
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


### inline

- Type: `Boolean`
- Default: `false`

Enable inline mode.


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
  - `2`: show the navbar only when screen width great then 768 pixels
  - `3`: show the navbar only when screen width great then 992 pixels
  - `4`: show the navbar only when screen width great then 1200 pixels

Specify the visibility of the navbar.


### title

- Type: `Boolean` or `Number`
- Default: `true`
- Options:
  - `0` or `false`: hide the title
  - `1` or `true`: show the title
  - `2`: show the title only when screen width great then 768 pixels
  - `3`: show the title only when screen width great then 992 pixels
  - `4`: show the title only when screen width great then 1200 pixels

Specify the visibility of the title (the current image's name and dimensions).

> The name comes from the `alt` attribute of an image element or the image name parsed from URL.


### toolbar

- Type: `Boolean` or `Number`
- Default: `true`
- Options:
  - `0` or `false`: hide the toolbar
  - `1` or `true`: show the toolbar
  - `2`: show the toolbar only when screen width great then 768 pixels
  - `3`: show the toolbar only when screen width great then 992 pixels
  - `4`: show the toolbar only when screen width great then 1200 pixels

Specify the visibility of the toolbar.


### tooltip

- Type: `Boolean`
- Default: `true`

Show the tooltip with image ratio (percentage) when zoom in or zoom out


### movable

- Type: `Boolean`
- Default: `true`

Enable to move the image.


### zoomable

- Type: `Boolean`
- Default: `true`

Enable to zoom the image.


### rotatable

- Type: `Boolean`
- Default: `true`

Enable to rotate the image.


### scalable

- Type: `Boolean`
- Default: `true`

Enable to scale the image.


### transition

- Type: `Boolean`
- Default: `true`

Enable CSS3 Transition for some special elements.


### fullscreen

- Type: `Boolean`
- Default: `true`

Enable to request full screen when play.

> Requires the browser supports [Full Screen API](http://caniuse.com/fullscreen).


### keyboard

- Type: `Boolean`
- Default: `true`

Enable keyboard support.


### interval

- Type: `Number`
- Default: `5000`

Define interval of each image when playing.


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


### zIndex

- Type: `Number`
- Default: `2015`

Define the CSS `z-index` value of viewer in modal mode.


### zIndexInline

- Type: `Number`
- Default: `0`

Define the CSS `z-index` value of viewer in inline mode.


### url

- Type: `String` or `Function`
- Default: `'src'`

Define where to get the original image URL for viewing.

> If it is a string, it should be one of the attributes of each image element.
> If it is a function, it will be called on each image and should return a valid image URL.


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


[⬆ back to top](#table-of-contents)



## Methods

All methods allow chain composition.

As there are some **asynchronous** processes when start the viewer, you should call a method only when it is available, see the following **lifecycle**:

```js
new Viewer(image, {
  ready: function () {
    // 2 methods are available here: "show" and "destroy".
  },
  shown: function () {
    // 9 methods are available here: "hide", "view", "prev", "next", "play", "stop", "full", "exit" and "destroy".
  },
  viewed: function () {
    // All methods are available here except "show".
    this.viewer.zoomTo(1).rotateTo(180);
  }
});
```


### show()

Show the viewer.

> Only available in modal mode.



### hide()

hide the viewer.

> Only available in modal mode.



### view([index])

- **index** (optional):
  - Type: `Number`
  - Default: `0`
  - The index of the image for viewing

View one of the images with image's index.

```js
viewer.view(1); // View the second image
```


### prev()

View the previous image.


### next()

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


### play()

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

```js
var viewer;

image.addEventListener('viewed', function () {
  console.log(this.viewer === viewer);
  // -> true
}, false);

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

Please read through our [contributing guidelines](CONTRIBUTING.md).



## Versioning

Maintained under the [Semantic Versioning guidelines](http://semver.org/).



## License

[MIT](http://opensource.org/licenses/MIT) © [Fengyuan Chen](http://chenfengyuan.com)


[⬆ back to top](#table-of-contents)
