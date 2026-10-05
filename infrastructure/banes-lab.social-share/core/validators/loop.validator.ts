import type { CardSpec, Profile, ResolvedLayer } from "#types/card.types";
import { LIST_SEPARATOR, LOOP_SEAM, SHADER_READS_TIME, SUBJECT_SEPARATOR } from "#configuration/strings/card.strings";
import { SEAM_TOLERANCE, SEAM_VELOCITY_RATIO, SHADER_TIME_FIELD } from "#configuration/constants/card.constants";
import { resolveCard } from "#core/evaluators/card.evaluator";

const DIGITS: ReadonlySet<string> = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const SIGNS: ReadonlySet<string> = new Set(["-", "+"]);
const POINT = ".";
const EXPONENTS: ReadonlySet<string> = new Set(["e", "E"]);

const isDigit = function isDigit(text: string, at: number): boolean {
    return DIGITS.has(text.charAt(at));
};

const startsFraction = function startsFraction(text: string, at: number): boolean {
    return text.charAt(at) === POINT && isDigit(text, at + 1);
};

const startsNumber = function startsNumber(text: string, at: number): boolean {
    if (isDigit(text, at) || startsFraction(text, at)) {
        return true;
    }
    return SIGNS.has(text.charAt(at)) && (isDigit(text, at + 1) || startsFraction(text, at + 1));
};

const continuesNumber = function continuesNumber(text: string, at: number): boolean {
    const letter = text.charAt(at);
    if (isDigit(text, at) || letter === POINT) {
        return true;
    }
    if (EXPONENTS.has(letter)) {
        return isDigit(text, at + 1) || SIGNS.has(text.charAt(at + 1));
    }
    return SIGNS.has(letter) && EXPONENTS.has(text.charAt(at - 1));
};

const numberEnd = function numberEnd(text: string, from: number): number {
    let at = from + 1;
    while (at < text.length && continuesNumber(text, at)) {
        at += 1;
    }
    return at;
};

export const textTokens = function textTokens(text: string): readonly (number | string)[] {
    const tokens: (number | string)[] = [];
    let word = "";
    let at = 0;
    while (at < text.length) {
        if (startsNumber(text, at)) {
            const end = numberEnd(text, at);
            tokens.push(word, Number(text.slice(at, end)));
            word = "";
            at = end;
        } else {
            word += text.charAt(at);
            at += 1;
        }
    }
    tokens.push(word);
    return tokens;
};

const sameToken = function sameToken(left: number | string | undefined, right: number | string | undefined): boolean {
    if (typeof left === "number" && typeof right === "number") {
        return Math.abs(left - right) <= SEAM_TOLERANCE;
    }
    return left === right;
};

export const sameText = function sameText(left: string, right: string): boolean {
    const a = textTokens(left);
    const b = textTokens(right);
    return a.length === b.length && a.every((token, index) => sameToken(token, b[index]));
};

const signatureOf = function signatureOf(layer: ResolvedLayer): string {
    const { anchor, ...placement } = layer.placement;
    return JSON.stringify([anchor, placement, layer.opacity, layer.style, layer.filter, layer.content, layer.uniforms]);
};

const seamBreaks = function seamBreaks(spec: CardSpec, profile: Profile): readonly string[] {
    const start = resolveCard(spec, profile, 0).layers;
    const end = resolveCard(spec, profile, spec.timeline.frames).layers;
    return start
        .filter((layer, index) => {
            const other = end[index];
            return other === undefined || !sameText(signatureOf(layer), signatureOf(other));
        })
        .map((layer) => layer.id);
};

const numbersOf = function numbersOf(layer: ResolvedLayer | undefined): readonly number[] {
    return layer === undefined
        ? []
        : textTokens(signatureOf(layer)).filter((token): token is number => typeof token === "number");
};

const stepsOf = function stepsOf(series: readonly (readonly number[])[], slot: number): readonly number[] {
    return series.slice(1).map((values, index) => (values[slot] ?? 0) - (series[index]?.[slot] ?? 0));
};

const turnsAtSeam = function turnsAtSeam(series: readonly (readonly number[])[], slot: number): boolean {
    const steps = stepsOf(series, slot);
    const largest = Math.max(...steps.map((step) => Math.abs(step)));
    const leaving = steps[0] ?? 0;
    const entering = steps.at(-1) ?? 0;
    return Math.abs(entering - leaving) > SEAM_VELOCITY_RATIO * largest + SEAM_TOLERANCE;
};

const velocityBreaks = function velocityBreaks(spec: CardSpec, profile: Profile): readonly string[] {
    const frames = Array.from(
        { length: spec.timeline.frames + 1 },
        (_, frame) => resolveCard(spec, profile, frame).layers,
    );
    const [first = []] = frames;
    return first
        .filter((_, index) => {
            const series = frames.map((layers) => numbersOf(layers[index]));
            const width = series[0]?.length ?? 0;
            if (series.some((values) => values.length !== width)) {
                return false;
            }
            return Array.from({ length: width }, (__, slot) => slot).some((slot) => turnsAtSeam(series, slot));
        })
        .map((layer) => layer.id);
};

export const loopFindings = function loopFindings(spec: CardSpec, profiles: readonly Profile[]): readonly string[] {
    if (!spec.timeline.loop || spec.timeline.frames <= 1) {
        return [];
    }
    const own = profiles.filter((profile) => spec.profiles.includes(profile.id));
    const breaks = [
        ...new Set(own.flatMap((profile) => [...seamBreaks(spec, profile), ...velocityBreaks(spec, profile)])),
    ];
    const readsTime = spec.layers.some((layer) => layer.kind === "shader" && layer.shader.includes(SHADER_TIME_FIELD));
    return [
        ...(breaks.length === 0 ? [] : [LOOP_SEAM + SUBJECT_SEPARATOR + breaks.join(LIST_SEPARATOR)]),
        ...(readsTime ? [SHADER_READS_TIME] : []),
    ];
};
