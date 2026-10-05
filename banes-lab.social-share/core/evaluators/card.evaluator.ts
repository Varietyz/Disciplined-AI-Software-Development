import type {
    CardSpec,
    Effect,
    EffectKind,
    Expr,
    FrameContext,
    Layer,
    Placement,
    Profile,
    ResolvedCard,
    ResolvedLayer,
    ResolvedPlacement,
} from "#types/card.types";
import { SUBJECT_SEPARATOR, UNKNOWN_EFFECT } from "#configuration/strings/card.strings";

const FILTER_SEPARATOR = " ";

const FILTERS: ReadonlyMap<EffectKind, (amount: number) => string> = new Map<EffectKind, (amount: number) => string>([
    ["blur", (amount) => `blur(${String(amount)}px)`],
    ["brightness", (amount) => `brightness(${String(amount)})`],
    ["contrast", (amount) => `contrast(${String(amount)})`],
    ["glow", (amount) => `drop-shadow(0 0 ${String(amount)}px currentColor)`],
    ["hue", (amount) => `hue-rotate(${String(amount)}deg)`],
    ["saturate", (amount) => `saturate(${String(amount)})`],
]);

const isComputed = function isComputed<T>(expression: Expr<T>): expression is (context: FrameContext) => T {
    return typeof expression === "function";
};

export const valueAt = function valueAt<T>(expression: Expr<T>, frame: FrameContext): T {
    return isComputed(expression) ? expression(frame) : expression;
};

export const frameContext = function frameContext(spec: CardSpec, profile: Profile, frame: number): FrameContext {
    const { fps, frames } = spec.timeline;
    return { frame, frames, profile, progress: frames <= 1 ? 0 : frame / frames, t: frame / fps };
};

const placementOf = function placementOf(placement: Placement, frame: FrameContext): ResolvedPlacement {
    return {
        anchor: valueAt(placement.anchor ?? "start", frame),
        height: valueAt(placement.height ?? 0, frame),
        rotate: valueAt(placement.rotate ?? 0, frame),
        scale: valueAt(placement.scale ?? 1, frame),
        width: valueAt(placement.width ?? 0, frame),
        x: valueAt(placement.x, frame),
        y: valueAt(placement.y, frame),
    };
};

const filterOf = function filterOf(effects: readonly Effect[], frame: FrameContext): string {
    return effects
        .map((effect) => {
            const filter = FILTERS.get(effect.kind);
            if (filter === undefined) {
                throw new Error(UNKNOWN_EFFECT + SUBJECT_SEPARATOR + effect.kind);
            }
            return filter(valueAt(effect.amount, frame));
        })
        .join(FILTER_SEPARATOR);
};

const styleOf = function styleOf(layer: Layer, frame: FrameContext): Readonly<Record<string, string>> {
    return Object.fromEntries(
        Object.entries(layer.style ?? {}).map(([property, value]) => [property, String(valueAt(value, frame))]),
    );
};

const contentOf = function contentOf(layer: Layer, frame: FrameContext): string {
    if (layer.kind === "text") {
        return valueAt(layer.text, frame);
    }
    if (layer.kind === "image" || layer.kind === "animation") {
        return layer.source;
    }
    return layer.kind === "shader" ? layer.shader : "";
};

const uniformsOf = function uniformsOf(layer: Layer, frame: FrameContext): readonly number[] {
    return layer.kind === "shader" ? Object.values(layer.uniforms).map((value) => valueAt(value, frame)) : [];
};

export const resolveLayer = function resolveLayer(layer: Layer, frame: FrameContext): ResolvedLayer {
    return {
        alt: layer.kind === "image" || layer.kind === "animation" ? layer.alt : "",
        className: layer.className ?? "",
        content: contentOf(layer, frame),
        filter: filterOf(layer.effects ?? [], frame),
        id: layer.id,
        kind: layer.kind,
        opacity: valueAt(layer.opacity ?? 1, frame),
        placement: placementOf(layer.placement, frame),
        style: styleOf(layer, frame),
        uniforms: uniformsOf(layer, frame),
    };
};

export const resolveCard = function resolveCard(spec: CardSpec, profile: Profile, frame: number): ResolvedCard {
    const context = frameContext(spec, profile, frame);
    return {
        frame,
        id: spec.id,
        layers: spec.layers.map((layer) => resolveLayer(layer, context)),
        profile,
        progress: context.progress,
        stylesheet: spec.stylesheet,
        time: context.t,
        tone: spec.tone,
    };
};
