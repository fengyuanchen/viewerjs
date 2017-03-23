export default (
  '<div class="viewer-container">' +
    '<div class="viewer-canvas"></div>' +
    '<div class="viewer-footer">' +
      '<div class="viewer-title"></div>' +
      '<ul class="viewer-toolbar">' +
        '<li role="button" class="viewer-zoom-in" data-action="zoom-in"></li>' +
        '<li role="button" class="viewer-zoom-out" data-action="zoom-out"></li>' +
        '<li role="button" class="viewer-one-to-one" data-action="one-to-one"></li>' +
        '<li role="button" class="viewer-reset" data-action="reset"></li>' +
        '<li role="button" class="viewer-prev" data-action="prev"></li>' +
        '<li role="button" class="viewer-play" data-action="play"></li>' +
        '<li role="button" class="viewer-next" data-action="next"></li>' +
        '<li role="button" class="viewer-rotate-left" data-action="rotate-left"></li>' +
        '<li role="button" class="viewer-rotate-right" data-action="rotate-right"></li>' +
        '<li role="button" class="viewer-flip-horizontal" data-action="flip-horizontal"></li>' +
        '<li role="button" class="viewer-flip-vertical" data-action="flip-vertical"></li>' +
      '</ul>' +
      '<div class="viewer-navbar">' +
        '<ul class="viewer-list"></ul>' +
      '</div>' +
    '</div>' +
    '<div class="viewer-tooltip"></div>' +
    '<div role="button" class="viewer-button" data-action="mix"></div>' +
    '<div class="viewer-player"></div>' +
  '</div>'
);
