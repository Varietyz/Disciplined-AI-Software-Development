import type { CardContext, CardFinding, CardSpec, Profile, RegisteredCard, ResolvedLayer } from "#types/card.types";
import {
    DUPLICATE_CARD,
    DUPLICATE_LAYER,
    EMPTY_LAYERS,
    EXPRESSION_FAILED,
    FOLDER_MISMATCH,
    FPS_OUT_OF_RANGE,
    FRAMES_OUT_OF_RANGE,
    KEY_FRAME_OUT_OF_RANGE,
    MISSING_SHARE_PROFILE,
    NOT_FINITE,
    OPACITY_OUT_OF_RANGE,
    OUTSIDE_CANVAS,
    SHADER_WITHOUT_ENTRY,
    STYLE_NOT_ALLOWED,
    SUBJECT_SEPARATOR,
    TOO_MANY_UNIFORMS,
    UNKNOWN_PAGE,
    UNKNOWN_PROFILE,
    UNREGISTERED_PLUGIN,
} from "#configuration/strings/card.strings";
import {
    MAX_FPS,
    MAX_FRAMES,
    MIN_FPS,
    MIN_FRAMES,
    PLUGIN_FOLDER,
    SHADER_ENTRY,
    UNIFORM_SLOTS,
} from "#configuration/constants/card.constants";
import { OPACITY_MAX, OPACITY_MIN, PLACEMENT_MAX, PLACEMENT_MIN, STYLE_PROPERTIES } from "#core/schemas/card.schema";
import { brandFindings, coverageFindings } from "#core/validators/page.validator";
import { SHARE_PROFILE } from "#configuration/configs/card.config";
import { loopFindings } from "#core/validators/loop.validator";
import { resolveCard } from "#core/evaluators/card.evaluator";

const SLASH = "/";
const BACKSLASH = "\\";
const PLUGIN_MARK = SLASH + PLUGIN_FOLDER + SLASH;

const finding = function finding(card: string, message: string): CardFinding {
    return { card, message };
};

export const folderOf = function folderOf(location: string): string {
    const path = location.split(BACKSLASH).join(SLASH);
    const end = path.lastIndexOf(PLUGIN_MARK);
    return end === -1 ? "" : path.slice(path.lastIndexOf(SLASH, end - 1) + 1, end);
};

const within = function within(value: number, low: number, high: number): boolean {
    return Number.isFinite(value) && value >= low && value <= high;
};

const layerFindings = function layerFindings(layer: ResolvedLayer): readonly string[] {
    const { placement } = layer;
    const numbers = [placement.x, placement.y, placement.width, placement.height, placement.rotate, placement.scale];
    return [
        ...(numbers.every((value) => Number.isFinite(value)) && layer.uniforms.every((value) => Number.isFinite(value))
            ? []
            : [NOT_FINITE]),
        ...(within(placement.x, PLACEMENT_MIN, PLACEMENT_MAX) && within(placement.y, PLACEMENT_MIN, PLACEMENT_MAX)
            ? []
            : [OUTSIDE_CANVAS]),
        ...(within(layer.opacity, OPACITY_MIN, OPACITY_MAX) ? [] : [OPACITY_OUT_OF_RANGE]),
        ...(layer.uniforms.length > UNIFORM_SLOTS ? [TOO_MANY_UNIFORMS] : []),
        ...(layer.kind === "shader" && !layer.content.includes(SHADER_ENTRY) ? [SHADER_WITHOUT_ENTRY] : []),
        ...(Object.keys(layer.style).every((property) => STYLE_PROPERTIES.has(property)) ? [] : [STYLE_NOT_ALLOWED]),
    ];
};

const resolvedFindings = function resolvedFindings(spec: CardSpec, profile: Profile, frame: number): readonly string[] {
    try {
        return resolveCard(spec, profile, frame).layers.flatMap(layerFindings);
    } catch (error) {
        return [EXPRESSION_FAILED + SUBJECT_SEPARATOR + (error instanceof Error ? error.message : String(error))];
    }
};

const frameFindings = function frameFindings(spec: CardSpec, profiles: readonly Profile[]): readonly string[] {
    const messages = new Set<string>();
    for (const profile of profiles.filter((candidate) => spec.profiles.includes(candidate.id))) {
        for (let frame = 0; frame < spec.timeline.frames; frame += 1) {
            for (const message of resolvedFindings(spec, profile, frame)) {
                messages.add(message);
            }
        }
    }
    return [...messages];
};

const targetFindings = function targetFindings(spec: CardSpec, context: CardContext): readonly string[] {
    const known = new Set(context.profiles.map((profile) => profile.id));
    return [
        ...(spec.profiles.every((profile) => known.has(profile)) ? [] : [UNKNOWN_PROFILE]),
        ...(context.pages.some((page) => page.id === spec.page) ? [] : [UNKNOWN_PAGE]),
        ...(spec.profiles.includes(SHARE_PROFILE) ? [] : [MISSING_SHARE_PROFILE]),
    ];
};

const timelineFindings = function timelineFindings(spec: CardSpec): readonly string[] {
    const { fps, frames, keyFrame } = spec.timeline;
    return [
        ...(within(frames, MIN_FRAMES, MAX_FRAMES) ? [] : [FRAMES_OUT_OF_RANGE]),
        ...(within(fps, MIN_FPS, MAX_FPS) ? [] : [FPS_OUT_OF_RANGE]),
        ...(within(keyFrame, 0, frames - 1) ? [] : [KEY_FRAME_OUT_OF_RANGE]),
    ];
};

const layerSetFindings = function layerSetFindings(spec: CardSpec): readonly string[] {
    const layerIds = spec.layers.map((layer) => layer.id);
    return [
        ...(spec.layers.length === 0 ? [EMPTY_LAYERS] : []),
        ...(new Set(layerIds).size === layerIds.length ? [] : [DUPLICATE_LAYER]),
    ];
};

const seamOf = function seamOf(spec: CardSpec, profiles: readonly Profile[]): readonly string[] {
    try {
        return loopFindings(spec, profiles);
    } catch (error) {
        return [EXPRESSION_FAILED + SUBJECT_SEPARATOR + (error instanceof Error ? error.message : String(error))];
    }
};

const specFindings = function specFindings(spec: CardSpec, context: CardContext): readonly string[] {
    const timeline = timelineFindings(spec);
    return [
        ...targetFindings(spec, context),
        ...timeline,
        ...layerSetFindings(spec),
        ...(timeline.length === 0 ? frameFindings(spec, context.profiles) : []),
        ...(timeline.length === 0 ? seamOf(spec, context.profiles) : []),
    ];
};

export const validateCards = function validateCards(
    cards: readonly RegisteredCard[],
    plugins: readonly string[],
    context: CardContext,
): readonly CardFinding[] {
    const origins = new Set(cards.map((card) => folderOf(card.origin)));
    const own = cards.flatMap((card) => [
        ...(folderOf(card.origin) === card.id ? [] : [finding(card.id, FOLDER_MISMATCH)]),
        ...specFindings(card.spec, context).map((message) => finding(card.id, message)),
    ]);
    const sound = cards.filter((card) => !own.some((entry) => entry.card === card.id));
    return [
        ...context.repeated.map((card) => finding(card, DUPLICATE_CARD)),
        ...plugins
            .map(folderOf)
            .filter((folder) => !origins.has(folder))
            .map((folder) => finding(folder, UNREGISTERED_PLUGIN)),
        ...own,
        ...coverageFindings(cards, context.pages),
        ...brandFindings(sound, context),
    ];
};
