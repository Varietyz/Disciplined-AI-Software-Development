import type { RenameRules, RenamedSpan } from "../../types/writing.types.ts";

interface IdSite {
    readonly after: number;
    readonly at: number;
    readonly before: string;
    readonly next: string;
    readonly rules: RenameRules;
    readonly text: string;
}

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const JOINERS = "-_";
const REF_MARK = ":";
const ANCHOR_MARK = "#";
const ANCHOR_JOINER = "-";
const SLASH = "/";
const SEGMENT_DOT = ".";
const SEGMENT_ENDS: readonly string[] = [SLASH, ".md", ".json"];
const PLACEHOLDER_OPENERS = "<{";
const COLLECTION_NOUN_TAILS: readonly string[] = [" collection", "` collection"];

const isLetter = function isLetter(char: string): boolean {
    return char.length === 1 && (LOWER.includes(char) || UPPER.includes(char));
};

const isWordPart = function isWordPart(char: string): boolean {
    return isLetter(char) || (char.length === 1 && (DIGITS.includes(char) || JOINERS.includes(char)));
};

const isIdStart = function isIdStart(char: string): boolean {
    return char.length === 1 && (LOWER.includes(char) || DIGITS.includes(char) || PLACEHOLDER_OPENERS.includes(char));
};

const closesText = function closesText(site: IdSite): boolean {
    return site.at === 0 && site.after + 1 === site.text.length;
};

const precedingSegment = function precedingSegment(text: string, slashAt: number): string {
    let open = slashAt;
    while (open > 0 && isWordPart(text.charAt(open - 1))) {
        open -= 1;
    }
    return text.slice(open, slashAt);
};

const endsSegment = function endsSegment(text: string, at: number): boolean {
    const next = text.charAt(at);
    return SEGMENT_ENDS.some((end) => text.startsWith(end, at)) || (!isWordPart(next) && next !== SEGMENT_DOT);
};

const anchorShape = function anchorShape(site: IdSite): boolean | null {
    return site.before === ANCHOR_MARK
        ? site.next === ANCHOR_JOINER && isIdStart(site.text.charAt(site.after + 1))
        : null;
};

const pathShape = function pathShape(site: IdSite): boolean | null {
    if (site.before !== SLASH) {
        return null;
    }
    return (
        site.rules.pathSegments.includes(precedingSegment(site.text, site.at - 1)) && endsSegment(site.text, site.after)
    );
};

const closingPrefix = function closingPrefix(site: IdSite): boolean {
    return site.rules.wholeId && closesText(site) && site.next === ANCHOR_JOINER;
};

const namesCollection = function namesCollection(site: IdSite): boolean {
    return COLLECTION_NOUN_TAILS.some(
        (tail) => site.text.startsWith(tail, site.after) && !isLetter(site.text.charAt(site.after + tail.length)),
    );
};

const reference = function reference(site: IdSite): boolean {
    return site.next === REF_MARK && (isIdStart(site.text.charAt(site.after + 1)) || closesText(site));
};

const openShape = function openShape(site: IdSite): boolean {
    return closingPrefix(site) || (!isWordPart(site.before) && (namesCollection(site) || reference(site)));
};

const idSpanAt = function idSpanAt(text: string, at: number, id: string, rules: RenameRules): boolean {
    const after = at + id.length;
    const site: IdSite = {
        after,
        at,
        before: at === 0 ? "" : text.charAt(at - 1),
        next: text.charAt(after),
        rules,
        text,
    };
    return anchorShape(site) ?? pathShape(site) ?? openShape(site);
};

const casedLike = function casedLike(original: string, replacement: string): string {
    if (original.length > 1 && original === original.toUpperCase()) {
        return replacement.toUpperCase();
    }
    const first = original.charAt(0);
    return first === first.toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
};

const wordEnd = function wordEnd(text: string, at: number): number {
    let end = at;
    while (end < text.length && isLetter(text.charAt(end))) {
        end += 1;
    }
    return end;
};

const wordSpanAt = function wordSpanAt(
    text: string,
    at: number,
    words: ReadonlyMap<string, string>,
): RenamedSpan | null {
    if (!isLetter(text.charAt(at)) || (at > 0 && isWordPart(text.charAt(at - 1)))) {
        return null;
    }
    const end = wordEnd(text, at);
    if (end < text.length && isWordPart(text.charAt(end))) {
        return null;
    }
    const from = text.slice(at, end);
    const to = words.get(from.toLowerCase());
    return to === undefined ? null : { end, from, start: at, to: casedLike(from, to) };
};

const spanAt = function spanAt(
    text: string,
    at: number,
    ids: readonly string[],
    rules: RenameRules,
): RenamedSpan | null {
    const id = ids.find((candidate) => text.startsWith(candidate, at) && idSpanAt(text, at, candidate, rules));
    if (id !== undefined) {
        return { end: at + id.length, from: id, start: at, to: rules.ids.get(id) ?? id };
    }
    return rules.words === null ? null : wordSpanAt(text, at, rules.words);
};

export const renamedSpans = function renamedSpans(text: string, rules: RenameRules): readonly RenamedSpan[] {
    const whole = rules.ids.get(text);
    if (rules.wholeId && whole !== undefined) {
        return [{ end: text.length, from: text, start: 0, to: whole }];
    }
    const ids = [...rules.ids.keys()].toSorted((left, right) => right.length - left.length);
    const spans: RenamedSpan[] = [];
    let at = 0;
    while (at < text.length) {
        const span = spanAt(text, at, ids, rules);
        if (span === null) {
            at += 1;
        } else {
            spans.push(span);
            at = span.end;
        }
    }
    return spans;
};

export const renamedText = function renamedText(text: string, rules: RenameRules): string {
    let renamed = "";
    let at = 0;
    for (const span of renamedSpans(text, rules)) {
        renamed += text.slice(at, span.start) + span.to;
        at = span.end;
    }
    return renamed + text.slice(at);
};
