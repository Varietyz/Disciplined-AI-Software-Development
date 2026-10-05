import {
    FIELD_SEPARATOR,
    GENERATED_MARK_PREFIX,
    LINE_END,
    MARK_CLOSE,
    MINUTE_LENGTH,
    UTC_SUFFIX,
    VERSION_PREFIX,
} from "#configuration/constants/mark.constants";
import { bodyStartOf, markLineAt, parseMark } from "#core/selectors/mark.selector";
import type { GeneratedMark } from "#types/mark.types";

export const markTimeOf = function markTimeOf(date: Date): string {
    return date.toISOString().slice(0, MINUTE_LENGTH) + UTC_SUFFIX;
};

export const composeMark = function composeMark(mark: GeneratedMark): string {
    return GENERATED_MARK_PREFIX + mark.time + FIELD_SEPARATOR + VERSION_PREFIX + String(mark.version) + MARK_CLOSE;
};

const skipBlankLines = function skipBlankLines(text: string, from: number): number {
    let at = from;
    while (text.startsWith(LINE_END, at)) {
        at += LINE_END.length;
    }
    return at;
};

export const stripMark = function stripMark(text: string): string {
    const at = markLineAt(text);
    return at === null ? text : text.slice(0, at.start) + text.slice(skipBlankLines(text, at.end));
};

const insertMark = function insertMark(body: string, mark: GeneratedMark): string {
    const line = composeMark(mark) + LINE_END + LINE_END;
    const after = bodyStartOf(body);
    return body.slice(0, after) + line + body.slice(skipBlankLines(body, after));
};

export const stampGenerated = function stampGenerated(
    body: string,
    previous: string,
    now: Date,
    normalize: (text: string) => string = (text) => text,
): string {
    const held = parseMark(previous);
    const unmarked = stripMark(body);
    if (held !== null) {
        const kept = insertMark(unmarked, held);
        if (normalize(kept) === normalize(previous)) {
            return kept;
        }
    }
    return insertMark(unmarked, { time: markTimeOf(now), version: (held?.version ?? 0) + 1 });
};
