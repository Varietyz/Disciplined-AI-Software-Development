import { relative, resolve } from "node:path";
import { ROOT } from "@ssot/paths";
import { existsSync } from "node:fs";
import { isRelativeTarget } from "#core/predicates/reference.predicate";

const PARENT_PREFIX = "..";

const posix = function posix(file: string): string {
    return file.split("\\").join("/");
};

export const relFromModules = function relFromModules(file: string): string {
    const rel = relative(ROOT, file);
    return rel.startsWith(PARENT_PREFIX) ? posix(file) : posix(rel);
};

export const resolveTargetFile = function resolveTargetFile(
    file: string,
    moduleDir: string,
    consumerRoot: string,
): string | null {
    if (isRelativeTarget(file)) {
        const rel = resolve(moduleDir, file);
        return existsSync(rel) ? rel : null;
    }
    const fromRoot = resolve(consumerRoot, file);
    if (existsSync(fromRoot)) {
        return fromRoot;
    }
    const fromModule = resolve(moduleDir, file);
    return existsSync(fromModule) ? fromModule : null;
};

export const targetExists = function targetExists(target: string, moduleDir: string, consumerRoot: string): boolean {
    return resolveTargetFile(target, moduleDir, consumerRoot) !== null;
};
