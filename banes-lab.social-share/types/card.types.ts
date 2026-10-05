export interface Profile {
    readonly id: string;
    readonly width: number;
    readonly height: number;
}

export interface Timeline {
    readonly frames: number;
    readonly fps: number;
    readonly loop: boolean;
    readonly keyFrame: number;
}

export interface FrameContext {
    readonly frame: number;
    readonly frames: number;
    readonly progress: number;
    readonly t: number;
    readonly profile: Profile;
}

export type Expr<T> = T | ((frame: FrameContext) => T);

export type Anchor = "center" | "end" | "start";

export interface Placement {
    readonly x: Expr<number>;
    readonly y: Expr<number>;
    readonly width?: Expr<number>;
    readonly height?: Expr<number>;
    readonly rotate?: Expr<number>;
    readonly scale?: Expr<number>;
    readonly anchor?: Expr<Anchor>;
}

export type Orientation = "square" | "wide";

export type TextAlign = "center" | "left" | "right";

export interface LayoutSlot {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height?: number;
    readonly size?: number;
    readonly anchor: Anchor;
    readonly align?: TextAlign;
}

export type OrientedLayout<K extends string> = Readonly<Record<Orientation, Readonly<Record<K, LayoutSlot>>>>;

export interface SlotOptions {
    readonly square?: boolean;
    readonly lift?: (frame: FrameContext) => number;
    readonly grow?: (frame: FrameContext) => number;
}

export type EffectKind = "blur" | "brightness" | "contrast" | "glow" | "hue" | "saturate";

export interface Effect {
    readonly kind: EffectKind;
    readonly amount: Expr<number>;
}

export type StyleMap = Readonly<Record<string, Expr<number | string>>>;

interface LayerBase {
    readonly id: string;
    readonly className?: string;
    readonly placement: Placement;
    readonly opacity?: Expr<number>;
    readonly style?: StyleMap;
    readonly effects?: readonly Effect[];
}

export interface TextLayer extends LayerBase {
    readonly kind: "text";
    readonly text: Expr<string>;
}

export interface BoxLayer extends LayerBase {
    readonly kind: "box";
}

export interface ImageLayer extends LayerBase {
    readonly kind: "image";
    readonly source: string;
    readonly alt: string;
}

export interface ShaderLayer extends LayerBase {
    readonly kind: "shader";
    readonly shader: string;
    readonly uniforms: Readonly<Record<string, Expr<number>>>;
}

export interface AnimationLayer extends LayerBase {
    readonly kind: "animation";
    readonly source: string;
    readonly alt: string;
}

export type Layer = AnimationLayer | BoxLayer | ImageLayer | ShaderLayer | TextLayer;

export type LayerKind = Layer["kind"];

export interface CardInput {
    readonly id: string;
    readonly alt: string;
    readonly page: string;
    readonly tone: string;
    readonly profiles?: readonly string[];
    readonly timeline?: Partial<Timeline>;
    readonly stylesheet: string;
    readonly layers: readonly Layer[];
}

export interface CardSpec {
    readonly id: string;
    readonly alt: string;
    readonly page: string;
    readonly tone: string;
    readonly profiles: readonly string[];
    readonly timeline: Timeline;
    readonly stylesheet: string;
    readonly layers: readonly Layer[];
}

export interface CardPage {
    readonly id: string;
    readonly accent: string;
    readonly mark: string;
    readonly icon: string;
    readonly address: string;
    readonly headline: string;
    readonly tagline: string;
}

export interface PageCardOptions {
    readonly id: string;
    readonly page: string;
    readonly mark?: Layer;
    readonly field?: readonly Layer[];
    readonly stylesheet?: string;
    readonly timeline?: Partial<Timeline>;
}

export interface ResolvedPlacement {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly rotate: number;
    readonly scale: number;
    readonly anchor: Anchor;
}

export interface ResolvedLayer {
    readonly id: string;
    readonly kind: LayerKind;
    readonly className: string;
    readonly placement: ResolvedPlacement;
    readonly opacity: number;
    readonly style: Readonly<Record<string, string>>;
    readonly filter: string;
    readonly content: string;
    readonly alt: string;
    readonly uniforms: readonly number[];
}

export interface ResolvedCard {
    readonly id: string;
    readonly tone: string;
    readonly profile: Profile;
    readonly frame: number;
    readonly time: number;
    readonly progress: number;
    readonly stylesheet: string;
    readonly layers: readonly ResolvedLayer[];
}

export interface CardFinding {
    readonly card: string;
    readonly message: string;
}

export type Curve = "inCubic" | "inOutCubic" | "inOutSine" | "linear" | "outBack" | "outCubic";

export interface RegisteredCard {
    readonly id: string;
    readonly origin: string;
    readonly spec: CardSpec;
}

export interface CardContext {
    readonly pages: readonly CardPage[];
    readonly brand: readonly string[];
    readonly profiles: readonly Profile[];
    readonly repeated: readonly string[];
}

export type PageSlot = "byline" | "domain" | "mark";

export type ColumnRow = "kicker" | "rule" | "subtitle" | "title";

export interface ColumnRowSpec {
    readonly size: number;
    readonly leading: number;
    readonly gap: number;
    readonly width?: number;
}

export interface ColumnSpec {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly align: TextAlign;
    readonly rows: Readonly<Record<ColumnRow, ColumnRowSpec>>;
}

export interface ColumnEntry {
    readonly row: ColumnRow;
    readonly text: string;
}

export interface ColumnBox {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}
