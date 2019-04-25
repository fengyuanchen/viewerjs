# Changelog

## next

- Escape all strings that use in HTML for better security (#269).

## 1.3.3 (Apr 6, 2019)

- Fix unexpected modal exiting behavior when the mouse is pressed (#255).
- Abort image downloading when cancel viewing for better performance.

## 1.3.2 (Jan 24, 2019)

- Fix `Document not active` error when calling the `exit` method.
- Improve wheel event listening for better performance (#102).

## 1.3.1 (Dec 9, 2018)

- Emulate click (single tap) and double click (double tap) in touch devices to support backdrop and image zooming (#210).
- Ignore pointer events when not the primary button was pressed (#221).

## 1.3.0 (Oct 25, 2018)

- Add a new option: `className` (#209).
- Fix wrong click action when the target image is ignored by the `filter` option (#211)

## 1.2.1 (Oct 20, 2018)

- Improve viewer instance storage to avoid side effect.
- Fix parameter error of `Object.assign` in iOS devices.

## 1.2.0 (Jul 15, 2018)

- Add 2 new options: `toggleOnDblclick` (#173) and `initialViewIndex` (#183).
- Enhance the `title` option to support to customize title content (#54, #185).

## 1.1.0 (May 27, 2018)

- Add 2 new events: `zoom` and `zoomed` (#144).
- Make the touch zooming more smoother (#162).

## 1.0.1 (May 20, 2018)

- Add namespace to data attribute names (from `data-*` to `data-viewer-*`) to avoid side effect.
- Make sure the image data is a non-null object to avoid unexpected errors.
- Fix broken zoom feature in iOS browsers (#167).

## 1.0.0 (Apr 1, 2018)

- Add in browser checking to support to import in Node.js.
- Cancel update when there are no images when call the `update` method.

## 1.0.0-rc.1 (Mar 13, 2018)

- Fix the wrong image switching behavior in iOS browsers.
- Fix a `TypeError` in strict mode (#149).
- Fix type definitions issue of the `show` and `hide` methods.

## 1.0.0-rc (Mar 10, 2018)

- Add a new option: `loading`.
- Add type definitions file for TypeScript.
- Enhance the `show`, `hide` and `play` methods.
- Change the default value of `loop` option from `false` to `true`.

## 1.0.0-beta.2 (Feb 13, 2018)

- Add a new option: `container`.
- Recover the missing default value of the `interval` option (#133).

## 1.0.0-beta.1 (Dec 23, 2017)

- Add a new option: `backdrop`.

## 1.0.0-beta (Dec 12, 2017)

- Add `style` field to `package.json`.
- Fix the issue of NodeList deconstructing (#118).
- Fall back to `document.documentElement` if `document.body` is not existing (#120).

## 0.10.0 (Nov 5, 2017)

- Add a new option: `loop`.
- Enhance toolbar customization.

## 0.9.0 (Nov 4, 2017)

- Add a new option: `filter`.
- Enhance the `prev` and `next` methods (#47).
- Support to customize the layout of toolbar (#79).
- Disallow to show again if it had shown.

## 0.8.0 (Oct 8, 2017)

- Refactor - separate constants, simplify utilities, and so on.
- Stop play after exited fullscreen.
- Improve JSDoc.

## 0.7.2 (Aug 19, 2017)

- Ignore mouse down event when the viewer is hiding (#70).
- Fixed multiple active items in navbar (#75).

## 0.7.1 (May 14, 2017)

- Support to use Viewer in a modal (#39).

## 0.7.0 (Apr 30, 2017)

- Changed the `main` field value from `dist/viewer.js` (UMD) to `dist/viewer.common.js` (CommonJS).
- Added `module` and `browser` fields to `package.json`.
- Fixed an issue of touch zoom.

## 0.6.2 (Mar 4, 2017)

- Fixed the issue of touch and move problem (#63).

## 0.6.1 (Feb 18, 2017)

- Prevented the default behaviour of drag action (#63).

## 0.6.0 (Jan 24, 2017)

- Ported JavaScript code to ECMAScript 6.
- Ported CSS code to CSSNext.

## 0.5.1 (Jan 2, 2017)

- Improved event handler for Pointer Events.

## 0.5.0 (July 22, 2016)

- Improve modal opening and closing.
- Remove `build` event.
- Rename `built` event to `ready`.
- Fixed a bug of `data-*` attributes setting and getting (#33).

## 0.4.0 (Mar 20, 2016)

- Added some properties to "event.detail" of the "view" and "viewed" events.

## 0.3.3 (Mar 19, 2016)

- Fix the issue of hiding wrong element in the "view" method (#19).

## 0.3.2 (Mar 11, 2016)

- Fix the parameters error on the "url" option when it is a function.

## 0.3.1 (Feb 2, 2016)

- Added tests.
- Ignored invalid class name.
- Re-render image only when viewed.

## 0.3.0 (Jan 21, 2016)

- Add more available values to the "title", "toolbar" and "navbar" options.
- Support to toggle the visibility of title, toolbar and navbar between different screen widths.
- Exit fullscreen when stop playing.
- Fixed title not generated bug.

## 0.2.0 (Jan 1, 2016)

- Added "update" method for update image dynamically.
- Hides title and toolbar on small screen (width < 768px).

## 0.1.1 (Dec 28, 2015)

- Supports to zoom from event triggering point.
- Optimized "toggle" method.
- Fixed a bug of the index of viewing image.

## 0.1.0 (Dec 24, 2015)

- Supports 2 modes: "modal" (default), "inline"
- Supports 30 options: "inline", "button", "navbar", "title", "toolbar", "tooltip", "movable", "zoomable", "rotatable", "scalable", "transition", "fullscreen", "keyboard", "interval", "minWidth", "minHeight", "zoomRatio", "minZoomRatio", "maxZoomRatio", "zIndex", "zIndexInline", "url", "build", "built", "show", "shown", "hide", "hidden", "view", "viewed"
- Supports 22 methods: "show", "hide", "view", "prev", "next", "move", "moveTo", "zoom", "zoomTo", "rotate", "rotateTo", "scale", "scaleX", "scaleY", "play", "stop", "full", "exit", "tooltip", "toggle", "reset", "destroy"
- Supports 8 events: "build", "built", "show", "shown", "hide", "hidden", "view", "viewed"
