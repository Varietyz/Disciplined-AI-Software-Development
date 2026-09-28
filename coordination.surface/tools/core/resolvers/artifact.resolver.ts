import type { ArtifactRootData, TaxonomyData } from "../types/taxonomy.types.ts";
import { existsSync, readFileSync, statSync } from "node:fs";

import { relative, resolve, sep } from "node:path";
import type { ArtifactRoot } from "../types/artifact.types.ts";
import { isFilesystemRefusal } from "../predicates/file.predicate.ts";
import { isObject } from "../predicates/schema.predicate.ts";

const toPosix = function toPosix(root: string, path: string): string {
    return relative(root, path).split(sep).join("/");
};

const readField = function readField(source: unknown, field: readonly string[]): string | null {
    let current: unknown = source;
    for (const key of field) {
        current = isObject(current) ? current[key] : undefined;
    }
    return typeof current === "string" ? current : null;
};

const isDirectory = function isDirectory(absolute: string): boolean {
    if (!existsSync(absolute)) {
        return false;
    }
    try {
        return statSync(absolute).isDirectory();
    } catch (error) {
        if (isFilesystemRefusal(error)) {
            return false;
        }
        throw error;
    }
};

const unresolved = function unresolved(key: string, data: ArtifactRootData, reason: string): ArtifactRoot {
    return { binding: data.binding, field: data.field.join("."), key, path: "", unresolved: reason };
};

const parsedBinding = function parsedBinding(absolute: string): { parsed: unknown; error: string | null } {
    try {
        return { error: null, parsed: JSON.parse(readFileSync(absolute, "utf8")) };
    } catch (error) {
        return { error: String(error), parsed: null };
    }
};

const boundRoot = function boundRoot(
    repoRoot: string,
    key: string,
    entry: ArtifactRootData,
): { path: string; refused: ArtifactRoot | null } {
    const bindingAbs = resolve(repoRoot, entry.binding);
    if (!existsSync(bindingAbs)) {
        return { path: "", refused: unresolved(key, entry, `binding file ${entry.binding} does not exist`) };
    }

    const { error, parsed } = parsedBinding(bindingAbs);
    if (error !== null) {
        return {
            path: "",
            refused: unresolved(key, entry, `binding file ${entry.binding} is not valid JSON: ${error}`),
        };
    }

    const bound = readField(parsed, entry.field);
    if (bound === null) {
        return {
            path: "",
            refused: unresolved(key, entry, `field ${entry.field.join(".")} is absent or not a string`),
        };
    }

    const boundRel = toPosix(repoRoot, resolve(repoRoot, bound));
    const outside = boundRel.startsWith("..");
    const reason = `${entry.field.join(".")} resolves to ${bound}, outside the repository`;
    return { path: boundRel, refused: outside ? unresolved(key, entry, reason) : null };
};

export const resolveArtifactRoots = function resolveArtifactRoots(
    repoRoot: string,
    data: TaxonomyData,
): ArtifactRoot[] {
    return Object.entries(data.artifactRoots).flatMap(([key, entry]) => {
        const bound = boundRoot(repoRoot, key, entry);
        if (bound.refused !== null) {
            return [bound.refused];
        }

        return entry.subtrees.map((subtree) => {
            const path = bound.path.length === 0 ? subtree : `${bound.path}/${subtree}`;
            return isDirectory(resolve(repoRoot, path))
                ? { binding: entry.binding, field: entry.field.join("."), key, path, unresolved: null }
                : unresolved(key, entry, `subtree ${path} does not exist`);
        });
    });
};
