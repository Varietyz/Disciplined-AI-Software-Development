import { dirOf, forwardSlashed } from "#core/converters/filename.converter";
import { ROOT } from "@ssot/paths/anchor";
import fs from "node:fs";
import path from "node:path";

const PACKAGE_MANIFEST = "package.json";
const PACKAGE_ROOT_CACHE = new Map<string, string | null>();
const NORMALIZED_ROOT = forwardSlashed(ROOT);

const parentDir = function parentDir(dir: string): string | null {
    const slash = dir.lastIndexOf("/");
    if (dir === NORMALIZED_ROOT || slash <= 0) {
        return null;
    }
    return dir.slice(0, slash);
};

export const findPackageRoot = function findPackageRoot(startDir: string): string | null {
    const cached = PACKAGE_ROOT_CACHE.get(startDir);
    if (typeof cached === "string") {
        return cached;
    }
    let dir: string | null = startDir;
    while (dir !== null) {
        if (fs.existsSync(path.join(dir, PACKAGE_MANIFEST))) {
            break;
        }
        dir = parentDir(dir);
    }
    PACKAGE_ROOT_CACHE.set(startDir, dir);
    return dir;
};

export const enclosingPackages = function enclosingPackages(pkg: string): string[] {
    const out: string[] = [];
    let found = findPackageRoot(parentDir(pkg) ?? NORMALIZED_ROOT);
    while (found !== null && found !== NORMALIZED_ROOT) {
        out.push(found);
        found = findPackageRoot(parentDir(found) ?? NORMALIZED_ROOT);
    }
    return out;
};

export const relFromRoot = function relFromRoot(filename: string): string | null {
    if (filename.length === 0) {
        return null;
    }
    const rel = forwardSlashed(path.relative(ROOT, forwardSlashed(filename)));
    return rel.startsWith("..") || rel.length === 0 ? null : rel;
};

export const packageRootOf = function packageRootOf(filename: string): string | null {
    if (relFromRoot(filename) === null) {
        return null;
    }
    const found = findPackageRoot(dirOf(filename));
    return found === null || found === NORMALIZED_ROOT ? null : found;
};

export const packageRelOf = function packageRelOf(filename: string): string | null {
    const root = packageRootOf(filename);
    return root === null ? null : root.slice(NORMALIZED_ROOT.length + 1);
};

export const withinPackage = function withinPackage(filename: string): string | null {
    const root = packageRootOf(filename);
    return root === null ? null : forwardSlashed(filename).slice(root.length + 1);
};
