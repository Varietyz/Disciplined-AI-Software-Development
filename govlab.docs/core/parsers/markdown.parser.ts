import type { Fence, FenceRun, MaskState } from "#types/markdown.types";
import { FRONTMATTER_FENCE } from "#configuration/constants/document.constants";
import { isDigit } from "@govlab/constants";

export const NO_FENCE: Fence = { char: "", len: 0, open: false };

const MIN_FENCE_LEN = 3;
const TAB_WIDTH = 4;
const INDENT_CODE_WIDTH = 4;
const LIST_CONTENT_OFFSET = 2;
const FENCE_CHARS: ReadonlySet<string> = new Set(["`", "~"]);
const INLINE_SPACE: ReadonlySet<string> = new Set([" ", "\t"]);
const BULLET_MARKERS: readonly string[] = ["- ", "* ", "+ "];
const ORDINAL_MARKERS: ReadonlySet<string> = new Set([".", ")"]);
const CARRIAGE_RETURN = "\r";

const fenceRun = function fenceRun(trimmed: string): FenceRun | null {
    const char = trimmed.charAt(0);
    if (!FENCE_CHARS.has(char)) {
        return null;
    }
    let len = 0;
    while (len < trimmed.length && trimmed.charAt(len) === char) {
        len += 1;
    }
    return len >= MIN_FENCE_LEN ? { char, len } : null;
};

const isBareClose = function isBareClose(trimmed: string, fence: Fence): boolean {
    const run = fenceRun(trimmed);
    if (run?.char !== fence.char || run.len < fence.len) {
        return false;
    }
    for (let at = run.len; at < trimmed.length; at += 1) {
        if (!INLINE_SPACE.has(trimmed.charAt(at))) {
            return false;
        }
    }
    return true;
};

export const stepFence = function stepFence(trimmed: string, fence: Fence): Fence {
    if (!fence.open) {
        const run = fenceRun(trimmed);
        return run === null ? fence : { char: run.char, len: run.len, open: true };
    }
    return isBareClose(trimmed, fence) ? NO_FENCE : fence;
};

export const splitLines = function splitLines(source: string): string[] {
    return source.split("\n").map((line) => (line.endsWith(CARRIAGE_RETURN) ? line.slice(0, -1) : line));
};

export const bodyStart = function bodyStart(lines: readonly string[]): number {
    if ((lines[0] ?? "").trim() !== FRONTMATTER_FENCE) {
        return 0;
    }
    for (let at = 1; at < lines.length; at += 1) {
        if ((lines[at] ?? "").trim() === FRONTMATTER_FENCE) {
            return at + 1;
        }
    }
    return 0;
};

const leadingWidth = function leadingWidth(line: string): number {
    let width = 0;
    for (const char of line) {
        if (!INLINE_SPACE.has(char)) {
            return width;
        }
        width += char === " " ? 1 : TAB_WIDTH;
    }
    return width;
};

const isListMarker = function isListMarker(trimmed: string): boolean {
    if (BULLET_MARKERS.some((marker) => trimmed.startsWith(marker))) {
        return true;
    }
    let at = 0;
    while (at < trimmed.length && isDigit(trimmed.charAt(at))) {
        at += 1;
    }
    return at > 0 && ORDINAL_MARKERS.has(trimmed.charAt(at)) && trimmed.charAt(at + 1) === " ";
};

const detectIndentedCode = function detectIndentedCode(indent: number, trimmed: string, state: MaskState): boolean {
    if (isListMarker(trimmed)) {
        state.listContentIndent = indent + LIST_CONTENT_OFFSET;
        return false;
    }
    if (indent >= INDENT_CODE_WIDTH && state.prevBlank && state.listContentIndent < 0) {
        state.inIndentedCode = true;
        return true;
    }
    return false;
};

const classifyContentLine = function classifyContentLine(line: string, trimmed: string, state: MaskState): boolean {
    const indent = leadingWidth(line);
    if (state.inIndentedCode && indent >= INDENT_CODE_WIDTH) {
        state.prevBlank = false;
        return true;
    }
    state.inIndentedCode = false;
    if (state.listContentIndent >= 0 && indent < state.listContentIndent) {
        state.listContentIndent = -1;
    }
    const code = detectIndentedCode(indent, trimmed, state);
    state.prevBlank = false;
    return code;
};

const fenced = function fenced(state: MaskState): boolean {
    state.inIndentedCode = false;
    state.prevBlank = false;
    return true;
};

const blankLine = function blankLine(state: MaskState): boolean {
    const inCode = state.inIndentedCode;
    state.prevBlank = true;
    return inCode;
};

const stepMask = function stepMask(line: string, state: MaskState): boolean {
    const trimmed = line.trim();
    const wasOpen = state.fence.open;
    state.fence = stepFence(trimmed, state.fence);
    if (wasOpen || state.fence.open) {
        return fenced(state);
    }
    if (trimmed === "") {
        return blankLine(state);
    }
    return classifyContentLine(line, trimmed, state);
};

export const codeLineMask = function codeLineMask(lines: readonly string[], start: number): boolean[] {
    const mask = Array.from({ length: lines.length }, () => false);
    const state: MaskState = { fence: NO_FENCE, inIndentedCode: false, listContentIndent: -1, prevBlank: true };
    for (let at = start; at < lines.length; at += 1) {
        mask[at] = stepMask(lines[at] ?? "", state);
    }
    return mask;
};

export const proseLines = function proseLines(source: string): { line: string; lineNo: number }[] {
    const lines = splitLines(source);
    const start = bodyStart(lines);
    const mask = codeLineMask(lines, start);
    return lines.flatMap((line, at) => (at < start || mask[at] === true ? [] : [{ line, lineNo: at + 1 }]));
};
