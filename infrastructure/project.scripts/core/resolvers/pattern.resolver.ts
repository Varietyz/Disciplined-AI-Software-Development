import { DEEP_WILDCARD, PARENT_SEGMENT, SINGLE_WILDCARD, WILDCARD } from "#configuration/constants/closure.constants";
import { dirname, join } from "node:path";
import { existsSync, readdirSync, statSync } from "node:fs";
import type { ScanState } from "#types/closure.types";

const stepScan = function stepScan(name: string, pattern: string, at: ScanState): ScanState | null {
    const patternChar = at.pattern < pattern.length ? pattern.charAt(at.pattern) : undefined;
    if (patternChar === name.charAt(at.name) || patternChar === SINGLE_WILDCARD) {
        return { ...at, name: at.name + 1, pattern: at.pattern + 1 };
    }
    if (patternChar === WILDCARD) {
        return { ...at, pattern: at.pattern + 1, starName: at.name, starPattern: at.pattern };
    }
    if (at.starPattern >= 0) {
        return { ...at, name: at.starName + 1, pattern: at.starPattern + 1, starName: at.starName + 1 };
    }
    return null;
};

export const segmentMatches = function segmentMatches(name: string, pattern: string): boolean {
    let at: ScanState = { name: 0, pattern: 0, starName: -1, starPattern: -1 };
    while (at.name < name.length) {
        const next = stepScan(name, pattern, at);
        if (next === null) {
            return false;
        }
        at = next;
    }
    let tail = at.pattern;
    while (tail < pattern.length && pattern.charAt(tail) === WILDCARD) {
        tail += 1;
    }
    return tail === pattern.length;
};

const entriesIn = function entriesIn(dir: string): string[] {
    return existsSync(dir) && statSync(dir).isDirectory() ? readdirSync(dir) : [];
};

const expandMatch = function expandMatch(full: string, rest: readonly string[]): string[] {
    const isDir = statSync(full).isDirectory();
    if (rest.length === 0) {
        return isDir ? [] : [full];
    }
    return isDir ? expandPattern(full, rest) : [];
};

const expandDeep = function expandDeep(dir: string, segments: readonly string[], rest: readonly string[]): string[] {
    return [
        ...expandPattern(dir, rest),
        ...entriesIn(dir)
            .map((name) => join(dir, name))
            .filter((full) => statSync(full).isDirectory())
            .flatMap((full) => expandPattern(full, segments)),
    ];
};

export const expandPattern = function expandPattern(dir: string, segments: readonly string[]): string[] {
    if (segments.length === 0) {
        return [];
    }
    const [head = "", ...rest] = segments;
    if (head === PARENT_SEGMENT) {
        return expandPattern(dirname(dir), rest);
    }
    if (head === DEEP_WILDCARD) {
        return expandDeep(dir, segments, rest);
    }
    return entriesIn(dir)
        .filter((name) => segmentMatches(name, head))
        .flatMap((name) => expandMatch(join(dir, name), rest));
};
