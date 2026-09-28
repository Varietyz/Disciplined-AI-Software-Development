import { excludedTrees, isGeneratedFolder, isIgnoredName, taxonomyRoots, vocabularyFor } from "../manifests/taxonomy.manifest.ts";
import { readdirSync, statSync } from "node:fs";
import type { TaxonomyFinding } from "../../types/taxonomy.types.ts";
import { WORKSPACE_ROOT } from "../resolvers/anchor.resolver.ts";
import { generatedFolderFindings } from "./taxonomy.tree.analyzer.ts";
import { isTextFile } from "../predicates/text.predicate.ts";
import { join } from "node:path";

const PATH_SEPARATOR = "/";

const joined = function joined(relDir: string, name: string): string {
    return relDir === "" ? name : `${relDir}${PATH_SEPARATOR}${name}`;
};

const isDirectory = function isDirectory(path: string): boolean {
    return statSync(join(WORKSPACE_ROOT, path)).isDirectory();
};

const textFileCount = function textFileCount(relDir: string): number {
    return readdirSync(join(WORKSPACE_ROOT, relDir))
        .filter((name) => !isIgnoredName(name))
        .reduce((sum, name) => {
            const path = joined(relDir, name);
            if (isDirectory(path)) {
                return sum + textFileCount(path);
            }
            return sum + (isTextFile(join(WORKSPACE_ROOT, path)) ? 1 : 0);
        }, 0);
};

const isExemptFile = function isExemptFile(name: string): boolean {
    return isIgnoredName(name) || vocabularyFor().boundaryDocuments.has(name);
};

const fileFinding = function fileFinding(path: string, name: string): TaxonomyFinding[] {
    if (isExemptFile(name) || !isTextFile(join(WORKSPACE_ROOT, path))) {
        return [];
    }
    return [{ data: { name }, messageId: "ungovernedFile", path }];
};

const treeFindings = function treeFindings(relDir: string, roots: readonly string[], excluded: ReadonlySet<string>): TaxonomyFinding[] {
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
            const files = textFileCount(path);
            return files === 0 ? [] : [{ data: { files: String(files) }, messageId: "ungovernedTree", path }];
        });
};

export const coverageFindings = function coverageFindings(): TaxonomyFinding[] {
    return treeFindings("", taxonomyRoots(), new Set(excludedTrees()));
};
