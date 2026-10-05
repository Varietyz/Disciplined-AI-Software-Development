import type { DiskFile, DiskFolder } from "#types/structure.types";
import { basename, dirname, isAbsolute, resolve } from "node:path";
import { existsSync } from "node:fs";
import { isRecord } from "#core/selectors/base.selector";
import { readDiskFile } from "#core/loaders/structure.loader";

const EXTENDS_KEY = "extends";
const RELATIVE_MARK = ".";

const extendsOf = function extendsOf(text: string): string | null {
    const parsed: unknown = JSON.parse(text);
    const target = isRecord(parsed) ? parsed[EXTENDS_KEY] : null;
    return typeof target === "string" ? target : null;
};

const isInside = function isInside(dir: string, file: string): boolean {
    return file.startsWith(dir);
};

const chainFrom = function chainFrom(moduleDir: string, from: string, text: string, seen: Set<string>): DiskFile[] {
    const target = extendsOf(text) ?? "";
    if (!target.startsWith(RELATIVE_MARK)) {
        return [];
    }
    const absolute = isAbsolute(target) ? target : resolve(dirname(from), target);
    if (seen.has(absolute) || !existsSync(absolute) || isInside(moduleDir, absolute)) {
        return [];
    }
    seen.add(absolute);
    const name = basename(absolute);
    const next = readDiskFile(absolute, name, name, true);
    return [next, ...chainFrom(moduleDir, absolute, next.text, seen)];
};

const JSON_SUFFIX = ".json";

const isConfigFile = function isConfigFile(file: DiskFile): boolean {
    return file.name.endsWith(JSON_SUFFIX);
};

export const inheritedFiles = function inheritedFiles(moduleDir: string, tree: DiskFolder): DiskFile[] {
    const seen = new Set<string>();
    return tree.files
        .filter(isConfigFile)
        .flatMap((file) => chainFrom(moduleDir, resolve(moduleDir, file.path), file.text, seen));
};

export const withInherited = function withInherited(moduleDir: string, tree: DiskFolder): DiskFolder {
    const inherited = inheritedFiles(moduleDir, tree);
    return inherited.length === 0 ? tree : { ...tree, files: [...tree.files, ...inherited] };
};
