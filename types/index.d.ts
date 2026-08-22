declare namespace Viewer {
  export type Visibility = 0 | 1 | 2 | 3 | 4;
  export type ToolbarButtonSize = 'small' | 'medium' | 'large';
  export type EventHandler<T extends Event = CustomEvent> = (event: T) => void;
  export type Filter = (this: Viewer, image: HTMLImageElement) => boolean;
  export type TitleRenderer = (this: Viewer, image: HTMLImageElement, imageData: Record<string, any>) => string;
  export type ImageURLResolver = (this: Viewer, image: HTMLImageElement) => string;
  export type ToolbarButtonClick = (this: Viewer, event: Event) => void;
  export type ToolbarOption = boolean | Visibility | ToolbarButtonSize | ToolbarButtonOptions | undefined;

  export interface ToolbarButtonOptions {
    click?: ToolbarButtonClick,
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

  export interface Pivot {
    x: number;
    y: number;
  }

  export interface MoveEventData {
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    originalEvent: PointerEvent | TouchEvent | MouseEvent | null;
  }

  export interface MoveEvent extends CustomEvent<MoveEventData> {}

  export interface MovedEvent extends CustomEvent<MoveEventData> {}

  export interface RotateEventData {
    degree: number;
    oldDegree: number;
  }

  export interface RotateEvent extends CustomEvent<RotateEventData> {}

  export interface RotatedEvent extends CustomEvent<RotateEventData> {}

  export interface ScaleEventData {
    scaleX: number;
    scaleY: number;
    oldScaleX: number;
    oldScaleY: number;
  }

  export interface ScaleEvent extends CustomEvent<ScaleEventData> {}

  export interface ScaledEvent extends CustomEvent<ScaleEventData> {}

  export interface ZoomEventData {
    ratio: number;
    oldRatio: number;
    originalEvent: WheelEvent | PointerEvent | TouchEvent | MouseEvent | null;
  }

  export interface ZoomEvent extends CustomEvent<ZoomEventData> {}

  export interface ZoomedEvent extends CustomEvent<ZoomEventData> {}

  export interface Options {
    backdrop?: boolean | string;
    button?: boolean;
    className?: string;
    container?: string | HTMLElement;
    filter?: Filter | null;
    fullscreen?: boolean | FullscreenOptions;
    focus?: boolean;
    hidden?: EventHandler;
    hide?: EventHandler;
    inheritedAttributes?: string[];
    initialCoverage?: number;
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
    move?: EventHandler<MoveEvent>;
    moved?: EventHandler<MovedEvent>;
    navbar?: boolean | Visibility;
    play?: EventHandler;
    ready?: EventHandler;
    rotatable?: boolean;
    rotate?: EventHandler<RotateEvent>;
    rotated?: EventHandler<RotatedEvent>;
    scalable?: boolean;
    scale?: EventHandler<ScaleEvent>;
    scaled?: EventHandler<ScaledEvent>;
    show?: EventHandler;
    shown?: EventHandler;
    slideOnTouch?: boolean;
    stop?: EventHandler;
    title?: boolean | Visibility | TitleRenderer | [Visibility, TitleRenderer] | null;
    toggleOnDblclick?: boolean;
    toolbar?: boolean | Visibility | ToolbarOptions;
    tooltip?: boolean;
    transition?: boolean;
    url?: string | ImageURLResolver;
    view?: EventHandler;
    viewed?: EventHandler;
    zIndex?: number;
    zIndexInline?: number;
    zoom?: EventHandler<ZoomEvent>;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean;
    zoomRatio?: number;
    zoomable?: boolean;
    zoomed?: EventHandler<ZoomedEvent>;
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
  zoom(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): Viewer;
  zoomTo(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): Viewer;
  static noConflict(): Viewer;
  static setDefaults(options: Viewer.Options): void;
}

declare module 'viewerjs' {
  export default Viewer;
}
