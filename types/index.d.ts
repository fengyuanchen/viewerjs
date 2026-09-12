declare namespace Viewer {
  export type Visibility = 0 | 1 | 2 | 3 | 4;
  export type ToolbarButtonSize = 'small' | 'medium' | 'large';
  export type WheelModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta' | (string & {});
  export type EventHandler<T extends Event = CustomEvent> = (event: T) => void;
  export type Filter = (this: Viewer, image: HTMLImageElement) => boolean;
  export type TitleRenderer = (this: Viewer, image: HTMLImageElement, imageData: Record<string, any>) => string;
  export type ImageURLResolver = (this: Viewer, image: HTMLImageElement) => string;
  export type ZoomRatio = number | ((this: Viewer, image: HTMLImageElement, imageData: Record<string, any>) => number);
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

  export interface NavigationButtonOptions {
    show?: boolean | Visibility;
    size?: ToolbarButtonSize;
  }

  export type NavigationOption = boolean | Visibility | NavigationButtonOptions | undefined;

  export interface NavbarOptions {
    visibleItemCount?: number;
    show?: boolean | Visibility;
    size?: ToolbarButtonSize;
  }

  export type NavbarOption = boolean | Visibility | ToolbarButtonSize | NavbarOptions | undefined;

  export interface NavigationOptions {
    next?: NavigationOption;
    prev?: NavigationOption;
  }

  export interface TransitionOptions {
    hide?: boolean;
    move?: boolean;
    play?: boolean;
    rotate?: boolean;
    scale?: boolean;
    show?: boolean;
    tooltip?: boolean;
    view?: boolean;
    zoom?: boolean;
  }

  export interface MagnifierOptions {
    size?: number;
    zoomRatio?: number;
    opacity?: number;
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
    originalEvent: Event | null;
  }

  export interface RotateEvent extends CustomEvent<RotateEventData> {}

  export interface RotatedEvent extends CustomEvent<RotateEventData> {}

  export interface ScaleEventData {
    scaleX: number;
    scaleY: number;
    oldScaleX: number;
    oldScaleY: number;
    originalEvent: Event | null;
  }

  export interface ScaleEvent extends CustomEvent<ScaleEventData> {}

  export interface ScaledEvent extends CustomEvent<ScaleEventData> {}

  export interface ViewEventData {
    image: HTMLImageElement;
    index: number;
    originalImage: HTMLImageElement;
    originalEvent: Event | null;
  }

  export interface ViewEvent extends CustomEvent<ViewEventData> {}

  export interface ViewedEvent extends CustomEvent<ViewEventData> {}

  export interface ShowEventData {
    originalEvent: Event | null;
  }

  export interface ShowEvent extends CustomEvent<ShowEventData> {}

  export interface ShownEvent extends CustomEvent<ShowEventData> {}

  export interface HideEventData {
    originalEvent: Event | null;
  }

  export interface HideEvent extends CustomEvent<HideEventData> {}

  export interface HiddenEvent extends CustomEvent<HideEventData> {}

  export interface PlayEventData {
    originalEvent: Event | null;
  }

  export interface PlayEvent extends CustomEvent<PlayEventData> {}

  export interface PlayingEventData {
    image: HTMLImageElement;
    index: number;
    originalImage: HTMLImageElement;
    originalEvent: Event | null;
  }

  export interface PlayingEvent extends CustomEvent<PlayingEventData> {}

  export interface StopEventData {
    originalEvent: Event | null;
  }

  export interface StopEvent extends CustomEvent<StopEventData> {}

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
    hidden?: EventHandler<HiddenEvent>;
    hide?: EventHandler<HideEvent>;
    inheritedAttributes?: string[];
    initialCoverage?: number;
    initialViewIndex?: number;
    inline?: boolean;
    autoplay?: boolean;
    interval?: number;
    keyboard?: boolean;
    loading?: boolean;
    loop?: boolean;
    magnifier?: boolean | MagnifierOptions;
    maxZoomRatio?: ZoomRatio;
    minHeight?: number;
    minWidth?: number;
    minZoomRatio?: ZoomRatio;
    movable?: boolean;
    move?: EventHandler<MoveEvent>;
    moved?: EventHandler<MovedEvent>;
    navbar?: NavbarOption;
    navigation?: boolean | Visibility | NavigationOptions;
    play?: EventHandler<PlayEvent>;
    playing?: EventHandler<PlayingEvent>;
    preload?: boolean;
    ready?: EventHandler;
    rotatable?: boolean;
    rotateOnGesture?: boolean;
    rotateOnTouch?: boolean;
    rotate?: EventHandler<RotateEvent>;
    rotated?: EventHandler<RotatedEvent>;
    scalable?: boolean;
    scale?: EventHandler<ScaleEvent>;
    scaled?: EventHandler<ScaledEvent>;
    show?: EventHandler<ShowEvent>;
    shown?: EventHandler<ShownEvent>;
    slideOnTouch?: boolean;
    slideOnWheel?: boolean | WheelModifierKey;
    stop?: EventHandler<StopEvent>;
    title?: boolean | Visibility | TitleRenderer | [Visibility, TitleRenderer] | null;
    toggleOnDblclick?: boolean;
    toolbar?: boolean | Visibility | ToolbarOptions;
    tooltip?: boolean;
    transition?: boolean | TransitionOptions;
    url?: string | ImageURLResolver;
    view?: EventHandler<ViewEvent>;
    viewed?: EventHandler<ViewedEvent>;
    zIndex?: number;
    zIndexInline?: number;
    zoom?: EventHandler<ZoomEvent>;
    zoomOnGesture?: boolean;
    zoomOnTouch?: boolean;
    zoomOnWheel?: boolean | WheelModifierKey;
    zoomRatio?: number;
    zoomable?: boolean;
    zoomed?: EventHandler<ZoomedEvent>;
  }
}

declare class Viewer {
  constructor(element: HTMLElement | ShadowRoot, options?: Viewer.Options);
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
  update(options?: Viewer.Options): Viewer;
  view(index?: number): Viewer;
  zoom(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): Viewer;
  zoomTo(ratio: number, hasTooltip?: boolean, pivot?: Viewer.Pivot): Viewer;
  static create(element: HTMLElement | ShadowRoot, options?: Viewer.Options): Viewer;
  static setDefaults(options: Viewer.Options): void;
  static noConflict(): Viewer;
}

declare module 'viewerjs' {
  export default Viewer;
}
