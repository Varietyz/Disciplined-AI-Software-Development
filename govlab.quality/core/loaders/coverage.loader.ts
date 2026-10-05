import { dirOf, forwardSlashed } from "#core/converters/filename.converter";
import { readFileSafe, safeReaddir } from "#core/loaders/source.loader";
import { findPackageRoot } from "#core/resolvers/package.resolver";
import fs from "node:fs";
import { packageNameIndex } from "#core/loaders/package.loader";
import path from "node:path";
import { specifiersIn } from "#core/parsers/specifier.parser";

const UNTRAVERSED = new Set(["node_modules", ".git"]);
const TEST_MARKER = ".test.";
const PACKAGE_INDEX_CACHE = new Map<string, Map<string, string>>();
const CENTRAL_INDEX_CACHE = new Map<string, Map<string, string>>();
const NO_PACKAGE_NAMES = new Map<string, string>();

const collectTests = function collectTests(dir: string): string[] {
    const found: string[] = [];
    for (const entry of safeReaddir(dir)) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!UNTRAVERSED.has(entry.name)) {
                found.push(...collectTests(full));
            }
            continue;
        }
        if (entry.name.includes(TEST_MARKER)) {
            found.push(full);
        }
    }
    return found;
};

const packageTarget = function packageTarget(specifier: string, name: string, dir: string): string | null {
    if (specifier === name) {
        return dir;
    }
    if (!specifier.startsWith(`${name}/`)) {
        return null;
    }
    const subpath = forwardSlashed(path.join(dir, specifier.slice(name.length + 1)));
    return findPackageRoot(dirOf(subpath)) ?? dir;
};

const targetsOf = function targetsOf(file: string, text: string, byName: Map<string, string>): Set<string> {
    const targets = new Set<string>();
    for (const specifier of specifiersIn(text)) {
        if (specifier.startsWith(".")) {
            const resolved = forwardSlashed(path.resolve(dirOf(file), specifier));
            const pkg = findPackageRoot(dirOf(resolved));
            if (pkg !== null) {
                targets.add(pkg);
            }
            continue;
        }
        for (const [name, dir] of byName) {
            const target = packageTarget(specifier, name, dir);
            if (target !== null) {
                targets.add(target);
            }
        }
    }
    return targets;
};

const ownersOf = function ownersOf(file: string, text: string): Set<string> {
    const own = findPackageRoot(dirOf(file));
    return new Set([...(own === null ? [] : [own]), ...targetsOf(file, text, NO_PACKAGE_NAMES)]);
};

const appendText = function appendText(index: Map<string, string>, pkg: string, text: string): void {
    index.set(pkg, `${index.get(pkg) ?? ""}\n${text}`);
};

export const packageIndexFor = function packageIndexFor(rootAbs: string): Map<string, string> {
    const cached = PACKAGE_INDEX_CACHE.get(rootAbs);
    if (cached) {
        return cached;
    }
    const byPackage = new Map<string, string>();
    for (const file of collectTests(rootAbs)) {
        const text = readFileSafe(file);
        for (const pkg of ownersOf(forwardSlashed(file), text)) {
            appendText(byPackage, pkg, text);
        }
    }
    PACKAGE_INDEX_CACHE.set(rootAbs, byPackage);
    return byPackage;
};

export const centralIndexFor = function centralIndexFor(testRootAbs: string, rootAbs: string): Map<string, string> {
    const key = `${testRootAbs}|${rootAbs}`;
    const cached = CENTRAL_INDEX_CACHE.get(key);
    if (cached) {
        return cached;
    }
    const byPackage = new Map<string, string>();
    if (fs.existsSync(testRootAbs)) {
        const byName = packageNameIndex(rootAbs);
        for (const file of collectTests(testRootAbs)) {
            const text = readFileSafe(file);
            for (const target of targetsOf(forwardSlashed(file), text, byName)) {
                appendText(byPackage, target, text);
            }
        }
    }
    CENTRAL_INDEX_CACHE.set(key, byPackage);
    return byPackage;
};
