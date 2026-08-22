# Changelog

## 1.12.0 (Aug 22, 2026)

- Add keyboard support for opening images in the gallery and clean up the related event listeners.
- Improve the class-name check in the `hasClass` function.
- Prevent an `aria-hidden` focus conflict when closing the viewer with the close button (#648).
- Prevent image dragging from being interpreted as a double click (#646).

## 1.11.9 (Aug 21, 2026)

- Add the missing compressed files (#669).
- Improve the class-name check in the `removeClass` function.

## 1.11.8 (Jul 18, 2026)

- Fix an incorrect reference to the `focus` option (#667).

## 1.11.7 (Nov 24, 2024)

- Use SVG icons for improved visual effects (#637).

## 1.11.6 (Sep 17, 2023)

- Fix an issue where some CSS styles were incompatible with old browsers (#611).

## 1.11.5 (Aug 26, 2023)

- Fix title flickering when opening the same image again (#609).

## 1.11.4 (Jul 23, 2023)

- Fix the incorrect RegExp used for Safari browser detection (#606).

## 1.11.3 (Mar 5, 2023)

- Prevent movement when `offsetX/Y` is `0` (#585, #588).

## 1.11.2 (Jan 1, 2023)

- Do not close the viewer when dragging the image on the backdrop (#577).

## 1.11.1 (Nov 6, 2022)

- Add missing type definitions for the `initialCoverage` option and the `zoom` and `zoomTo` methods (#571).

## 1.11.0 (Oct 16, 2022)

- Add a new option: `initialCoverage` (#314, #526).
- Don't load images in the list when hiding the navbar (#451).
- Support providing pivot-pointer coordinates to the `zoom` and `zoomTo` methods (#202).
- Don't override the body's right padding when the scrollbar width is zero (#197).
- Add keyboard support while playing a view (#90).

## 1.10.5 (Apr 5, 2022)

- Continue initialization even if some images fail to load in inline mode.
- Avoid conflicts with nested modals (#540).

## 1.10.4 (Feb 13, 2022)

- Use legacy color function notation for better compatibility (#529).

## 1.10.3 (Feb 2, 2022)

- Get the `pageX`/`pageY` properties from the original event when handling an emulated double click on touch devices (#527).
- Improve the zoom experience on touch screens (#510).

## 1.10.2 (Oct 22, 2021)

- Increase the title height to avoid truncation (#509).
- Fix a `TypeError` when there are no images (#504).
- Remove the loading class when an image fails to load (#502).

## 1.10.1 (Aug 1, 2021)

- Check whether the active item exists to avoid a `TypeError` (#491).
- Compute the nav-item gutter dynamically (#487).

## 1.10.0 (Jun 12, 2021)

- Enhance the `fullscreen` option and `play` method to support [`FullscreenOptions`](https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions) (#482, #483).
- Refactor the `toggle` method to toggle the image between its current and natural ratios (#477).
- Improve the `toggle` method for double-click zooming (#422).

## 1.9.2 (May 29, 2021)

- Avoid conflicts with other modals (#474).
- Allow `ToolbarOption` to be undefined (#473).

## 1.9.1 (May 22, 2021)

- Fix the missing declaration of the `focus` option (#470).

## 1.9.0 (Dec 6, 2020)

- Add 6 new events: `move`, `moved`, `rotate`, `rotated`, `scale`, and `scaled`.
- Add an example for limiting the moving range with the help of the `move` event.

## 1.8.0 (Nov 8, 2020)

- Add a new option: `focus`.
- Add ARIA attributes for better accessibility.
- Add the `Tab` and `Enter` keys to the keyboard support.
- Check whether the `pointer` object is defined for better compatibility (#421).

## 1.7.1 (Sep 29, 2020)

- Fix an issue in the `types/index.d.ts` file (#414).

## 1.7.0 (Sep 26, 2020)

- Add 2 new events: `play` and `stop` (#411).
- Make the `viewed`, `zoomed`, and `hidden` events non-cancelable.
- Improve the TypeScript declarations in `types/index.d.ts`.

## 1.6.2 (Aug 30, 2020)

- Improve the `hide` method for some edge cases (#407).
- Improve the wheel zoom behavior (#396).
- Fix incorrect use of `this` in ES6+ (#395).

## 1.6.1 (Jun 14, 2020)

- Improve image filtering.

## 1.6.0 (Jun 6, 2020)

- Add a new option: `inheritedAttributes`.
- Remove unnecessary `padding-right: 0px` from the `body` element when closing the viewer modal (#394).
- Reset the `padding-right` of the `body` element when resizing (#379).
- Improve the `hide` method for unexpected calls (#367).
- Ignore images without the `src` attribute (#326).

## 1.5.0 (Nov 23, 2019)

- Force reflow of the element in a new way to avoid side effects (#343).
- Add a new option: `slideOnTouch` (#340).
- Check whether the queried image exists when updating the image list (#333).

## 1.4.0 (Oct 26, 2019)

- Add two new options: `zoomOnTouch` and `zoomOnWheel` (#329).

## 1.3.7 (Oct 2, 2019)

- Improve event type detection for iOS 13+ (#321).
- Ignore an invalid `element` parameter in the class utility functions (#317).
- Do nothing if the `index` value is invalid when calling the `view` method (#312).

## 1.3.6 (Jul 4, 2019)

- Avoid escaping URLs (#298, #301).
- Avoid using the `innerHTML` property for security (#269).

## 1.3.5 (Jun 29, 2019)

- Improve the escaping function to avoid escaping HTML entities repeatedly.

## 1.3.4 (Jun 1, 2019)

- Decode the image name when it comes from a URL (#282).
- Fix the missing fade-out transition when hiding the viewer (#275).
- Escape all strings used in HTML for better security (#269).

## 1.3.3 (Apr 6, 2019)

- Fix unexpected modal exit behavior when the mouse is pressed (#255).
- Abort image downloads when canceling viewing for better performance.

## 1.3.2 (Jan 24, 2019)

- Fix the `Document not active` error when calling the `exit` method.
- Improve wheel event listening for better performance (#102).

## 1.3.1 (Dec 9, 2018)

- Ignore pointer events when a non-primary button is pressed (#221).
- Emulate clicks (single taps) and double clicks (double taps) on touch devices to support backdrop interaction and image zooming (#210).

## 1.3.0 (Oct 25, 2018)

- Fix the wrong click action when the target image is ignored by the `filter` option (#211).
- Add a new option: `className` (#209).

## 1.2.1 (Oct 20, 2018)

- Improve viewer instance storage to avoid side effects.
- Fix an `Object.assign` parameter error on iOS devices.

## 1.2.0 (Jul 15, 2018)

- Enhance the `title` option to support customizing title content (#54, #185).
- Add 2 new options: `toggleOnDblclick` (#173) and `initialViewIndex` (#183).

## 1.1.0 (May 27, 2018)

- Make the touch zooming smoother (#162).
- Add 2 new events: `zoom` and `zoomed` (#144).

## 1.0.1 (May 20, 2018)

- Add a namespace to data attribute names (from `data-*` to `data-viewer-*`) to avoid side effects.
- Make sure the image data is a non-null object to avoid unexpected errors.
- Fix broken zoom functionality in iOS browsers (#167).

## 1.0.0 (Apr 1, 2018)

- Add browser detection to support importing in Node.js.
- Cancel the update when there are no images while calling the `update` method.

## 1.0.0-rc.1 (Mar 13, 2018)

- Fix the wrong image switching behavior in iOS browsers.
- Fix a `TypeError` in strict mode (#149).
- Fix an issue with the type definitions of the `show` and `hide` methods.

## 1.0.0-rc (Mar 10, 2018)

- Add a new option: `loading`.
- Add type definitions file for TypeScript.
- Enhance the `show`, `hide`, and `play` methods.
- Change the default value of the `loop` option from `false` to `true`.

## 1.0.0-beta.2 (Feb 13, 2018)

- Add a new option: `container`.
- Restore the missing default value of the `interval` option (#133).

## 1.0.0-beta.1 (Dec 23, 2017)

- Add a new option: `backdrop`.

## 1.0.0-beta (Dec 12, 2017)

- Add a `style` field to `package.json`.
- Fall back to `document.documentElement` if `document.body` does not exist (#120).
- Fix the NodeList destructuring issue (#118).

## 0.10.0 (Nov 5, 2017)

- Add a new option: `loop`.
- Enhance toolbar customization.

## 0.9.0 (Nov 4, 2017)

- Add a new option: `filter`.
- Support toolbar layout customization (#79).
- Enhance the `prev` and `next` methods (#47).
- Disallow showing the viewer again after it has been shown.

## 0.8.0 (Oct 8, 2017)

- Refactor the code by separating constants, simplifying utilities, and so on.
- Stop playback after exiting fullscreen.
- Improve JSDoc.

## 0.7.2 (Aug 19, 2017)

- Fix multiple active items in the navbar (#75).
- Ignore the mouse down event when the viewer is hiding (#70).

## 0.7.1 (May 14, 2017)

- Support using the viewer in a modal (#39).

## 0.7.0 (Apr 30, 2017)

- Change the `main` field value from `dist/viewer.js` (UMD) to `dist/viewer.common.js` (CommonJS).
- Add `module` and `browser` fields to `package.json`.
- Fix an issue with touch zoom.

## 0.6.2 (Mar 4, 2017)

- Fix the touch-and-move issue (#63).

## 0.6.1 (Feb 18, 2017)

- Prevent the default behavior of dragging (#63).

## 0.6.0 (Jan 24, 2017)

- Port the JavaScript code to ECMAScript 6.
- Port the CSS code to CSSNext.

## 0.5.1 (Jan 2, 2017)

- Improve event handling for Pointer Events.

## 0.5.0 (July 22, 2016)

- Improve modal opening and closing.
- Remove the `build` event.
- Rename `built` event to `ready`.
- Fix a bug in setting and getting `data-*` attributes (#33).

## 0.4.0 (Mar 20, 2016)

- Add properties to `event.detail` for the "view" and "viewed" events.

## 0.3.3 (Mar 19, 2016)

- Fix the issue of hiding the wrong element in the "view" method (#19).

## 0.3.2 (Mar 11, 2016)

- Fix the parameter error in the `url` option when it is a function.

## 0.3.1 (Feb 2, 2016)

- Add tests.
- Ignore invalid class names.
- Re-render the image only after it has been viewed.

## 0.3.0 (Jan 21, 2016)

- Add more available values to the "title", "toolbar", and "navbar" options.
- Support toggling the visibility of the title, toolbar, and navbar at different screen widths.
- Exit fullscreen when stop playing.
- Fix a bug where the title was not generated.

## 0.2.0 (Jan 1, 2016)

- Add an "update" method for dynamically updating images.
- Hide the title and toolbar on small screens (width < 768px).

## 0.1.1 (Dec 28, 2015)

- Support zooming from the event's triggering point.
- Optimize the "toggle" method.
- Fix a bug with the index of the viewed image.

## 0.1.0 (Dec 24, 2015)

- Support two modes: "modal" (default) and "inline".
- Support 30 options: "inline", "button", "navbar", "title", "toolbar", "tooltip", "movable", "zoomable", "rotatable", "scalable", "transition", "fullscreen", "keyboard", "interval", "minWidth", "minHeight", "zoomRatio", "minZoomRatio", "maxZoomRatio", "zIndex", "zIndexInline", "url", "build", "built", "show", "shown", "hide", "hidden", "view", and "viewed".
- Support 22 methods: "show", "hide", "view", "prev", "next", "move", "moveTo", "zoom", "zoomTo", "rotate", "rotateTo", "scale", "scaleX", "scaleY", "play", "stop", "full", "exit", "tooltip", "toggle", "reset", and "destroy".
- Support 8 events: "build", "built", "show", "shown", "hide", "hidden", "view", and "viewed".
