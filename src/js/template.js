export default function (options) {
  const { toolbarPosition } = options;
  const toolbarPositionClass = `viewer-toolbar-${toolbarPosition}`;
  let template = '';

  template =
    '<div class="viewer-container">' +
      '<div class="viewer-canvas"></div>';

  if (toolbarPosition === 'left' || toolbarPosition === 'right') {
    template +=
      `<div class="viewer-toolbar ${toolbarPositionClass}"></div>`;
  }

  template +=
      '<div class="viewer-footer">' +
        '<div class="viewer-title"></div>';

  if (toolbarPosition === 'bottom') {
    template +=
        '<div class="viewer-toolbar"></div>';
  }

  template +=
        '<div class="viewer-navbar">' +
          '<ul class="viewer-list"></ul>' +
        '</div>' +
      '</div>' +
      '<div class="viewer-tooltip"></div>' +
      '<div role="button" class="viewer-button" data-action="mix"></div>' +
      '<div class="viewer-player"></div>' +
    '</div>';

  return template;
}
