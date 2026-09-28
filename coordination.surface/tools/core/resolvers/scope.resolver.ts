import { AUTHORED_ROOTS, BINARY_EXTENSIONS } from "../constants/path.constants.ts";
import { existsSync, readdirSync } from "node:fs";

import { surfacePrefix, surfaceRoot } from "../../../config/surface.config.ts";
import { toPosix, walk } from "../iterators/file.iterator.ts";
import type { ScopeSets } from "../types/scope.types.ts";
import type { TaxonomyData } from "../types/taxonomy.types.ts";
import { resolve } from "node:path";
import { resolveArtifactRoots } from "./artifact.resolver.ts";

const collect = function collect(repoRoot: string, roots: readonly string[], ignored: readonly string[]): string[] {
    const out: string[] = [];

    for (const root of roots) {
        const absolute = resolve(repoRoot, root);
        const options = { excluded: BINARY_EXTENSIONS, extensions: [], ignored, root: absolute };
        for (const file of walk(options)) {
            out.push(toPosix(repoRoot, file));
        }
    }

    return out;
};

const rootDocuments = function rootDocuments(ignored: readonly string[]): string[] {
    const own = surfaceRoot();
    const prefix = surfacePrefix();

    return readdirSync(own, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => (prefix.length === 0 ? entry.name : `${prefix}/${entry.name}`))
        .filter((name) => !ignored.includes(name.slice(name.lastIndexOf("/") + 1)))
        .filter((name) => {
            for (const extension of BINARY_EXTENSIONS) {
                if (name.endsWith(extension)) {
                    return false;
                }
            }
            return true;
        })
        .toSorted((left, right) => left.localeCompare(right));
};

export const resolveScope = function resolveScope(
    repoRoot: string,
    taxonomy: TaxonomyData,
    scope: string | null,
): ScopeSets {
    const namingRoots = [
        ...new Set([
            ...Object.keys(taxonomy.containers),
            ...Object.keys(taxonomy.specialContainers),
            ...Object.keys(taxonomy.corpusRoots),
        ]),
    ];

    const artifactRoots = resolveArtifactRoots(repoRoot, taxonomy);
    const artifactPaths = artifactRoots.filter((root) => root.unresolved === null).map((root) => root.path);

    const authored = AUTHORED_ROOTS.filter((root) => existsSync(resolve(repoRoot, root)));

    const within = scope === null ? null : new Set(collect(repoRoot, [scope], taxonomy.ignored));
    const narrow = (paths: readonly string[]): string[] =>
        within === null ? [...paths] : paths.filter((path) => within.has(path));

    const once = (paths: readonly string[]): string[] => [...new Set(narrow(paths))];

    const taxonomyPaths = once(collect(repoRoot, namingRoots, taxonomy.ignored));
    const artifact = once(collect(repoRoot, artifactPaths, taxonomy.ignored));
    const roots = once(rootDocuments(taxonomy.ignored));
    const tools = once(collect(repoRoot, authored, taxonomy.ignored));

    const all = [...new Set([...taxonomyPaths, ...artifact, ...roots, ...tools])];

    return { all, byJurisdiction: { all, artifact, taxonomy: taxonomyPaths } };
};
