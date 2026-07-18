declare namespace Viewer {
  export type Visibility = 0 | 1 | 2 | 3 | 4;
  export type ToolbarButtonSize = 'small' | 'medium' | 'large';
  export type ToolbarOption = boolean | Visibility | ToolbarButtonSize | Function | ToolbarButtonOptions | undefined;

  export type HTMLElementWithViewer<T extends HTMLElement = HTMLElement> = T & { viewer: Viewer<T> };

  export type ViewerEventWithHTMLElement<T extends HTMLElement = HTMLElement, K extends Event = Event> = Omit<K, "currentTarget" | "target" | "srcElement"> & {
    currentTarget: HTMLElementWithViewer<T>;
    target: HTMLElementWithViewer<T>;
    srcElement: HTMLElementWithViewer<T>;
  }

  export type ViewerEventListener<T extends HTMLElement = HTMLElement, K extends Event = Event> = (this: HTMLElementWithViewer<T>, event: ViewerEventWithHTMLElement<T, K>) => void;

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

  export interface Pivot {
    x: Number;
    y: Number;
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

  export interface Options<T extends HTMLElement = HTMLElement> {
    backdrop?: boolean | string;
    button?: boolean;
    className?: string;
    container?: string | HTMLElement;
    filter?: Function;
    fullscreen?: boolean | FullscreenOptions;
    focus?: boolean;
    hidden?: ViewerEventListener<T, CustomEvent>;
    hide?: ViewerEventListener<T, CustomEvent>;
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
    move?: ViewerEventListener<T, MoveEvent>;
    moved?: ViewerEventListener<T, MovedEvent>;
    navbar?: boolean | Visibility;
    play?: ViewerEventListener<T, CustomEvent>;
    ready?: ViewerEventListener<T, CustomEvent>;
    rotatable?: boolean;
    rotate?: ViewerEventListener<T, RotateEvent>;
    rotated?: ViewerEventListener<T, RotatedEvent>;
    scalable?: boolean;
    scale?: ViewerEventListener<T, ScaleEvent>;
    scaled?: ViewerEventListener<T, ScaledEvent>;
    show?: ViewerEventListener<T, CustomEvent>;
    shown?: ViewerEventListener<T, CustomEvent>;
    slideOnTouch?: boolean;
    stop?: ViewerEventListener<T, CustomEvent>;
    title?: boolean | Visibility | Function | [Visibility, Function];
    toggleOnDblclick?: boolean;
    toolbar?: boolean | Visibility | ToolbarOptions;
    tooltip?: boolean;
    transition?: boolean;
    url?: string | Function;
    view?: ViewerEventListener<T, CustomEvent>;
    viewed?: ViewerEventListener<T, CustomEvent>;
    zIndex?: number;
    zIndexInline?: number;
    zoom?: ViewerEventListener<T, ZoomEvent>;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean;
    zoomRatio?: number;
    zoomable?: boolean;
    zoomed?: ViewerEventListener<T, ZoomedEvent>;
  }
}

declare class Viewer<T extends HTMLElement = HTMLElement> {
  constructor(element: T, options?: Viewer.Options<T>);
  destroy(): this;
  exit(): this;
  full(): this;
  hide(immediate?: boolean): this;
  move(offsetX: number, offsetY?: number): this;
  moveTo(x: number, y?: number): this;
  next(loop?: boolean): this;
  play(fullscreen?: boolean | FullscreenOptions): this;
  prev(loop?: boolean): this;
  reset(): this;
  rotate(degree: number): this;
  rotateTo(degree: number): this;
  scale(scaleX: number, scaleY?: number): this;
  scaleX(scaleX: number): this;
  scaleY(scaleY: number): this;
  show(immediate?: boolean): this;
  stop(): this;
  toggle(): this;
  tooltip(): this;
  update(): this;
  view(index?: number): this;
  zoom(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): this;
  zoomTo(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): this;
  static noConflict(): Viewer;
  static setDefaults(options: Viewer.Options): void;
}

declare module 'viewerjs' {
  export default Viewer;
}
