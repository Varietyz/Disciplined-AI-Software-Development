import type { PrincipleWalk } from "../types/architecture.types.ts";

const RECORD_ANCHOR = "### ";

const PREFIX = "ARC-";

const isDigit = function isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
};

const idAt = function idAt(text: string, at: number): string[] {
    const from = at + PREFIX.length;
    let cursor = from;
    while (cursor < text.length && isDigit(text.charAt(cursor))) {
        cursor += 1;
    }
    return cursor > from ? [text.slice(at, cursor)] : [];
};

const occurrences = function occurrences(text: string): number[] {
    const out: number[] = [];
    let at = text.indexOf(PREFIX);
    while (at !== -1) {
        out.push(at);
        at = text.indexOf(PREFIX, at + PREFIX.length);
    }
    return out;
};

const anchoredId = function anchoredId(line: string): string[] {
    const trimmed = line.trim();
    return trimmed.indexOf(PREFIX) === RECORD_ANCHOR.length ? idAt(trimmed, RECORD_ANCHOR.length) : [];
};

const idsIn = function idsIn(source: string, anchored: boolean): string[] {
    return source
        .split("\n")
        .flatMap((line) => (anchored ? anchoredId(line) : occurrences(line).flatMap((at) => idAt(line, at))));
};

const byId = function byId(left: string, right: string): number {
    return left.localeCompare(right, "en");
};

export const walkPrinciples = function walkPrinciples(catalog: string, citing: readonly string[]): PrincipleWalk {
    const declared = new Set(idsIn(catalog, true));
    const cited = new Set(citing.flatMap((source) => idsIn(source, false)));

    const uncited = [...declared].filter((id) => !cited.has(id)).toSorted(byId);
    const dangling = [...cited].filter((id) => !declared.has(id)).toSorted(byId);

    return { cited: declared.size - uncited.length, danglingCitations: dangling, declared: declared.size, uncited };
};
