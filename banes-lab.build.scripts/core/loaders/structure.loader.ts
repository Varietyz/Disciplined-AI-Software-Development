import type { DiskFile, DiskFolder, TreeScope } from "#types/structure.types";
import { isConcernFolder, isDeclaredContainer, rootFor } from "@ssot/govlab/shared/manifests/taxonomy.manifest.ts";
import { isGeneratedHead, isGeneratedPath } from "@govlab/stats/core/predicates/source.predicate.ts";
import { readFileSync, readdirSync, statSync } from "node:fs";
import type { ExclusionReason } from "@ssot/secrets";
import type { FolderRole } from "@banes-lab/web/types/anatomy.types.js";
import { countLines } from "@govlab/stats/core/analyzers/text.analyzer.ts";
import { join } from "node:path";

const PATH_SEPARATOR = "/";
const HIDDEN_MARK = ".";
const UTF8 = "utf8";
const ROLE_MEMBER: FolderRole = "member";
const ROLE_CONTAINER: FolderRole = "container";
const ROLE_SUBJECT: FolderRole = "subject";
const ROLE_CONCERN: FolderRole = "concern";

const byName = function byName(a: { name: string }, b: { name: string }): number {
    return a.name.localeCompare(b.name);
};

const joinPath = function joinPath(parent: string, name: string): string {
    return parent === "" ? name : parent + PATH_SEPARATOR + name;
};

export const readDiskFile = function readDiskFile(
    absolute: string,
    path: string,
    name: string,
    inherited = false,
): DiskFile {
    const text = readFileSync(absolute, UTF8);
    const generated = isGeneratedPath(absolute, path) || isGeneratedHead(text);
    const bytes = statSync(absolute).size;
    return { bytes, generated, inherited, lines: countLines(text), name, path, text };
};

const excludedFile = function excludedFile(
    absolute: string,
    path: string,
    name: string,
    reason: ExclusionReason,
): DiskFile {
    const bytes = statSync(absolute).size;
    return { bytes, excluded: reason, generated: false, inherited: false, lines: countLines(""), name, path, text: "" };
};

const fileOf = function fileOf(scope: TreeScope, absolute: string, path: string, name: string): DiskFile {
    const reason = scope.excluded(absolute);
    return reason === null ? readDiskFile(absolute, path, name) : excludedFile(absolute, path, name, reason);
};

const isHidden = function isHidden(scope: TreeScope, path: string, name: string): boolean {
    return name.startsWith(HIDDEN_MARK) && !(path === "" && scope.shipped.has(name));
};

const governingRoot = function governingRoot(scope: TreeScope, path: string): string {
    const full = path === "" ? scope.root : scope.root + PATH_SEPARATOR + path;
    return rootFor(full + PATH_SEPARATOR) ?? scope.root;
};

const roleOf = function roleOf(scope: TreeScope, path: string, name: string): FolderRole {
    if (path === "") {
        return ROLE_MEMBER;
    }
    const root = governingRoot(scope, path);
    const full = scope.root + PATH_SEPARATOR + path;
    const below = full === root ? "" : full.slice(root.length + 1);
    if (!below.includes(PATH_SEPARATOR)) {
        return below === "" || isDeclaredContainer(root, name) ? ROLE_CONTAINER : ROLE_SUBJECT;
    }
    return isConcernFolder(name, root) ? ROLE_CONCERN : ROLE_SUBJECT;
};

export const readTree = function readTree(scope: TreeScope, path = "", name = ""): DiskFolder {
    const absolute = path === "" ? scope.moduleDir : join(scope.moduleDir, ...path.split(PATH_SEPARATOR));
    const entries = readdirSync(absolute, { withFileTypes: true }).filter(
        (entry) =>
            !(entry.isDirectory() && scope.pruned(join(absolute, entry.name))) && !isHidden(scope, path, entry.name),
    );
    const folders = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => readTree(scope, joinPath(path, entry.name), entry.name))
        .sort(byName);
    const files = entries
        .filter((entry) => entry.isFile())
        .map((entry) => fileOf(scope, join(absolute, entry.name), joinPath(path, entry.name), entry.name))
        .sort(byName);
    return { files, folders, governedBy: governingRoot(scope, path), name, path, role: roleOf(scope, path, name) };
};
