import type { LiteralFinding, WordScope } from "../../types/analyzer.types.ts";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { ROOT } from "@ssot/paths";
import { americanOf } from "@govlab/constants";
import path from "node:path";
import { relPath } from "../selectors/program.selector.ts";

const MARKDOWN_EXTENSION = ".md";
const FENCE = "```";
const TICK = "`";
const NEWLINE = "\n";

const inCase = function inCase(original: string, american: string): string {
    if (original === original.toUpperCase()) {
        return american.toUpperCase();
    }
    const first = original.charAt(0);
    return first === first.toUpperCase() ? american.charAt(0).toUpperCase() + american.slice(1) : american;
};

const isLetter = function isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
};

const isUpper = function isUpper(char: string): boolean {
    return char >= "A" && char <= "Z";
};

const isLower = function isLower(char: string): boolean {
    return char >= "a" && char <= "z";
};

const startsPart = function startsPart(run: string, at: number): boolean {
    const here = run.charAt(at);
    const before = run.charAt(at - 1);
    const after = run.charAt(at + 1);
    return isUpper(here) && (isLower(before) || (isUpper(before) && isLower(after)));
};

const codeSpans = function codeSpans(line: string): [number, number][] {
    const spans: [number, number][] = [];
    let open = line.indexOf(TICK);
    while (open !== -1) {
        const close = line.indexOf(TICK, open + 1);
        if (close === -1) {
            break;
        }
        spans.push([open, close]);
        open = line.indexOf(TICK, close + 1);
    }
    return spans;
};

const insideSpan = function insideSpan(spans: readonly [number, number][], index: number): boolean {
    return spans.some(([open, close]) => index > open && index < close);
};

interface WordSite {
    readonly start: number;
    readonly word: string;
}

const partsOf = function partsOf(run: string, offset: number): WordSite[] {
    const sites: WordSite[] = [];
    let start = 0;
    for (let at = 1; at <= run.length; at += 1) {
        if (at === run.length || startsPart(run, at)) {
            sites.push({ start: offset + start, word: run.slice(start, at) });
            start = at;
        }
    }
    return sites;
};

const wordsOf = function wordsOf(line: string): WordSite[] {
    const sites: WordSite[] = [];
    let index = 0;
    while (index < line.length) {
        if (!isLetter(line.charAt(index))) {
            index += 1;
            continue;
        }
        let end = index;
        while (end < line.length && isLetter(line.charAt(end))) {
            end += 1;
        }
        sites.push(...partsOf(line.slice(index, end), index));
        index = end;
    }
    return sites;
};

interface LineSite {
    readonly fileName: string;
    readonly line: string;
    readonly index: number;
    readonly offset: number;
}

const lineFindings = function lineFindings(site: LineSite): LiteralFinding[] {
    const spans = path.extname(site.fileName) === MARKDOWN_EXTENSION ? codeSpans(site.line) : [];
    return wordsOf(site.line).flatMap((word) => {
        const lower = word.word.toLowerCase();
        const american = americanOf(lower);
        if (american === lower || insideSpan(spans, word.start)) {
            return [];
        }
        return [
            {
                end: site.offset + word.start + word.word.length,
                file: relPath(site.fileName),
                fileName: site.fileName,
                from: word.word,
                line: site.index + 1,
                reason: null,
                start: site.offset + word.start,
                to: inCase(word.word, american),
            },
        ];
    });
};

export const spellingFindingsIn = function spellingFindingsIn(fileName: string, content: string): LiteralFinding[] {
    const markdown = path.extname(fileName) === MARKDOWN_EXTENSION;
    const findings: LiteralFinding[] = [];
    let offset = 0;
    let fenced = false;
    for (const [index, line] of content.split(NEWLINE).entries()) {
        const fence = markdown && line.trimStart().startsWith(FENCE);
        fenced = fence ? !fenced : fenced;
        const scanned = fence || fenced ? [] : lineFindings({ fileName, index, line, offset });
        findings.push(...scanned);
        offset += line.length + NEWLINE.length;
    }
    return findings;
};

export const filesUnder = function filesUnder(target: string, skipped: (relPath: string) => boolean): string[] {
    if (!statSync(target).isDirectory()) {
        return [target];
    }
    return readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(target, entry.name);
        if (skipped(full)) {
            return [];
        }
        return entry.isDirectory() ? filesUnder(full, skipped) : [full];
    });
};

export const collectSpellingFindings = function collectSpellingFindings(scope: WordScope): LiteralFinding[] {
    const wanted = (fileName: string): boolean => scope.extensions.includes(path.extname(fileName));
    return scope.roots
        .flatMap((root) => filesUnder(path.resolve(ROOT, root), scope.skipped))
        .filter(wanted)
        .flatMap((fileName) => spellingFindingsIn(fileName, readFileSync(fileName, "utf8")));
};
