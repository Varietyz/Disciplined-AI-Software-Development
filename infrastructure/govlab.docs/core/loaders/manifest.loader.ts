import { DEFAULT_ECOSYSTEM, ECOSYSTEM_MARKERS } from "#configuration/constants/manifest.constants";
import type { DiscoverOptions, ManifestModule } from "#types/manifest.types";
import { MANIFEST_FILE, PACKAGE_FILE } from "#configuration/constants/document.constants";
import type { Manifest, PackageJson } from "#types/readme.types";
import { basename, join, relative, resolve, sep } from "node:path";
import { isPlainRecord, isRecord } from "#core/predicates/record.predicate";
import { readDirSafe, readJsonSafe } from "#core/loaders/base.loader";
import { ROOT } from "@ssot/paths";
import { excludeMatcher } from "@govlab/quality/config";
import { existsSync } from "node:fs";
import { expandGlob } from "#core/matchers/segment.matcher";

const isExcluded = await excludeMatcher(ROOT);
const DEFAULT_DOT_ALLOW: ReadonlySet<string> = new Set<string>();
const ROOT_REL = ".";
const ENTRIES_KEY = "entries";

const isDocsManifest = function isDocsManifest(manifest: Manifest): boolean {
    return (
        typeof manifest["label"] === "string" &&
        typeof manifest["maturity"] === "string" &&
        isRecord(manifest["visibility"])
    );
};

const recordAt = function recordAt(path: string): Manifest | null {
    const parsed = readJsonSafe(path);
    return isPlainRecord(parsed) ? parsed : null;
};

export const readManifest = function readManifest(moduleDir: string): Manifest {
    return recordAt(resolve(moduleDir, MANIFEST_FILE)) ?? {};
};

const isTextEntry = function isTextEntry(entry: [string, unknown]): entry is [string, string] {
    return typeof entry[1] === "string";
};

export const readPackageJson = function readPackageJson(moduleDir: string): PackageJson {
    const record = recordAt(resolve(moduleDir, PACKAGE_FILE)) ?? {};
    const { dependencies, exports, main, name, types } = record;
    return {
        ...(typeof name === "string" ? { name } : {}),
        ...(typeof main === "string" ? { main } : {}),
        ...(typeof types === "string" ? { types } : {}),
        ...(exports === undefined ? {} : { exports }),
        ...(isPlainRecord(dependencies)
            ? { dependencies: Object.fromEntries(Object.entries(dependencies).filter(isTextEntry)) }
            : {}),
    };
};

const moduleAt = function moduleAt(
    rootAbs: string,
    dir: string,
    isShaped: (manifest: Manifest) => boolean,
): ManifestModule | null {
    const manifest = recordAt(join(dir, MANIFEST_FILE));
    if (manifest === null || !isShaped(manifest)) {
        return null;
    }
    const rel = relative(rootAbs, dir);
    const parts = rel.length > 0 ? rel.split(sep) : [];
    return {
        dir,
        group: parts[0] ?? basename(dir),
        label: parts.length > 0 ? parts.join("/") : basename(dir),
        manifest,
        pkg: recordAt(join(dir, PACKAGE_FILE)) ?? {},
        relPath: parts.length > 0 ? parts.join("/") : ROOT_REL,
        slug: basename(dir),
    };
};

export const discoverManifests = function discoverManifests(
    root: string,
    options: DiscoverOptions = {},
): ManifestModule[] {
    const allowDot = options.allowDot ?? DEFAULT_DOT_ALLOW;
    const isShaped = options.isShaped ?? isDocsManifest;
    const rootAbs = resolve(root);
    const modules: ManifestModule[] = [];
    const walk = (dir: string): void => {
        const module = moduleAt(rootAbs, dir, isShaped);
        if (module !== null) {
            modules.push(module);
        }
        for (const entry of readDirSafe(dir)) {
            const child = join(dir, entry.name);
            if (entry.isDirectory() && (!isExcluded(child) || allowDot.has(entry.name))) {
                walk(child);
            }
        }
    };
    walk(rootAbs);
    return modules.toSorted((left, right) => left.slug.localeCompare(right.slug));
};

const ecosystemOf = function ecosystemOf(dir: string): string {
    const marker = ECOSYSTEM_MARKERS.find(([file]) => existsSync(join(dir, file)));
    return marker === undefined ? DEFAULT_ECOSYSTEM : marker[1];
};

export const discoverModules = function discoverModules(): ManifestModule[] {
    return discoverManifests(ROOT).map((module) => ({ ...module, ecosystemHint: ecosystemOf(module.dir) }));
};

export const declaredEntries = function declaredEntries(moduleDir: string): string[] | null {
    const manifest = recordAt(join(moduleDir, MANIFEST_FILE));
    const entries = manifest === null ? undefined : manifest[ENTRIES_KEY];
    return Array.isArray(entries) ? entries.filter((entry): entry is string => typeof entry === "string") : null;
};

export const manifestBarrels = function manifestBarrels(moduleDir: string): string[] {
    return (declaredEntries(moduleDir) ?? []).flatMap((pattern) => expandGlob(moduleDir, pattern.split("/")));
};

export const unresolvedEntryPatterns = function unresolvedEntryPatterns(moduleDir: string): string[] {
    return (declaredEntries(moduleDir) ?? []).filter(
        (pattern) => expandGlob(moduleDir, pattern.split("/")).length === 0,
    );
};
