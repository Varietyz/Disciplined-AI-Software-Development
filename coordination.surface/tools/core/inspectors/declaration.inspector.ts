import {
    BEHAVIOR_TREE_PLACEHOLDER,
    BOOTSTRAP_DOCUMENT,
    PACKAGE_MANIFEST,
    SURFACE_ROOT,
} from "../constants/path.constants.ts";
import { existsSync, readFileSync } from "node:fs";
import { toPosix, walk } from "../iterators/file.iterator.ts";
import type { Finding } from "../types/segment.types.ts";
import type { RuleContext } from "../types/rule.types.ts";
import { leftoverFinding } from "../factories/declaration.factory.ts";
import { resolve } from "node:path";
import { surfacePath } from "../../../config/surface.config.ts";

interface Scanned {
    readonly path: string;
    readonly text: string;
}

const inSurfaceRoot = function inSurfaceRoot(path: string): string {
    return SURFACE_ROOT.length === 0 ? path : `${SURFACE_ROOT}/${path}`;
};

const placeholderSources = function placeholderSources(context: RuleContext): Scanned[] {
    const treeRoot = resolve(context.repoRoot, surfacePath("behavior_tree"));
    const treeFiles = existsSync(treeRoot) ? walk({ extensions: [".md"], ignored: [], root: treeRoot }) : [];
    const manifest = resolve(context.repoRoot, inSurfaceRoot(PACKAGE_MANIFEST));
    const onDisk = [...treeFiles, ...(existsSync(manifest) ? [manifest] : [])].map((absolute) => ({
        path: toPosix(context.repoRoot, absolute),
        text: readFileSync(absolute, "utf8"),
    }));
    const handed = context.paths
        .filter((path) => path.endsWith(".md"))
        .map((path) => ({ path, text: context.read(path) }));
    const seen = new Set(handed.map((entry) => entry.path));
    return [...handed, ...onDisk.filter((entry) => !seen.has(entry.path))].filter(
        (entry) => entry.path !== BOOTSTRAP_DOCUMENT,
    );
};

export const placeholderFindings = function placeholderFindings(context: RuleContext): Finding[] {
    if (existsSync(resolve(context.repoRoot, inSurfaceRoot(BEHAVIOR_TREE_PLACEHOLDER)))) {
        return [];
    }
    return placeholderSources(context)
        .filter((entry) => entry.text.includes(BEHAVIOR_TREE_PLACEHOLDER))
        .map((entry) => leftoverFinding(entry.path));
};
