declare namespace Viewer {
  export type Visibility = 0 | 1 | 2 | 3 | 4;
  export type ToolbarButtonSize = 'small' | 'medium' | 'large';
  export type ToolbarOption = boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions | undefined;

  export interface ToolbarButtonOptions {
    click?: Function,
    show?: boolean | Visibility;
    size?: ToolbarButtonSize,
  }

  export interface ToolbarOptions {
    flipHorizontal?: ToolbarOption;
    flipVertical?: ToolbarOption;
    next?: ToolbarOption;
    oneToOne?: ToolbarOption;
    play?: ToolbarOption;
    prev?: ToolbarOption;
    reset?: ToolbarOption;
    rotateLeft?: ToolbarOption;
    rotateRight?: ToolbarOption;
    zoomIn?: ToolbarOption;
    zoomOut?: ToolbarOption;
    [x: string]: ToolbarOption;
  }

  export interface MoveEventData {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    originalEvent: PointerEvent | TouchEvent | MouseEvent | null;
  }

  export interface MoveEvent extends CustomEvent {
    detail: MoveEventData;
  }

  export interface MovedEvent extends CustomEvent {
    detail: MoveEventData;
  }

  export interface RotateEventData {
    degree: number;
    oldDegree: number;
  }

  export interface RotateEvent extends CustomEvent {
    detail: RotateEventData;
  }

  export interface RotatedEvent extends CustomEvent {
    detail: RotateEventData;
  }

  export interface ScaleEventData {
    scaleX: number;
    scaleY: number;
    oldScaleX: number;
    oldScaleY: number;
  }

  export interface ScaleEvent extends CustomEvent {
    detail: ScaleEventData;
  }

  export interface ScaledEvent extends CustomEvent {
    detail: ScaleEventData;
  }

  export interface ZoomEventData {
    ratio: number;
    oldRatio: number;
    originalEvent: WheelEvent | PointerEvent | TouchEvent | MouseEvent | null;
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
    fullscreen?: boolean | FullscreenOptions;
    focus?: boolean;
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
    move?(event: MoveEvent): void;
    moved?(event: MovedEvent): void;
    navbar?: boolean | Visibility;
    play?(event: CustomEvent): void;
    ready?(event: CustomEvent): void;
    rotatable?: boolean;
    rotate?(event: RotateEvent): void;
    rotated?(event: RotatedEvent): void;
    scalable?: boolean;
    scale?(event: ScaleEvent): void;
    scaled?(event: ScaledEvent): void;
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
  play(fullscreen?: boolean | FullscreenOptions): Viewer;
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
