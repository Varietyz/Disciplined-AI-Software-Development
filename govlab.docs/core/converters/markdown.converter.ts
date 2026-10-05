import { bodyStart, codeLineMask } from "#core/parsers/markdown.parser";
import type { SpanDelims } from "#types/reference.types";
import type { TextSpan } from "#types/markdown.types";
import { pathSpans } from "#core/selectors/markdown.selector";

const TICK = "`";
const CARRIAGE_RETURN = "\r";
const BACKTICK_DELIMS: SpanDelims = { close: TICK, open: TICK };
const LINK_DELIMS: SpanDelims = { close: ")", open: "](" };

const runLength = function runLength(line: string, from: number): number {
    let at = from;
    while (at < line.length && line.charAt(at) === TICK) {
        at += 1;
    }
    return at - from;
};

const findCloseEnd = function findCloseEnd(line: string, from: number, run: number): number {
    let at = from;
    while (at < line.length) {
        if (line.charAt(at) !== TICK) {
            at += 1;
            continue;
        }
        const closeRun = runLength(line, at);
        if (closeRun === run) {
            return at + closeRun;
        }
        at += closeRun;
    }
    return -1;
};

const codeSpanAt = function codeSpanAt(line: string, at: number): TextSpan {
    const run = runLength(line, at);
    const closeEnd = findCloseEnd(line, at + run, run);
    const spanEnd = closeEnd === -1 ? at + run : closeEnd;
    return { next: spanEnd, text: " ".repeat(spanEnd - at) };
};

export const stripInlineCode = function stripInlineCode(line: string): string {
    let out = "";
    let at = 0;
    while (at < line.length) {
        if (line.charAt(at) === TICK) {
            const span = codeSpanAt(line, at);
            out += span.text;
            at = span.next;
        } else {
            out += line.charAt(at);
            at += 1;
        }
    }
    return out;
};

const nextBlankSpan = function nextBlankSpan(line: string, delims: SpanDelims, from: number): TextSpan {
    const start = line.indexOf(delims.open, from);
    if (start === -1) {
        return { next: line.length, text: line.slice(from) };
    }
    const before = line.slice(from, start);
    const end = line.indexOf(delims.close, start + delims.open.length);
    if (end === -1) {
        return { next: line.length, text: before + " ".repeat(line.length - start) };
    }
    const stop = end + delims.close.length;
    return { next: stop, text: before + " ".repeat(stop - start) };
};

const blankSpans = function blankSpans(line: string, delims: SpanDelims): string {
    let out = "";
    let at = 0;
    while (at < line.length) {
        const span = nextBlankSpan(line, delims, at);
        out += span.text;
        at = span.next;
    }
    return out;
};

export const blankMarkup = function blankMarkup(line: string): string {
    return blankSpans(blankSpans(line, BACKTICK_DELIMS), LINK_DELIMS);
};

const wrapLinePaths = function wrapLinePaths(line: string): string {
    return pathSpans(blankMarkup(line))
        .toReversed()
        .reduce(
            (out, [start, end]) => `${out.slice(0, start)}${TICK}${out.slice(start, end)}${TICK}${out.slice(end)}`,
            line,
        );
};

const wrapLineKeepingReturn = function wrapLineKeepingReturn(line: string): string {
    if (!line.endsWith(CARRIAGE_RETURN)) {
        return wrapLinePaths(line);
    }
    return wrapLinePaths(line.slice(0, -1)) + CARRIAGE_RETURN;
};

export const backtickBarePaths = function backtickBarePaths(source: string): string {
    const lines = source.split("\n");
    const start = bodyStart(lines);
    const mask = codeLineMask(lines, start);
    return lines.map((line, at) => (at < start || mask[at] === true ? line : wrapLineKeepingReturn(line))).join("\n");
};
