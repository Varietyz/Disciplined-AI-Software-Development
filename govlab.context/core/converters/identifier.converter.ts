import {
    DIGIT_END,
    DIGIT_START,
    LOWER_END,
    LOWER_START,
    SLUG_SEPARATOR,
} from "#configuration/constants/identifier.constants";
import { identifierParts, normalizeWord } from "@govlab/constants";

const SPACE = " ";

const inRange = function inRange(code: number, start: number, end: number): boolean {
    return code >= start && code <= end;
};

const isAlnum = function isAlnum(code: number | undefined): boolean {
    if (typeof code !== "number") {
        return false;
    }
    return inRange(code, DIGIT_START, DIGIT_END) || inRange(code, LOWER_START, LOWER_END);
};

interface SlugState {
    out: string;
    prevHyphen: boolean;
}

const appended = function appended(state: SlugState, ch: string): SlugState {
    if (isAlnum(ch.codePointAt(0))) {
        return { out: state.out + ch, prevHyphen: false };
    }
    if (state.prevHyphen || state.out.length === 0) {
        return state;
    }
    return { out: `${state.out}${SLUG_SEPARATOR}`, prevHyphen: true };
};

export const slugify = function slugify(name: string): string {
    const lowered = name.toLowerCase();
    let state: SlugState = { out: "", prevHyphen: false };
    for (let at = 0; at < lowered.length; at += 1) {
        state = appended(state, lowered.charAt(at));
    }
    return state.out.endsWith(SLUG_SEPARATOR) ? state.out.slice(0, -1) : state.out;
};

export const nameKeyOf = function nameKeyOf(phrase: string): string {
    return slugify(identifierParts(phrase).join(SPACE))
        .split(SLUG_SEPARATOR)
        .filter((word) => word.length > 0)
        .map((word) => normalizeWord(word))
        .join(SLUG_SEPARATOR);
};
