import { MANIFEST_FILE, PACKAGE_FILE } from "#configuration/constants/document.constants";
import { readDirSafe, readJsonSafe } from "#core/loaders/base.loader";
import { existsSync } from "node:fs";
import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";

const WILDCARD = "*";
const SEPARATOR = "/";
const WORKSPACES_KEY = "workspaces";

const declaredGlobs = function declaredGlobs(root: string): string[] {
    const manifest = readJsonSafe(join(root, PACKAGE_FILE));
    const globs = isRecord(manifest) ? manifest[WORKSPACES_KEY] : undefined;
    return Array.isArray(globs) ? globs.filter((glob): glob is string => typeof glob === "string") : [];
};

const expandWorkspace = function expandWorkspace(root: string, pattern: string): string[] {
    if (!pattern.includes(WILDCARD)) {
        return [pattern];
    }
    const cut = pattern.lastIndexOf(SEPARATOR);
    const parent = cut === -1 ? "" : pattern.slice(0, cut);
    const leaf = pattern.slice(cut + 1);
    const prefix = leaf.slice(0, leaf.indexOf(WILDCARD));
    const parentDir = parent === "" ? root : join(root, ...parent.split(SEPARATOR));
    return readDirSafe(parentDir)
        .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
        .map((entry) => (parent === "" ? entry.name : `${parent}${SEPARATOR}${entry.name}`));
};

const memberFile = function memberFile(root: string, dir: string, file: string): string {
    return join(root, ...dir.split(SEPARATOR), file);
};

export const workspaceMembers = function workspaceMembers(root: string): string[] {
    return declaredGlobs(root)
        .flatMap((pattern) => expandWorkspace(root, pattern))
        .filter((dir) => existsSync(memberFile(root, dir, PACKAGE_FILE)))
        .toSorted((left, right) => left.localeCompare(right));
};

export const membersWithoutManifest = function membersWithoutManifest(root: string): string[] {
    return workspaceMembers(root).filter((dir) => !existsSync(memberFile(root, dir, MANIFEST_FILE)));
};
