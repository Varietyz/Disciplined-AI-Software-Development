import type { DeclaredRule } from "../types/rule.types.ts";
import { unfencedLines } from "./document.reader.ts";

interface HeadingState {
    readonly slug: string | null;
    readonly locked: boolean;
}

const GATE_MARKER = "gate:";

const LOCKED_MARKER = "(LOCKED)";

const LIST_SLUG = "- `";

const SEPARATOR_DOT = "·";

const backtickedSlug = function backtickedSlug(line: string): string | null {
    const open = line.indexOf("`");
    const close = open === -1 ? -1 : line.indexOf("`", open + 1);
    const slug = close === -1 ? "" : line.slice(open + 1, close);
    return slug.length > 0 ? slug : null;
};

const isGateChar = function isGateChar(char: string): boolean {
    return (char >= "a" && char <= "z") || char === "-";
};

const spacesAfter = function spacesAfter(line: string, from: number): number {
    let cursor = from;
    while (line.charAt(cursor) === " ") {
        cursor += 1;
    }
    return cursor;
};

const spacesBefore = function spacesBefore(line: string, from: number): number {
    let cursor = from;
    while (cursor > 0 && line.charAt(cursor - 1) === " ") {
        cursor -= 1;
    }
    return cursor;
};

const gateRunEnd = function gateRunEnd(line: string, from: number): number {
    let cursor = from;
    while (cursor < line.length && isGateChar(line.charAt(cursor))) {
        cursor += 1;
    }
    return cursor;
};

const gateOf = function gateOf(line: string): string | null {
    const marker = line.lastIndexOf(GATE_MARKER);
    if (marker === -1) {
        return null;
    }
    const start = spacesAfter(line, marker + GATE_MARKER.length);
    const value = line.slice(start, gateRunEnd(line, start));
    return value.length > 0 ? value : null;
};

const hashRun = function hashRun(line: string): number {
    let cursor = 0;
    while (line.charAt(cursor) === "#") {
        cursor += 1;
    }
    return cursor;
};

const slugAfter = function slugAfter(line: string, open: number): string | null {
    const close = line.indexOf("`", open + 1);
    const slug = close === -1 ? "" : line.slice(open + 1, close);
    const tail = line.slice(close + 1).trim();
    return slug.length > 0 && (tail.length === 0 || tail === LOCKED_MARKER) ? slug : null;
};

const headingSlug = function headingSlug(line: string): string | null {
    const hashes = hashRun(line);
    const open = spacesAfter(line, hashes);
    return hashes > 0 && line.charAt(open) === "`" ? slugAfter(line, open) : null;
};

const listedRule = function listedRule(line: string, number: number): DeclaredRule[] {
    const slug = backtickedSlug(line);
    const gate = slug === null ? null : gateOf(line);
    return slug === null || gate === null ? [] : [{ gate, line: number, locked: line.includes(LOCKED_MARKER), slug }];
};

const headedRule = function headedRule(heading: HeadingState, line: string, number: number): DeclaredRule | null {
    const gate = heading.slug === null ? null : gateOf(line);
    return heading.slug === null || gate === null
        ? null
        : { gate, line: number, locked: heading.locked, slug: heading.slug };
};

export const readDeclaredRules = function readDeclaredRules(source: string): DeclaredRule[] {
    const out: DeclaredRule[] = [];
    let heading: HeadingState = { locked: false, slug: null };

    for (const { text: line, number } of unfencedLines(source)) {
        if (line.startsWith("#")) {
            heading = { locked: line.includes(LOCKED_MARKER), slug: headingSlug(line) };
        } else if (line.startsWith(LIST_SLUG)) {
            out.push(...listedRule(line, number));
        } else {
            const rule = headedRule(heading, line, number);
            out.push(...(rule === null ? [] : [rule]));
            heading = rule === null ? heading : { ...heading, slug: null };
        }
    }

    return out;
};

export const readExpandedSlugs = function readExpandedSlugs(source: string): { slug: string; line: number }[] {
    return unfencedLines(source)
        .filter(({ text }) => text.startsWith("#"))
        .flatMap(({ text, number }) => {
            const slug = headingSlug(text);
            return slug === null ? [] : [{ line: number, slug }];
        });
};

const declarationStart = function declarationStart(line: string, marker: number): number {
    const before = spacesBefore(line, marker);
    const dotted = before > 0 && line.charAt(before - 1) === SEPARATOR_DOT ? before - 1 : before;
    return spacesBefore(line, dotted);
};

const withoutGate = function withoutGate(line: string): string {
    const marker = line.lastIndexOf(GATE_MARKER);
    if (marker === -1 || gateOf(line) === null) {
        return line;
    }
    const end = gateRunEnd(line, spacesAfter(line, marker + GATE_MARKER.length));
    return line.slice(0, declarationStart(line, marker)) + line.slice(end);
};

export const stripGateDeclarations = function stripGateDeclarations(source: string): string {
    return source.split("\n").map(withoutGate).join("\n");
};
