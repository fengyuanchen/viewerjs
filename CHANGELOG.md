# Changelog


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
