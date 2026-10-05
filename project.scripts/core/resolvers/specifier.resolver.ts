import {
    PARENT_SEGMENT,
    RELATIVE_MARK,
    SELF_IMPORT_MARK,
    SOURCE_EXTENSION,
    WILDCARD,
} from "#configuration/constants/closure.constants";
import { dirname, relative, resolve } from "node:path";
import { exportPatternsOf, stringAt, stringRecordAt } from "#core/selectors/manifest.selector";
import { normalizePath } from "@ssot/govlab/shared/resolvers/anchor.resolver.ts";

const SEPARATOR = "/";
const HERE = "./";
const UP = "../";
const WILD_SEGMENT = `${SEPARATOR}${WILDCARD}`;
const WILD_FILE = `${WILD_SEGMENT}${SOURCE_EXTENSION}`;

export const selfImportTargets = function selfImportTargets(manifest: unknown): ReadonlyMap<string, string> {
    return new Map(
        Object.entries(stringRecordAt(manifest, "imports")).map(([key, target]) => [
            key.replace(WILD_SEGMENT, ""),
            target.replace(WILD_FILE, "").replace(HERE, ""),
        ]),
    );
};

export const relativeSpecifier = function relativeSpecifier(fromDir: string, target: string): string {
    if (fromDir === "") {
        return `${HERE}${target}`;
    }
    const from = fromDir.split(SEPARATOR);
    const to = target.split(SEPARATOR);
    let shared = 0;
    while (shared < from.length && shared < to.length && from[shared] === to[shared]) {
        shared += 1;
    }
    const up = from.length - shared;
    return `${up === 0 ? HERE : UP.repeat(up)}${to.slice(shared).join(SEPARATOR)}`;
};

export const resolveSelfImport = function resolveSelfImport(
    targets: ReadonlyMap<string, string>,
    specifier: string,
    relPath: string,
): string {
    if (!specifier.startsWith(SELF_IMPORT_MARK)) {
        return specifier;
    }
    const slash = specifier.indexOf(SEPARATOR);
    const target = targets.get(slash === -1 ? specifier : specifier.slice(0, slash));
    if (target === undefined) {
        return specifier;
    }
    const tail = slash === -1 ? "" : specifier.slice(slash + 1);
    const cut = relPath.lastIndexOf(SEPARATOR);
    return relativeSpecifier(
        cut === -1 ? "" : relPath.slice(0, cut),
        `${target}${SEPARATOR}${tail}${SOURCE_EXTENSION}`,
    );
};

const exportTargetOf = function exportTargetOf(
    patterns: readonly (readonly [string, string])[],
    subpath: string,
): string {
    const match = patterns.find(([prefix]) => subpath.startsWith(prefix));
    return match === undefined ? subpath : match[1].replace(WILDCARD, subpath.slice(match[0].length));
};

const anchorPackageSpecifier = function anchorPackageSpecifier(manifest: unknown, specifier: string): string {
    const name = stringAt(manifest, "name");
    const main = stringAt(manifest, "main");
    if (name === "") {
        return specifier;
    }
    if (specifier === name && main === "") {
        return specifier;
    }
    if (specifier === name) {
        return main.startsWith(HERE) ? main : `${HERE}${main}`;
    }
    const scoped = `${name}${SEPARATOR}`;
    return specifier.startsWith(scoped)
        ? exportTargetOf(exportPatternsOf(manifest), `${HERE}${specifier.slice(scoped.length)}`)
        : specifier;
};

const anchorSelfImport = function anchorSelfImport(
    root: string,
    manifest: unknown,
    filePath: string,
    specifier: string,
): string | null {
    const relPath = normalizePath(relative(root, filePath));
    if (relPath.startsWith(PARENT_SEGMENT)) {
        return null;
    }
    const resolved = resolveSelfImport(selfImportTargets(manifest), specifier, relPath);
    return resolved === specifier ? null : resolved;
};

export const anchorSpecifier = function anchorSpecifier(
    root: string,
    manifest: unknown,
    filePath: string,
    specifier: string,
): string {
    if (specifier.startsWith(SELF_IMPORT_MARK)) {
        const relativeTarget = anchorSelfImport(root, manifest, filePath, specifier);
        return relativeTarget === null ? specifier : anchorSpecifier(root, manifest, filePath, relativeTarget);
    }
    if (!specifier.startsWith(RELATIVE_MARK)) {
        return anchorPackageSpecifier(manifest, specifier);
    }
    const absolute = resolve(dirname(filePath), specifier);
    const target = normalizePath(relative(root, absolute));
    return target.startsWith(PARENT_SEGMENT) ? specifier : `${HERE}${target}`;
};
