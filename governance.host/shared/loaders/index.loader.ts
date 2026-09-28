import { RULE_HOST, WORKSPACE_ROOT, labelOf } from "../resolvers/anchor.resolver.ts";
import type { Dirent } from "node:fs";
import { MASTER_EXCLUDE_MARKERS } from "../generated/exclusions.generated.ts";
import type { TreeIndex } from "../../types/location.types.ts";
import { isExcludedPath } from "@govlab/quality/core/matchers/exclusions.matcher.ts";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const ROOT = WORKSPACE_ROOT;

const entriesIn = function entriesIn(dir: string): Dirent[] {
    return readdirSync(dir, { withFileTypes: true });
};

const scanRoots = function scanRoots(): string[] {
    return entriesIn(ROOT)
        .filter((entry) => entry.isDirectory() && !isExcludedPath(entry.name, MASTER_EXCLUDE_MARKERS))
        .map((entry) => entry.name);
};

const walk = function walk(rel: string): string[] {
    return entriesIn(join(ROOT, rel))
        .filter((e) => !(e.isDirectory() && isExcludedPath(`${rel}/${e.name}`, MASTER_EXCLUDE_MARKERS)))
        .flatMap((e) => {
            const child = `${rel}/${e.name}`;
            return e.isDirectory() ? [`${child}/`, ...walk(child)] : [child];
        });
};

const topLevelOf = function topLevelOf(dir: string): string[] {
    return entriesIn(dir).map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
};

const ruleHostPaths = function ruleHostPaths(): string[] {
    const out: string[] = [];
    for (const e of entriesIn(RULE_HOST)) {
        if (!e.isFile()) {
            continue;
        }
        out.push(`ruleHost/${e.name}`);
        if (e.name.endsWith(".ts")) {
            out.push(`local/${labelOf(e.name.slice(0, -3))}`);
        }
    }
    return out;
};

export const buildTreeIndex = function buildTreeIndex(): TreeIndex {
    const paths = [...topLevelOf(ROOT), ...scanRoots().flatMap(walk), ...ruleHostPaths()];
    const basenames = new Set<string>();
    for (const p of paths) {
        const trimmed = p.endsWith("/") ? p.slice(0, -1) : p;
        basenames.add(trimmed.slice(trimmed.lastIndexOf("/") + 1));
    }
    return { basenames, paths };
};

export const resolvesAgainst = function resolvesAgainst(index: TreeIndex, value: string): boolean {
    if (!value.includes("/")) {
        return index.basenames.has(value);
    }
    const needle = value.startsWith("/") ? value : `/${value}`;
    for (const p of index.paths) {
        if (p === value) {
            return true;
        }
        if (p.startsWith(value)) {
            return true;
        }
        if (`/${p}`.includes(needle)) {
            return true;
        }
    }
    return false;
};
