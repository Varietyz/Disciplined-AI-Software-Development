import { isRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { readDirSafe } from "#core/loaders/base.loader";

const MODULE_SUFFIXES: readonly string[] = [".ts", ".mts", ".cts", ".mjs", ".js", ".cjs"];
const DECLARATION_SUFFIX = ".d.ts";

const isModuleFile = function isModuleFile(name: string): boolean {
    return !name.endsWith(DECLARATION_SUFFIX) && MODULE_SUFFIXES.some((suffix) => name.endsWith(suffix));
};

const importModule = async function importModule(file: string): Promise<unknown> {
    return import(pathToFileURL(file).href);
};

export const loadExports = async function loadExports<T>(
    dir: string,
    key: string,
    guard: (value: unknown) => value is T,
): Promise<T[]> {
    const files = readDirSafe(dir)
        .filter((entry) => entry.isFile() && isModuleFile(entry.name))
        .map((entry) => join(dir, entry.name))
        .toSorted((left, right) => left.localeCompare(right));
    const modules = await Promise.all(files.map(importModule));
    return modules.flatMap((module): T[] => {
        const candidate = isRecord(module) ? module[key] : null;
        return guard(candidate) ? [candidate] : [];
    });
};
