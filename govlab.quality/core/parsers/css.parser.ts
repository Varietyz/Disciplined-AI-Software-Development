import { BASE_COMPONENTS, COMPONENT_BOUNDARIES } from "#configuration/constants/validation.constants";
import { CLAMP_OPEN, CLAMP_PART_COUNT } from "#configuration/constants/css.constants";
import type { ClampParts, UnitToken } from "#types/css.types";
import { isAsciiAlpha, isCssNameChar } from "#core/predicates/code-point.predicate";
import valueParser from "postcss-value-parser";

const VAR_PREFIX = "--";
const VAR_CALL = "var(";
const VAR_USE = "var(--";

const nameEnd = function nameEnd(content: string, from: number): number {
    let end = from;
    while (end < content.length && isCssNameChar(content.codePointAt(end))) {
        end += 1;
    }
    return end;
};

const skipInlineSpace = function skipInlineSpace(content: string, from: number): number {
    let after = from;
    while (after < content.length && (content[after] === " " || content[after] === "\t")) {
        after += 1;
    }
    return after;
};

const isVarDefinition = function isVarDefinition(content: string, idx: number, end: number): boolean {
    const isUse = idx >= VAR_CALL.length && content.slice(idx - VAR_CALL.length, idx) === VAR_CALL;
    return !isUse && end > idx + VAR_PREFIX.length && content[skipInlineSpace(content, end)] === ":";
};

const varSpans = function varSpans(content: string): { end: number; idx: number }[] {
    const spans: { end: number; idx: number }[] = [];
    let idx = content.indexOf(VAR_PREFIX, 0);
    while (idx !== -1) {
        const end = nameEnd(content, idx + VAR_PREFIX.length);
        spans.push({ end, idx });
        idx = content.indexOf(VAR_PREFIX, end);
    }
    return spans;
};

export const definedVars = function definedVars(content: string): string[] {
    return varSpans(content)
        .filter((span) => isVarDefinition(content, span.idx, span.end))
        .map((span) => content.slice(span.idx, span.end));
};

export const scriptVarRefs = function scriptVarRefs(content: string): string[] {
    return varSpans(content)
        .filter((span) => span.end > span.idx + VAR_PREFIX.length)
        .map((span) => content.slice(span.idx, span.end));
};

export const usedVars = function usedVars(content: string): string[] {
    const names: string[] = [];
    let idx = content.indexOf(VAR_USE, 0);
    while (idx !== -1) {
        const start = idx + VAR_CALL.length;
        const end = nameEnd(content, start);
        names.push(content.slice(start, end));
        idx = content.indexOf(VAR_USE, end);
    }
    return names;
};

const selectorDefinesComponent = function selectorDefinesComponent(selector: string, pattern: string): boolean {
    if (!selector.startsWith(`.${pattern}`)) {
        return false;
    }
    const after = selector.slice(1 + pattern.length);
    return after.length === 0 || COMPONENT_BOUNDARIES.has(after.charAt(0));
};

export const componentsInFile = function componentsInFile(content: string): Set<string> {
    const selectors = content.split("\n").flatMap((raw) => {
        const braceIdx = raw.indexOf("{");
        return braceIdx === -1
            ? []
            : raw
                  .slice(0, braceIdx)
                  .split(",")
                  .map((selector) => selector.trim());
    });
    return new Set(
        BASE_COMPONENTS.filter((pattern) => selectors.some((selector) => selectorDefinesComponent(selector, pattern))),
    );
};

export const valueUnits = function valueUnits(value: string): UnitToken[] {
    const out: UnitToken[] = [];
    valueParser(value).walk((node) => {
        if (node.type === "word") {
            const parsed = valueParser.unit(node.value);
            if (parsed !== false && parsed.unit !== "") {
                out.push({ number: parsed.number, unit: parsed.unit });
            }
        }
    });
    return out;
};

const scanClassName = function scanClassName(selector: string, start: number): number {
    let i = start;
    while (i < selector.length && isCssNameChar(selector.codePointAt(i))) {
        i += 1;
    }
    return i;
};

export const extractClassNames = function extractClassNames(selector: string): string[] {
    const names: string[] = [];
    let i = 0;
    while (i < selector.length) {
        if (selector[i] === "." && i + 1 < selector.length && isAsciiAlpha(selector.codePointAt(i + 1))) {
            const end = scanClassName(selector, i + 1);
            names.push(selector.slice(i + 1, end));
            i = end;
        } else {
            i += 1;
        }
    }
    return names;
};

const PAREN_DELTA = new Map([
    ["(", 1],
    [")", -1],
]);

const matchParen = function matchParen(value: string, from: number): number {
    let depth = 1;
    let pos = from;
    while (pos < value.length && depth > 0) {
        depth += PAREN_DELTA.get(value[pos] ?? "") ?? 0;
        pos += 1;
    }
    return depth === 0 ? pos : -1;
};

const parseClampAt = function parseClampAt(value: string, idx: number): { clamp: ClampParts | null; next: number } {
    const contentStart = idx + CLAMP_OPEN.length;
    const end = matchParen(value, contentStart);
    if (end === -1) {
        return { clamp: null, next: value.length };
    }
    const parts = value.slice(contentStart, end - 1).split(",");
    if (parts.length !== CLAMP_PART_COUNT) {
        return { clamp: null, next: end };
    }
    const [min = "", preferred = "", max = ""] = parts;
    return {
        clamp: { full: value.slice(idx, end), max: max.trim(), min: min.trim(), preferred: preferred.trim() },
        next: end,
    };
};

export const extractClamps = function extractClamps(value: string): ClampParts[] {
    const results: ClampParts[] = [];
    let searchFrom = 0;
    while (searchFrom < value.length) {
        const idx = value.indexOf(CLAMP_OPEN, searchFrom);
        if (idx === -1) {
            break;
        }
        const { clamp, next } = parseClampAt(value, idx);
        results.push(...(clamp ? [clamp] : []));
        searchFrom = next;
    }
    return results;
};
