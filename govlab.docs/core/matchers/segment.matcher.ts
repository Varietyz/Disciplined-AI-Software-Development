import { isDirectory, sortedNames } from "#core/loaders/base.loader";
import { join } from "node:path";

const WILDCARD = "*";

export const segmentMatches = function segmentMatches(pattern: string, name: string): boolean {
    const star = pattern.indexOf(WILDCARD);
    if (star === -1) {
        return pattern === name;
    }
    const head = pattern.slice(0, star);
    const tail = pattern.slice(star + 1);
    return name.length >= head.length + tail.length && name.startsWith(head) && name.endsWith(tail);
};

export const expandGlob = function expandGlob(dir: string, segments: readonly string[]): string[] {
    const [head, ...rest] = segments;
    if (head === undefined) {
        return [];
    }
    const matched = sortedNames(dir)
        .filter((name) => segmentMatches(head, name))
        .map((name) => join(dir, name));
    if (rest.length === 0) {
        return matched.filter((full) => !isDirectory(full));
    }
    return matched.filter(isDirectory).flatMap((full) => expandGlob(full, rest));
};
