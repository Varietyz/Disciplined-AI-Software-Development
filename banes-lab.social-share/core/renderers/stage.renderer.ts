import type { Anchor, LayerKind, ResolvedCard, ResolvedLayer } from "#types/card.types";
import { CARD_CLASS, CARD_CLASS_PREFIX, FINDINGS_CLASS, LAYER_CLASS } from "#configuration/constants/card.constants";
import type { LayerPass, MountedCard } from "#types/stage.types";
import { MISSING_LAYER, SUBJECT_SEPARATOR, UNKNOWN_ANCHOR } from "#configuration/strings/card.strings";
import { createAnimationPass } from "#core/renderers/image.renderer";
import { createElement } from "@banes-lab/web/core/factories/element.factory.ts";
import { createShaderPass } from "#core/renderers/shader.renderer";
import { declareStyle } from "@banes-lab/web/core/registries/style.registry.ts";
import { propertyOf } from "#core/converters/style.converter";

const PERCENT = 100;
const CLASS_SEPARATOR = " ";
const NO_FILTER = "none";

const ANCHOR_SHIFT: ReadonlyMap<Anchor, string> = new Map<Anchor, string>([
    ["start", "0%"],
    ["center", "-50%"],
    ["end", "-100%"],
]);

const percent = function percent(fraction: number): string {
    return `${String(fraction * PERCENT)}%`;
};

const pixels = function pixels(value: number): string {
    return `${String(Math.round(value))}px`;
};

const shiftOf = function shiftOf(anchor: Anchor): string {
    const shift = ANCHOR_SHIFT.get(anchor);
    if (shift === undefined) {
        throw new Error(UNKNOWN_ANCHOR + SUBJECT_SEPARATOR + anchor);
    }
    return shift;
};

const classOf = function classOf(layer: ResolvedLayer): string {
    return [LAYER_CLASS, layer.className].filter((name) => name.length > 0).join(CLASS_SEPARATOR);
};

const shaderPassOf = async function shaderPassOf(canvas: HTMLCanvasElement, source: string): Promise<LayerPass> {
    const shader = await createShaderPass(canvas, source);
    return async (layer: ResolvedLayer, card: ResolvedCard): Promise<void> => {
        await shader.draw({
            height: layer.placement.height * card.profile.height,
            progress: card.progress,
            time: card.time,
            values: layer.uniforms,
            width: layer.placement.width * card.profile.width,
        });
    };
};

const animationPassOf = async function animationPassOf(canvas: HTMLCanvasElement, source: string): Promise<LayerPass> {
    const animation = await createAnimationPass(canvas, source);
    return async (_layer: ResolvedLayer, card: ResolvedCard): Promise<void> => {
        animation.draw(card.time);
        await Promise.resolve();
    };
};

const CANVAS_PASSES: ReadonlyMap<LayerKind, (canvas: HTMLCanvasElement, source: string) => Promise<LayerPass>> =
    new Map<LayerKind, (canvas: HTMLCanvasElement, source: string) => Promise<LayerPass>>([
        ["animation", animationPassOf],
        ["shader", shaderPassOf],
    ]);

const layerElement = function layerElement(layer: ResolvedLayer, card: ResolvedCard): HTMLElement {
    const className = classOf(layer);
    if (layer.kind === "image") {
        return createElement("img", { attributes: { alt: layer.alt, src: layer.content }, className });
    }
    if (CANVAS_PASSES.has(layer.kind)) {
        const width = String(Math.round(layer.placement.width * card.profile.width));
        const height = String(Math.round(layer.placement.height * card.profile.height));
        const attributes =
            layer.alt.length > 0 ? { "aria-label": layer.alt, height, role: "img", width } : { height, width };
        return createElement("canvas", { attributes, className });
    }
    return createElement("div", { className, text: layer.kind === "text" ? layer.content : "" });
};

const written = new WeakMap<Element, Map<string, string>>();

const writeStyle = function writeStyle(element: HTMLElement, property: string, value: string): void {
    const held = written.get(element) ?? new Map<string, string>();
    if (held.get(property) === value) {
        return;
    }
    held.set(property, value);
    written.set(element, held);
    declareStyle(element, property, value);
};

const place = function place(element: HTMLElement, layer: ResolvedLayer): void {
    const { placement } = layer;
    const shift = shiftOf(placement.anchor);
    writeStyle(element, "left", percent(placement.x));
    writeStyle(element, "top", percent(placement.y));
    if (placement.width > 0) {
        writeStyle(element, "width", percent(placement.width));
    }
    if (placement.height > 0) {
        writeStyle(element, "height", percent(placement.height));
    }
    writeStyle(
        element,
        "transform",
        `translate(${shift}, ${shift}) rotate(${String(placement.rotate)}deg) scale(${String(placement.scale)})`,
    );
    writeStyle(element, "opacity", String(layer.opacity));
    writeStyle(element, "filter", layer.filter.length > 0 ? layer.filter : NO_FILTER);
    for (const [property, value] of Object.entries(layer.style)) {
        writeStyle(element, propertyOf(property), value);
    }
};

const paintLayer = async function paintLayer(
    element: HTMLElement,
    layer: ResolvedLayer,
    card: ResolvedCard,
    pass: Promise<LayerPass> | undefined,
): Promise<void> {
    place(element, layer);
    if (layer.kind === "text" && element.textContent !== layer.content) {
        element.textContent = layer.content;
    }
    if (pass === undefined) {
        return;
    }
    const draw = await pass;
    await draw(layer, card);
};

const canvasPasses = function canvasPasses(
    elements: ReadonlyMap<string, HTMLElement>,
    card: ResolvedCard,
): ReadonlyMap<string, Promise<LayerPass>> {
    const passes = new Map<string, Promise<LayerPass>>();
    for (const layer of card.layers) {
        const factory = CANVAS_PASSES.get(layer.kind);
        if (factory === undefined) {
            continue;
        }
        const canvas = elements.get(layer.id);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error(MISSING_LAYER + SUBJECT_SEPARATOR + layer.id);
        }
        passes.set(layer.id, factory(canvas, layer.content));
    }
    return passes;
};

export const mountCard = function mountCard(host: Element, first: ResolvedCard): MountedCard {
    const elements = new Map(first.layers.map((layer) => [layer.id, layerElement(layer, first)]));
    const root = createElement("div", {
        children: [createElement("style", { text: first.stylesheet }), ...elements.values()],
        className: `${CARD_CLASS} ${CARD_CLASS_PREFIX}${first.id} ${first.tone}`,
    });
    declareStyle(root, "width", pixels(first.profile.width));
    declareStyle(root, "height", pixels(first.profile.height));
    host.append(root);
    const passes = canvasPasses(elements, first);
    const reported = new Set<string>();
    return {
        element: root,
        paint: async (card: ResolvedCard): Promise<void> => {
            await Promise.all(
                card.layers.map(async (layer) => {
                    const element = elements.get(layer.id);
                    if (element === undefined) {
                        throw new Error(MISSING_LAYER + SUBJECT_SEPARATOR + layer.id);
                    }
                    await paintLayer(element, layer, card, passes.get(layer.id));
                }),
            );
        },
        ready: async (): Promise<void> => {
            await Promise.all(passes.values());
        },
        report: (failure: unknown): string => {
            const text = first.id + SUBJECT_SEPARATOR + (failure instanceof Error ? failure.message : String(failure));
            if (reported.has(text)) {
                return text;
            }
            reported.add(text);
            root.append(createElement("p", { className: FINDINGS_CLASS, text }));
            console.error(text);
            return text;
        },
    };
};
