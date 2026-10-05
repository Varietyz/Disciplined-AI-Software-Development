import type { RefConstruct, RefConstructDefect, RefMatch, RefScan } from "#types/reference.types";
import { isAlpha, isIdentifierChar } from "@govlab/constants";
import { proseLines } from "#core/parsers/markdown.parser";
import { unknownVerb } from "#configuration/strings/reference.strings";

const TICK = "`";
const QUOTE = '"';
const SPACE = " ";
const VERB_OPENER = ": `";
const MAX_VERB_WORDS = 2;
const IDENT_OFFSET = 2;
const PATH_OFFSET = 3;

const isWordChar = function isWordChar(code: number): boolean {
    return isIdentifierChar(String.fromCodePoint(code));
};

const isIdentifier = function isIdentifier(value: string): boolean {
    if (value.length === 0 || !isAlpha(value.charAt(0))) {
        return false;
    }
    for (const char of value) {
        if (!isWordChar(char.codePointAt(0) ?? 0)) {
            return false;
        }
    }
    return true;
};

const unbacktick = function unbacktick(value: string): string {
    let start = 0;
    let end = value.length;
    while (start < end && value.charAt(start) === TICK) {
        start += 1;
    }
    while (end > start && value.charAt(end - 1) === TICK) {
        end -= 1;
    }
    return value.slice(start, end);
};

const opensBacktickedIdent = function opensBacktickedIdent(line: string, afterColon: number): boolean {
    return line.charAt(afterColon) === SPACE && line.charAt(afterColon + 1) === TICK;
};

const opensQuotedPath = function opensQuotedPath(line: string, identEnd: number): boolean {
    return line.charAt(identEnd + 1) === SPACE && line.charAt(identEnd + IDENT_OFFSET) === QUOTE;
};

const matchAt = function matchAt(line: string, start: number, verb: string): RefMatch | null {
    if (start > 0 && isWordChar(line.codePointAt(start - 1) ?? 0)) {
        return null;
    }
    const afterColon = start + verb.length + 1;
    if (!opensBacktickedIdent(line, afterColon)) {
        return null;
    }
    const identStart = afterColon + IDENT_OFFSET;
    const identEnd = line.indexOf(TICK, identStart);
    if (identEnd === -1) {
        return null;
    }
    const identifier = line.slice(identStart, identEnd);
    if (!isIdentifier(identifier) || !opensQuotedPath(line, identEnd)) {
        return null;
    }
    const pathStart = identEnd + PATH_OFFSET;
    const pathEnd = line.indexOf(QUOTE, pathStart);
    return pathEnd === -1 ? null : { end: pathEnd, identifier, path: unbacktick(line.slice(pathStart, pathEnd)) };
};

const scanVerb = function scanVerb(line: string, lineNo: number, verb: string): RefConstruct[] {
    const found: RefConstruct[] = [];
    const needle = `${verb}:`;
    let from = 0;
    while (from < line.length) {
        const at = line.indexOf(needle, from);
        if (at === -1) {
            return found;
        }
        const match = matchAt(line, at, verb);
        if (match === null) {
            from = at + 1;
        } else {
            found.push({ col: at + 1, identifier: match.identifier, line: lineNo, path: match.path, verb });
            from = match.end + 1;
        }
    }
    return found;
};

const wordStart = function wordStart(line: string, from: number): number {
    let start = from;
    while (start > 0 && isWordChar(line.codePointAt(start - 1) ?? 0)) {
        start -= 1;
    }
    return start;
};

const verbCandidates = function verbCandidates(line: string, colon: number): string[] {
    const candidates: string[] = [];
    let at = colon;
    let more = true;
    while (more && candidates.length < MAX_VERB_WORDS) {
        const start = wordStart(line, at);
        more = start !== at;
        if (more) {
            at = start;
            candidates.push(line.slice(at, colon));
            more = at > 0 && line.charAt(at - 1) === SPACE;
            at -= more ? 1 : 0;
        }
    }
    return candidates;
};

const unknownVerbAt = function unknownVerbAt(
    line: string,
    lineNo: number,
    colon: number,
    known: readonly string[],
): RefConstructDefect | null {
    const candidates = verbCandidates(line, colon);
    if (candidates.length === 0 || candidates.some((verb) => known.includes(verb))) {
        return null;
    }
    const verb = candidates.at(-1) ?? "";
    const start = colon - verb.length;
    if (matchAt(line, start, verb) === null) {
        return null;
    }
    return { code: "unknown-verb", col: start + 1, detail: unknownVerb(verb, known.join(", ")), line: lineNo };
};

const unknownVerbs = function unknownVerbs(
    line: string,
    lineNo: number,
    known: readonly string[],
): RefConstructDefect[] {
    const defects: RefConstructDefect[] = [];
    let colon = line.indexOf(VERB_OPENER);
    while (colon !== -1) {
        const defect = unknownVerbAt(line, lineNo, colon, known);
        if (defect !== null) {
            defects.push(defect);
        }
        colon = line.indexOf(VERB_OPENER, colon + 1);
    }
    return defects;
};

const dedupe = function dedupe(found: readonly RefConstruct[]): RefConstruct[] {
    const byKey = new Map<string, RefConstruct>();
    for (const construct of found) {
        const key = `${String(construct.line)}:${construct.identifier}:${construct.path}`;
        if (!byKey.has(key)) {
            byKey.set(key, construct);
        }
    }
    return [...byKey.values()];
};

export const parseReferences = function parseReferences(source: string, verbs: readonly string[]): RefScan {
    const ordered = verbs.toSorted((left, right) => right.length - left.length);
    const constructs: RefConstruct[] = [];
    const defects: RefConstructDefect[] = [];
    for (const { line, lineNo } of proseLines(source)) {
        constructs.push(...dedupe(ordered.flatMap((verb) => scanVerb(line, lineNo, verb))));
        defects.push(...unknownVerbs(line, lineNo, ordered));
    }
    return { constructs, defects };
};
