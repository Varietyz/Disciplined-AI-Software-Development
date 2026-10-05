import type { OntologyRef } from "#types/reference.types";
import { proseLines } from "#core/parsers/markdown.parser";

const TICK = "`";
const SEPARATOR = ":";
const PLACEHOLDER_CHARS: ReadonlySet<string> = new Set(["<", ">", "{", "}", "*", " ", "|", "/"]);

const isPlaceholder = function isPlaceholder(span: string): boolean {
    for (const char of span) {
        if (PLACEHOLDER_CHARS.has(char)) {
            return true;
        }
    }
    return false;
};

const refOf = function refOf(span: string, collections: ReadonlySet<string>): string | null {
    const colon = span.indexOf(SEPARATOR);
    if (colon <= 0 || colon === span.length - 1 || isPlaceholder(span)) {
        return null;
    }
    return collections.has(span.slice(0, colon)) ? span : null;
};

const refsInLine = function refsInLine(line: string, lineNo: number, collections: ReadonlySet<string>): OntologyRef[] {
    const found: OntologyRef[] = [];
    let from = 0;
    while (from < line.length) {
        const open = line.indexOf(TICK, from);
        const close = open === -1 ? -1 : line.indexOf(TICK, open + 1);
        if (close === -1) {
            return found;
        }
        const ref = refOf(line.slice(open + 1, close), collections);
        if (ref !== null) {
            found.push({ col: open + 1, line: lineNo, ref });
        }
        from = close + 1;
    }
    return found;
};

export const ontologyRefs = function ontologyRefs(source: string, collections: ReadonlySet<string>): OntologyRef[] {
    return proseLines(source).flatMap(({ line, lineNo }) => refsInLine(line, lineNo, collections));
};
