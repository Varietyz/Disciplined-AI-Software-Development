import { PACKAGE_MANIFEST, WILDCARD, WORKSPACES_KEY } from "#configuration/constants/package.constants";
import { arrayField, stringsIn } from "#core/selectors/field.selector";
import path from "node:path";
import { posixOf } from "#core/selectors/source.selector";
import { readJson } from "#core/loaders/data.loader";
import { readdirSafe } from "#core/loaders/folder.loader";

const matchesSegment = function matchesSegment(pattern: string, name: string): boolean {
    if (!pattern.includes(WILDCARD)) {
        return pattern === name;
    }
    const [head = "", tail = ""] = pattern.split(WILDCARD);
    return name.startsWith(head) && name.endsWith(tail) && name.length >= head.length + tail.length;
};

const expand = function expand(absDir: string, segments: readonly string[]): string[] {
    const [head, ...rest] = segments;
    if (head === undefined) {
        return [absDir];
    }
    if (!head.includes(WILDCARD)) {
        return expand(path.join(absDir, head), rest);
    }
    return readdirSafe(absDir)
        .filter((entry) => entry.isDirectory() && matchesSegment(head, entry.name))
        .flatMap((entry) => expand(path.join(absDir, entry.name), rest));
};

const holdsManifest = function holdsManifest(abs: string): boolean {
    return readdirSafe(abs).some((entry) => entry.isFile() && entry.name === PACKAGE_MANIFEST);
};

export const workspaceMembers = function workspaceMembers(root: string): string[] {
    const manifest = readJson(path.join(root, PACKAGE_MANIFEST));
    const patterns = stringsIn(arrayField(manifest, WORKSPACES_KEY));
    const candidates = patterns.flatMap((pattern) => expand(root, pattern.split("/")));
    return [...new Set(candidates.filter(holdsManifest))].toSorted((a, b) => a.localeCompare(b));
};

export const memberIndex = function memberIndex(root: string): string[] {
    return workspaceMembers(root)
        .map((abs) => posixOf(path.relative(root, abs)))
        .toSorted((a, b) => b.length - a.length);
};

export const ownerOf = function ownerOf(members: readonly string[], relPath: string): string | null {
    const norm = posixOf(relPath);
    return members.find((member) => norm === member || norm.startsWith(`${member}/`)) ?? null;
};
