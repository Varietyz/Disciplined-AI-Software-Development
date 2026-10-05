import {
    CURRENT_DIRECTORY,
    DEFAULT_PATHS,
    FALLBACK_PATHS,
    PROFILE_ID_TO_ECOSYSTEM,
} from "#configuration/constants/tool.constants";
import { existsSync, readdirSync } from "node:fs";
import type { DetectedEcosystem } from "#types/quality.types";
import { detectProfiles } from "#core/loaders/ecosystem.loader";
import { isExcludedPath } from "#core/matchers/exclusions.matcher";
import { loadGovlabConfig } from "#core/loaders/config.loader";
import { loadInstallRegistry } from "#core/loaders/dependency.loader";
import { masterExcludeMarkers } from "#core/selectors/exclusions.selector";
import path from "node:path";
import { safeReaddir } from "#core/loaders/source.loader";

const GLOB_STAR_DOT = "*.";
const BRACE_OPEN = ".{";
const BRACE_CLOSE = "}";
const NOT_FOUND = -1;

interface Scan {
    root: string;
    exts: Set<string>;
    exclude: readonly string[];
}

const registryEcosystems = function registryEcosystems(): Set<string> {
    return new Set(loadInstallRegistry().records.map((record) => record.ecosystem));
};

export const detectEcosystems = function detectEcosystems(root: string): DetectedEcosystem[] {
    const known = registryEcosystems();
    const found = new Map<string, DetectedEcosystem>();
    for (const profile of detectProfiles(readdirSync(root))) {
        const ecosystem = PROFILE_ID_TO_ECOSYSTEM[profile.id] ?? profile.id;
        if (known.has(ecosystem) && !found.has(ecosystem)) {
            found.set(ecosystem, { ecosystem, languageId: profile.id });
        }
    }
    return [...found.values()];
};

export const defaultPathsFor = function defaultPathsFor(ecosystem: string): string[] {
    return [...(DEFAULT_PATHS[ecosystem] ?? FALLBACK_PATHS)];
};

export const projectDirWithMarker = function projectDirWithMarker(
    root: string,
    paths: readonly string[],
    marker: string,
): string {
    const found = paths
        .map((target) => (path.isAbsolute(target) ? target : path.join(root, target)))
        .find((abs) => existsSync(path.join(abs, marker)));
    return found ?? root;
};

export const scopeTargets = function scopeTargets(root: string, paths: readonly string[]): string[] {
    return (paths.length > 0 ? paths : [CURRENT_DIRECTORY]).map((target) =>
        path.isAbsolute(target) ? target : path.join(root, target),
    );
};

const globExtensions = function globExtensions(glob: string): string[] {
    const star = glob.lastIndexOf(GLOB_STAR_DOT);
    if (star === NOT_FOUND) {
        return [];
    }
    const tail = glob.slice(star + 1);
    if (tail.startsWith(BRACE_OPEN) && tail.endsWith(BRACE_CLOSE)) {
        return tail
            .slice(BRACE_OPEN.length, -BRACE_CLOSE.length)
            .split(",")
            .map((ext) => `.${ext}`);
    }
    return [tail];
};

const posix = function posix(value: string): string {
    return value.split(path.sep).join("/");
};

const matchesExtension = function matchesExtension(name: string, exts: Set<string>): boolean {
    const dot = name.lastIndexOf(".");
    return dot !== NOT_FOUND && exts.has(name.slice(dot));
};

const walkDir = function walkDir(scan: Scan, dir: string): string[] {
    return safeReaddir(dir).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        const rel = path.relative(scan.root, full);
        if (isExcludedPath(rel, scan.exclude)) {
            return [];
        }
        if (entry.isDirectory()) {
            return walkDir(scan, full);
        }
        return matchesExtension(entry.name, scan.exts) ? [posix(rel)] : [];
    });
};

export const resolveScopedFiles = function resolveScopedFiles(
    root: string,
    globs: string[],
    exclude: readonly string[],
): string[] {
    const exts = new Set(globs.flatMap(globExtensions));
    return exts.size === 0 ? globs : walkDir({ exclude, exts, root }, root);
};

export const scopedFiles = async function scopedFiles(root: string, globs: string[]): Promise<string[]> {
    return resolveScopedFiles(root, globs, masterExcludeMarkers(await loadGovlabConfig(root)));
};
