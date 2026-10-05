import type { AxisBarrel, PackageJsonLike } from "#types/code.types";
import { isDirectory, sortedNames } from "#core/loaders/base.loader";
import { existsSync } from "node:fs";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { manifestBarrels } from "#core/loaders/manifest.loader";

const REL_PREFIX = "./";
const DIST_PREFIX = "dist/";
const BUILD_PREFIX = "build/";
const SOURCE_PREFIX = "src/";
const WILDCARD = "*";
const MAIN_AXIS = "main";
const AXIS_NAMES: readonly string[] = ["frontend", "backend"];
const ENTRY_SUBKEYS: readonly string[] = ["types", "import", "module", "default", "require"];
const OUTPUT_PREFIXES: readonly string[] = [DIST_PREFIX, BUILD_PREFIX];
const MAIN_CANDIDATES: readonly string[] = [
    "index.ts",
    "src/index.ts",
    "src/main.ts",
    "src/main.tsx",
    "main.ts",
    "main.tsx",
    "app.ts",
    "src/app.ts",
    "server.ts",
];
const EXT_TO_TS: readonly (readonly [string, string])[] = [
    [".d.ts", ".ts"],
    [".js", ".ts"],
    [".mjs", ".mts"],
    [".cjs", ".cts"],
    [".jsx", ".tsx"],
];
const ENTRY_STEMS: ReadonlySet<string> = new Set([
    "index",
    "main",
    "cli",
    "app",
    "server",
    "run",
    "deploy",
    "start",
    "bin",
    "cmd",
]);
const SOURCE_EXTENSIONS: readonly string[] = [".ts", ".tsx", ".mts", ".cts"];
const DECLARATION_SUFFIX = ".d.ts";

const withoutRelPrefix = function withoutRelPrefix(entry: string): string {
    return entry.startsWith(REL_PREFIX) ? entry.slice(REL_PREFIX.length) : entry;
};

const entryStrings = function entryStrings(value: unknown): string[] {
    if (typeof value === "string") {
        return [value];
    }
    if (!isRecord(value)) {
        return [];
    }
    return ENTRY_SUBKEYS.map((key) => value[key]).filter((entry): entry is string => typeof entry === "string");
};

const exportEntryPaths = function exportEntryPaths(pkg: PackageJsonLike): string[] {
    const targets = isRecord(pkg.exports) ? Object.values(pkg.exports).flatMap(entryStrings) : [];
    const fields = [pkg.module, pkg.main, pkg.types].filter((field): field is string => typeof field === "string");
    return [...targets, ...fields];
};

const rootsFor = function rootsFor(entry: string): string[] {
    const prefix = OUTPUT_PREFIXES.find((candidate) => entry.startsWith(candidate));
    if (prefix === undefined) {
        return [entry];
    }
    const rest = entry.slice(prefix.length);
    return [rest, `${SOURCE_PREFIX}${rest}`];
};

const sourceVariants = function sourceVariants(root: string): string[] {
    return [
        root,
        ...EXT_TO_TS.filter(([extension]) => root.endsWith(extension)).map(
            ([extension, replacement]) => root.slice(0, -extension.length) + replacement,
        ),
    ];
};

const sourceCandidates = function sourceCandidates(entry: string): string[] {
    const candidates = new Set(rootsFor(withoutRelPrefix(entry)).flatMap(sourceVariants));
    return [...candidates].filter((path) => !OUTPUT_PREFIXES.some((prefix) => path.startsWith(prefix)));
};

const firstExisting = function firstExisting(moduleDir: string, relPaths: readonly string[]): string | null {
    for (const rel of relPaths) {
        const path = join(moduleDir, ...rel.split("/"));
        if (existsSync(path)) {
            return path;
        }
    }
    return null;
};

const stemOf = function stemOf(name: string): string {
    const dot = name.lastIndexOf(".");
    return dot === -1 ? name : name.slice(0, dot);
};

const looksLikeEntryFile = function looksLikeEntryFile(name: string): boolean {
    const isSource = SOURCE_EXTENSIONS.some((extension) => name.endsWith(extension));
    return !name.endsWith(DECLARATION_SUFFIX) && isSource && ENTRY_STEMS.has(stemOf(name));
};

const entryFilesIn = function entryFilesIn(dir: string): string[] {
    return sortedNames(dir)
        .filter(looksLikeEntryFile)
        .map((name) => join(dir, name));
};

const wildcardRoot = function wildcardRoot(moduleDir: string, target: string): string | null {
    const rel = withoutRelPrefix(target);
    const literal = rel.slice(0, rel.indexOf(WILDCARD));
    const cut = literal.lastIndexOf("/");
    const dirRel = cut === -1 ? "" : literal.slice(0, cut);
    const dir = dirRel === "" ? moduleDir : join(moduleDir, ...dirRel.split("/"));
    return isDirectory(dir) ? dir : null;
};

const wildcardBarrels = function wildcardBarrels(moduleDir: string, target: string): string[] {
    const root = wildcardRoot(moduleDir, target);
    if (root === null) {
        return [];
    }
    const nested = sortedNames(root)
        .map((name) => join(root, name))
        .filter(isDirectory)
        .flatMap(entryFilesIn);
    return [...entryFilesIn(root), ...nested];
};

const declaredBarrels = function declaredBarrels(moduleDir: string, pkg: PackageJsonLike): string[] {
    const targets = exportEntryPaths(pkg);
    const concrete = targets
        .filter((target) => !target.includes(WILDCARD))
        .map((target) => firstExisting(moduleDir, sourceCandidates(target)))
        .filter((path): path is string => path !== null);
    const expanded = targets
        .filter((target) => target.includes(WILDCARD))
        .flatMap((target) => wildcardBarrels(moduleDir, target));
    return [...concrete, ...expanded];
};

const mainBarrels = function mainBarrels(moduleDir: string, pkg: PackageJsonLike): AxisBarrel[] {
    const declared = [...manifestBarrels(moduleDir), ...declaredBarrels(moduleDir, pkg)];
    if (declared.length > 0) {
        return [...new Set(declared)]
            .toSorted((left, right) => left.localeCompare(right))
            .map((barrel) => ({ axis: MAIN_AXIS, barrel }));
    }
    const fallback = firstExisting(moduleDir, MAIN_CANDIDATES);
    return fallback === null ? [] : [{ axis: MAIN_AXIS, barrel: fallback }];
};

const axisBarrels = function axisBarrels(moduleDir: string, exported: Record<string, unknown>): AxisBarrel[] {
    return AXIS_NAMES.filter((axis) => Object.hasOwn(exported, `${REL_PREFIX}${axis}`)).flatMap((axis) => {
        const barrel = firstExisting(moduleDir, [`${axis}/index.ts`, `${axis}/src/index.ts`]);
        return barrel === null ? [] : [{ axis, barrel }];
    });
};

export const resolveSourceBarrels = function resolveSourceBarrels(
    moduleDir: string,
    pkg: PackageJsonLike,
): AxisBarrel[] {
    const exported = isRecord(pkg.exports) ? pkg.exports : {};
    const dual = axisBarrels(moduleDir, exported);
    return dual.length > 0 ? dual : mainBarrels(moduleDir, pkg);
};
