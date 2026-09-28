import type { ForeignMarker, TaxonomyData } from "../types/taxonomy.types.ts";
import { readdirSync, statSync } from "node:fs";

import type { Dirent } from "node:fs";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";
import { resolve } from "node:path";

type ForeignScope = Pick<TaxonomyData, "foreignGrammar" | "ignored">;

interface FolderScan {
    readonly marker: ForeignMarker | undefined;
    readonly children: readonly string[];
}

export const isDirectory = function isDirectory(repoRoot: string, relPath: string): boolean {
    try {
        return statSync(resolve(repoRoot, relPath), { throwIfNoEntry: false })?.isDirectory() ?? false;
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return false;
        }
        throw error;
    }
};

const wraps = function wraps(name: string, open: string, close: string): boolean {
    return name.length > open.length + close.length && name.startsWith(open) && name.endsWith(close);
};

const isGroupingFolder = function isGroupingFolder(name: string, pairs: readonly (readonly string[])[]): boolean {
    return pairs.some(([open = "", close = ""]) => open.length > 0 && close.length > 0 && wraps(name, open, close));
};

const entriesOf = function entriesOf(repoRoot: string, folder: string): Dirent[] {
    try {
        return readdirSync(resolve(repoRoot, folder), { withFileTypes: true });
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return [];
        }
        throw error;
    }
};

const markerOf = function markerOf(entry: Dirent, evidence: string, scope: ForeignScope): ForeignMarker | null {
    if (!entry.isDirectory()) {
        return scope.foreignGrammar.ownershipManifests.includes(entry.name)
            ? {
                  evidence,
                  why: `"${entry.name}" makes its directory a runtime-identified unit, so its name is an identifier another system resolves.`,
              }
            : null;
    }

    return !scope.ignored.includes(entry.name) && isGroupingFolder(entry.name, scope.foreignGrammar.groupingDelimiters)
        ? { evidence, why: `"${entry.name}" is another grammar's grouping construct, which this one forbids outright.` }
        : null;
};

const scanFolder = function scanFolder(repoRoot: string, folder: string, scope: ForeignScope): FolderScan {
    const entries = entriesOf(repoRoot, folder);
    const marker = entries
        .map((entry) => markerOf(entry, `${folder}/${entry.name}`, scope))
        .find((found): found is ForeignMarker => found !== null);
    const children = entries
        .filter((entry) => entry.isDirectory() && !scope.ignored.includes(entry.name))
        .map((entry) => `${folder}/${entry.name}`);

    return { children, marker };
};

export const foreignMarkerIn = function foreignMarkerIn(
    repoRoot: string,
    root: string,
    scope: ForeignScope,
): ForeignMarker | null {
    const pending: string[] = [root];
    let current = pending.pop();

    while (current !== undefined) {
        const scan = scanFolder(repoRoot, current, scope);
        if (scan.marker !== undefined) {
            return scan.marker;
        }
        pending.push(...scan.children);
        current = pending.pop();
    }

    return null;
};
