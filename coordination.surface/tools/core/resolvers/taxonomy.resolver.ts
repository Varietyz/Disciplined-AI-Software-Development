import type { GovernedPath, TaxonomyData } from "../types/taxonomy.types.ts";
import { dirname, resolve } from "node:path";

import { existsSync, readFileSync } from "node:fs";
import { surfacePrefix, surfaceRoot } from "../../../config/surface.config.ts";
import { taxonomy } from "../../../config/taxonomy.config.ts";

const isLetter = function isLetter(char: string): boolean {
    return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
};

const lettersOnly = function lettersOnly(cell: string): boolean {
    for (const char of cell) {
        if (!isLetter(char)) {
            return false;
        }
    }
    return cell.length > 0;
};

const derivedLetters = function derivedLetters(): string[] {
    const source = resolve(surfaceRoot(), taxonomy.derivedVariants.source);
    if (!existsSync(source)) {
        return [];
    }

    const cells = readFileSync(source, "utf8")
        .split("\n")
        .filter((line) => line.startsWith("|"))
        .map((line) => (line.split("|")[1] ?? "").trim())
        .filter(lettersOnly)
        .map((cell) => cell.toLowerCase());
    return [...new Set(cells)];
};

const withinSurface = function withinSurface(
    declared: Readonly<Record<string, readonly string[]>>,
): Record<string, readonly string[]> {
    const prefix = surfacePrefix();
    const out: Record<string, readonly string[]> = {};

    for (const [key, members] of Object.entries(declared)) {
        if (prefix.length === 0) {
            out[key] = members;
            continue;
        }
        out[key === "." ? prefix : `${prefix}/${key}`] = members;
    }

    return out;
};

export const loadTaxonomy = function loadTaxonomy(): TaxonomyData {
    const folderToTag: Record<string, string> = {};
    const folderToLayer: Record<string, string> = {};
    const concernFolders: string[] = [];
    const concernTags: string[] = [];

    for (const entry of taxonomy.concerns) {
        folderToTag[entry.folder] = entry.tag;
        folderToLayer[entry.folder] = entry.layer;
        concernFolders.push(entry.folder);
        concernTags.push(entry.tag);
    }

    return {
        agentLetters: derivedLetters(),
        artifactRoots: taxonomy.artifactRoots,
        boundaryDocuments: taxonomy.boundaryDocuments,
        compoundMarkers: taxonomy.grammar.compoundMarkers,
        concernFolders,
        concernTags,
        containers: withinSurface(taxonomy.containers),
        corpusRoots: taxonomy.corpusRoots,
        folderToLayer,
        folderToTag,
        foreignContainers: withinSurface(taxonomy.foreignContainers),
        foreignGrammar: taxonomy.foreignGrammar,
        ignored: taxonomy.Ignored.foldersFiles,
        maxDepthFromRoot: taxonomy.grammar.maxDepthFromRoot,
        specialContainers: withinSurface(taxonomy.specialContainers),
        subjects: taxonomy.subjects,
        variants: taxonomy.variants,
        verificationMarkers: taxonomy.grammar.verificationMarkers,
    };
};

export const rootOf = function rootOf(path: string, data: TaxonomyData): string | null {
    const roots = [...Object.keys(data.containers), ...Object.keys(data.specialContainers)];
    let best: string | null = null;
    for (const root of roots) {
        const holds = path === root || path.startsWith(`${root}/`);
        if (holds && (best === null || root.length > best.length)) {
            best = root;
        }
    }
    return best;
};

export const governedPath = function governedPath(path: string, data: TaxonomyData): GovernedPath | null {
    const root = rootOf(path, data);
    if (root === null) {
        return null;
    }

    const dir = dirname(path);
    const tail = dir === root ? "" : dir.slice(root.length + 1);
    return { root, segments: tail.length === 0 ? [] : tail.split("/") };
};
