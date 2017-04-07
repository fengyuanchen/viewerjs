export default {

  validatingToolbarLayout() {
    const self = this;
    const defaultOptionToolbarLayout = ['zoomin', 'zoomout', 'onetoone', 'reset',
      'prev', 'play', 'next', 'rotateleft', 'rotateright', 'fliphorizontal', 'flipvertical'];

    if (!self.options.toolbarLayout.every(elem => defaultOptionToolbarLayout.indexOf(elem) > -1)) {
      self.options.toolbarLayout = defaultOptionToolbarLayout;
    }
  },

  renderToolbar() {
    const self = this;
    let toolbarTemplate = '<ul class="viewer-toolbar">';
    self.validatingToolbarLayout();
    self.options.toolbarLayout.forEach((element) => {
      switch (element) {
        case 'zoomin':
          toolbarTemplate += '<li role="button" class="viewer-zoom-in" data-action="zoom-in"></li>';
          break;

        case 'zoomout':
          toolbarTemplate += '<li role="button" class="viewer-zoom-out" data-action="zoom-out"></li>';
          break;

        case 'onetoone':
          toolbarTemplate += '<li role="button" class="viewer-one-to-one" data-action="one-to-one"></li>';
          break;

        case 'reset':
          toolbarTemplate += '<li role="button" class="viewer-reset" data-action="reset"></li>';
          break;

        case 'prev':
          toolbarTemplate += '<li role="button" class="viewer-prev" data-action="prev"></li>';
          break;

        case 'play':
          toolbarTemplate += '<li role="button" class="viewer-play" data-action="play"></li>';
          break;

        case 'next':
          toolbarTemplate += '<li role="button" class="viewer-next" data-action="next"></li>';
          break;

        case 'rotateleft':
          toolbarTemplate += '<li role="button" class="viewer-rotate-left" data-action="rotate-left"></li>';
          break;

        case 'rotateright':
          toolbarTemplate += '<li role="button" class="viewer-rotate-right" data-action="rotate-right"></li>';
          break;

        case 'fliphorizontal':
          toolbarTemplate += '<li role="button" class="viewer-flip-horizontal" data-action="flip-horizontal"></li>';
          break;

        case 'flipvertical':
          toolbarTemplate += '<li role="button" class="viewer-flip-vertical" data-action="flip-vertical"></li>';
          break;
      }
    }, this);

    toolbarTemplate += '</ul>';
    return toolbarTemplate;
  },

  renderTemplateToolbar() {
    return `${'<div class="viewer-container">' +
      '<div class="viewer-canvas"></div>' +
      '<div class="viewer-footer">' +
        '<div class="viewer-title"></div>'}` +
        `${this.renderToolbar()}` +
        '<div class="viewer-navbar">' +
          '<ul class="viewer-list"></ul>' +
        '</div>' +
      '</div>' +
      '<div class="viewer-tooltip"></div>' +
      '<div role="button" class="viewer-button" data-action="mix"></div>' +
      '<div class="viewer-player"></div>' +
    '</div>';
  }
};
