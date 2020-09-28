declare namespace Viewer {
  enum Visibility {
    Hidden = 0,
    Visible = 1,
    VisibleOnMediumOrWiderScreen = 2,
    VisibleOnLargeOrWiderScreen = 3,
    VisibleOnExtraLargeOrWiderScreen = 4,
  }

  enum ToolbarButtonSize {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
  }

  export interface ToolbarButtonOptions {
    click?: Function,
    show?: boolean | Visibility;
    size?: ToolbarButtonSize,
  }

  export interface ToolbarOptions {
    flipHorizontal?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    flipVertical?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    next?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    oneToOne?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    play?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    prev?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    reset?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    rotateLeft?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    rotateRight?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    zoomIn?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
    zoomOut?: boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions;
  }

  export interface ZoomEventData {
    originalEvent: WheelEvent | PointerEvent | TouchEvent | MouseEvent;
    oldRatio: number;
    ratio: number;
  }

  export interface ZoomEvent extends CustomEvent {
    detail: ZoomEventData;
  }

  export interface ZoomedEvent extends CustomEvent {
    detail: ZoomEventData;
  }

  export interface Options {
    backdrop?: boolean | string;
    button?: boolean;
    className?: string;
    container?: string | HTMLElement;
    filter?: Function;
    fullscreen?: boolean;
    hidden?(event: CustomEvent): void;
    hide?(event: CustomEvent): void;
    inheritedAttributes?: string[];
    initialViewIndex?: number;
    inline?: boolean;
    interval?: number;
    keyboard?: boolean;
    loading?: boolean;
    loop?: boolean;
    maxZoomRatio?: number;
    minHeight?: number;
    minWidth?: number;
    minZoomRatio?: number;
    movable?: boolean;
    navbar?: boolean | Visibility;
    play?(event: CustomEvent): void;
    ready?(event: CustomEvent): void;
    rotatable?: boolean;
    scalable?: boolean;
    show?(event: CustomEvent): void;
    shown?(event: CustomEvent): void;
    slideOnTouch?: boolean;
    stop?(event: CustomEvent): void;
    title?: boolean | Visibility | Function | [Visibility, Function];
    toggleOnDblclick?: boolean;
    toolbar?: boolean | Visibility | ToolbarOptions;
    tooltip?: boolean;
    transition?: boolean;
    url?: string | Function;
    view?(event: CustomEvent): void;
    viewed?(event: CustomEvent): void;
    zIndex?: number;
    zIndexInline?: number;
    zoom?(event: ZoomEvent): void;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean;
    zoomRatio?: number;
    zoomable?: boolean;
    zoomed?(event: ZoomedEvent): void;
  }
}

declare class Viewer {
  constructor(element: HTMLElement, options?: Viewer.Options);
  destroy(): Viewer;
  exit(): Viewer;
  full(): Viewer;
  hide(immediate?: boolean): Viewer;
  move(offsetX: number, offsetY?: number): Viewer;
  moveTo(x: number, y?: number): Viewer;
  next(loop?: boolean): Viewer;
  play(fullscreen?: boolean): Viewer;
  prev(loop?: boolean): Viewer;
  reset(): Viewer;
  rotate(degree: number): Viewer;
  rotateTo(degree: number): Viewer;
  scale(scaleX: number, scaleY?: number): Viewer;
  scaleX(scaleX: number): Viewer;
  scaleY(scaleY: number): Viewer;
  show(immediate?: boolean): Viewer;
  stop(): Viewer;
  toggle(): Viewer;
  tooltip(): Viewer;
  update(): Viewer;
  view(index?: number): Viewer;
  zoom(ratio: number, hasTooltip?: boolean): Viewer;
  zoomTo(ratio: number, hasTooltip?: boolean): Viewer;
  static noConflict(): Viewer;
  static setDefaults(options: Viewer.Options): void;
}

declare module 'viewerjs' {
  export default Viewer;
}
