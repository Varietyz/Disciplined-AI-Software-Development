import {
    FIELD_SEPARATOR,
    FRONTMATTER_CLOSE,
    FRONTMATTER_OPEN,
    GENERATED_MARK_PREFIX,
    LINE_END,
    MARK_CLOSE,
    VERSION_PREFIX,
} from "#configuration/constants/mark.constants";
import type { GeneratedMark, MarkSpan } from "#types/mark.types";

export const bodyStartOf = function bodyStartOf(text: string): number {
    if (!text.startsWith(FRONTMATTER_OPEN)) {
        return 0;
    }
    const close = text.indexOf(FRONTMATTER_CLOSE, FRONTMATTER_OPEN.length - LINE_END.length);
    return close === -1 ? 0 : close + FRONTMATTER_CLOSE.length;
};

export const markLineAt = function markLineAt(text: string): MarkSpan | null {
    const start = bodyStartOf(text);
    if (!text.startsWith(GENERATED_MARK_PREFIX, start)) {
        return null;
    }
    const lineEnd = text.indexOf(LINE_END, start);
    return { end: lineEnd === -1 ? text.length : lineEnd, start };
};

const versionOf = function versionOf(field: string): number | null {
    if (!field.startsWith(VERSION_PREFIX)) {
        return null;
    }
    const count = Number(field.slice(VERSION_PREFIX.length));
    return Number.isInteger(count) && count > 0 ? count : null;
};

export const parseMark = function parseMark(text: string): GeneratedMark | null {
    const at = markLineAt(text);
    if (at === null) {
        return null;
    }
    const line = text.slice(at.start + GENERATED_MARK_PREFIX.length, at.end);
    if (!line.endsWith(MARK_CLOSE)) {
        return null;
    }
    const [time = "", version = ""] = line.slice(0, -MARK_CLOSE.length).split(FIELD_SEPARATOR);
    const count = versionOf(version);
    return count !== null && time.length > 0 ? { time, version: count } : null;
};
