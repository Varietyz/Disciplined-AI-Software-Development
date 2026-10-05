import { basename, isAbsolute, relative } from "node:path";
import type { PathExclusion } from "#types/exclusions.types";

const SEPARATOR = "/";
const WILDCARD = "*";
const PARENT = "..";
const CURRENT = ".";

const segmentsOf = function segmentsOf(path: string): string[] {
    return path
        .split("\\")
        .join(SEPARATOR)
        .split(SEPARATOR)
        .filter((segment) => segment.length > 0 && segment !== CURRENT);
};

const matchesSegment = function matchesSegment(text: string, marker: string): boolean {
    const parts = marker.split(WILDCARD);
    const [head = ""] = parts;
    if (parts.length === 1) {
        return text === marker;
    }
    if (!text.startsWith(head)) {
        return false;
    }
    let cursor = head.length;
    for (const part of parts.slice(1)) {
        const at = part === "" ? cursor : text.indexOf(part, cursor);
        if (at === -1) {
            return false;
        }
        cursor = at + part.length;
    }
    const tail = parts.at(-1) ?? "";
    return tail === "" || text.endsWith(tail);
};

const matchesRunAt = function matchesRunAt(path: readonly string[], marker: readonly string[], start: number): boolean {
    return marker.every((part, offset) => {
        const segment = path[start + offset];
        return segment !== undefined && matchesSegment(segment, part);
    });
};

export const isExcludedPath = function isExcludedPath(relPath: string, markers: readonly string[]): boolean {
    const path = segmentsOf(relPath);
    return markers.some((marker) => {
        const run = segmentsOf(marker);
        if (run.length === 0) {
            return false;
        }
        for (let start = 0; start + run.length <= path.length; start += 1) {
            if (matchesRunAt(path, run, start)) {
                return true;
            }
        }
        return false;
    });
};

export const pathExclusion = function pathExclusion(root: string, markers: readonly string[]): PathExclusion {
    return (target: string): boolean => {
        const rel = isAbsolute(target) ? relative(root, target) : target;
        const [first] = segmentsOf(rel);
        const outside = first === PARENT || isAbsolute(rel);
        return isExcludedPath(outside ? basename(target) : rel, markers);
    };
};
