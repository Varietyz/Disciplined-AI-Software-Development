import { excludedTrees, isGeneratedFolder, isIgnoredName, vocabularyFor } from "../manifests/taxonomy.manifest.ts";
import { readdirSync, statSync } from "node:fs";
import type { TaxonomyFinding } from "../../types/taxonomy.types.ts";
import { WORKSPACE_ROOT } from "../resolvers/anchor.resolver.ts";
import { generatedFolderFindings } from "./taxonomy.tree.analyzer.ts";
import { join } from "node:path";
import { taxonomyRoots } from "../manifests/taxonomy.root.manifest.ts";

const PATH_SEPARATOR = "/";

const joined = function joined(relDir: string, name: string): string {
    return relDir === "" ? name : `${relDir}${PATH_SEPARATOR}${name}`;
};

const isDirectory = function isDirectory(path: string): boolean {
    return statSync(join(WORKSPACE_ROOT, path)).isDirectory();
};

const fileCount = function fileCount(relDir: string): number {
    return readdirSync(join(WORKSPACE_ROOT, relDir))
        .filter((name) => !isIgnoredName(name))
        .reduce((sum, name) => {
            const path = joined(relDir, name);
            return sum + (isDirectory(path) ? fileCount(path) : 1);
        }, 0);
};

const isExemptFile = function isExemptFile(name: string): boolean {
    return isIgnoredName(name) || vocabularyFor().boundaryDocuments.has(name);
};

const fileFinding = function fileFinding(path: string, name: string): TaxonomyFinding[] {
    if (isExemptFile(name)) {
        return [];
    }
    return [{ data: { name }, messageId: "ungovernedFile", path }];
};

const treeFindings = function treeFindings(
    relDir: string,
    roots: readonly string[],
    excluded: ReadonlySet<string>,
): TaxonomyFinding[] {
    return readdirSync(join(WORKSPACE_ROOT, relDir))
        .filter((name) => !isIgnoredName(name))
        .toSorted((a, b) => a.localeCompare(b))
        .flatMap((name): TaxonomyFinding[] => {
            const path = joined(relDir, name);
            if (excluded.has(path) || roots.includes(path)) {
                return [];
            }
            if (!isDirectory(path)) {
                return fileFinding(path, name);
            }
            if (isGeneratedFolder(name)) {
                return generatedFolderFindings(path);
            }
            if (roots.some((root) => root.startsWith(`${path}${PATH_SEPARATOR}`))) {
                return treeFindings(path, roots, excluded);
            }
            const files = fileCount(path);
            return files === 0 ? [] : [{ data: { files: String(files) }, messageId: "ungovernedTree", path }];
        });
};

export const coverageFindings = function coverageFindings(): TaxonomyFinding[] {
    return treeFindings("", taxonomyRoots(), new Set(excludedTrees()));
};
