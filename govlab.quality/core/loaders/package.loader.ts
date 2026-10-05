import { readJsonField, safeReaddir } from "#core/loaders/source.loader";
import { forwardSlashed } from "#core/converters/filename.converter";
import fs from "node:fs";
import path from "node:path";

const PACKAGE_MANIFEST = "package.json";

const nameOfPackage = function nameOfPackage(dir: string): string {
    const manifest = path.join(dir, PACKAGE_MANIFEST);
    if (!fs.existsSync(manifest)) {
        return "";
    }
    const name = readJsonField(manifest, "name");
    return typeof name === "string" ? name : "";
};

const expandWorkspace = function expandWorkspace(rootAbs: string, pattern: string): string[] {
    const star = pattern.indexOf("*");
    if (star === -1) {
        return [forwardSlashed(path.join(rootAbs, pattern))];
    }
    const cut = pattern.lastIndexOf("/", star);
    const base = path.join(rootAbs, pattern.slice(0, cut));
    const prefix = pattern.slice(cut + 1, star);
    return safeReaddir(base)
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
        .map((entry) => forwardSlashed(path.join(base, entry.name)));
};

const workspacePatterns = function workspacePatterns(rootAbs: string): string[] {
    const declared = readJsonField(path.join(rootAbs, PACKAGE_MANIFEST), "workspaces");
    return Array.isArray(declared) ? declared.filter((value): value is string => typeof value === "string") : [];
};

export const workspaceDirs = function workspaceDirs(rootAbs: string): string[] {
    return workspacePatterns(rootAbs)
        .flatMap((pattern) => expandWorkspace(rootAbs, pattern))
        .filter((dir) => fs.existsSync(path.join(dir, PACKAGE_MANIFEST)));
};

export const dependentWorkspaces = function dependentWorkspaces(rootAbs: string, packageDir: string): string[] {
    const name = nameOfPackage(packageDir);
    const own = forwardSlashed(path.resolve(packageDir));
    return workspaceDirs(rootAbs).filter((dir) => {
        if (name.length === 0 || forwardSlashed(path.resolve(dir)) === own) {
            return false;
        }
        const dependencies = readJsonField(path.join(dir, PACKAGE_MANIFEST), "dependencies");
        return typeof dependencies === "object" && dependencies !== null && name in dependencies;
    });
};

export const packageNameIndex = function packageNameIndex(rootAbs: string): Map<string, string> {
    const byName = new Map<string, string>();
    for (const dir of workspaceDirs(rootAbs)) {
        const name = nameOfPackage(dir);
        if (name.length > 0) {
            byName.set(name, dir);
        }
    }
    return byName;
};
