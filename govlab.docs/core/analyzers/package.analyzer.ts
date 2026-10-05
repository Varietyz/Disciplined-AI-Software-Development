import type { InspectContext, PackageInfo } from "#types/index.types";
import { PACKAGE_FILE, README_FILE } from "#configuration/constants/document.constants";
import { join, relative, sep } from "node:path";
import { readDirSafe, readJsonSafe, readTextSafe } from "#core/loaders/base.loader";
import { PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import { ROOT } from "@ssot/paths";
import { collectSourceStats } from "#core/counters/source.counter";
import { excludeMatcher } from "@govlab/quality/config";
import { existsSync } from "node:fs";
import { exportedNames } from "#core/parsers/export.parser";
import { isPlainRecord } from "#core/predicates/record.predicate";

const BARREL_FILE = "index.ts";
const PURPOSE_HEADING = "## What is it";
const NEXT_HEADING = "\n## ";
const LINE_BREAK = "\n";
const WORD_JOIN = " ";
const POSIX_SEPARATOR = "/";
const DEFAULT_VERSION = "0.0.0";
const isExcluded = await excludeMatcher(ROOT);

const stringOr = function stringOr(value: unknown, fallback: string): string {
    return typeof value === "string" ? value : fallback;
};

const barrelCount = function barrelCount(barrel: string): number {
    return existsSync(barrel) ? exportedNames(barrel).size : 0;
};

const collectBarrelExports = function collectBarrelExports(packageDir: string): number {
    const rootBarrel = join(packageDir, BARREL_FILE);
    if (existsSync(rootBarrel)) {
        return barrelCount(rootBarrel);
    }
    return readDirSafe(packageDir)
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(packageDir, entry.name))
        .filter((dir) => !isExcluded(dir))
        .reduce((total, dir) => total + barrelCount(join(dir, BARREL_FILE)), 0);
};

const extractPurpose = function extractPurpose(readme: string | null): string | null {
    const at = readme === null ? -1 : readme.indexOf(PURPOSE_HEADING);
    if (readme === null || at === -1) {
        return null;
    }
    const after = readme.slice(at + PURPOSE_HEADING.length).trimStart();
    const next = after.indexOf(NEXT_HEADING);
    return (next === -1 ? after : after.slice(0, next))
        .trim()
        .split(LINE_BREAK)
        .filter((line) => line.trim().length > 0)
        .join(WORD_JOIN);
};

const scopedDeps = function scopedDeps(dependencies: Readonly<Record<string, unknown>>, wantScoped: boolean): string[] {
    return Object.keys(dependencies)
        .filter((dep) => dep.startsWith(PACKAGE_SCOPE) === wantScoped)
        .toSorted((left, right) => left.localeCompare(right));
};

export const inspectPackage = function inspectPackage(packageDir: string, context: InspectContext): PackageInfo | null {
    const manifest = readJsonSafe(join(packageDir, PACKAGE_FILE));
    if (!isPlainRecord(manifest) || typeof manifest["name"] !== "string") {
        return null;
    }
    const readme = readTextSafe(join(packageDir, README_FILE));
    const stats = collectSourceStats(packageDir, isExcluded);
    const declared = manifest["dependencies"];
    const dependencies = isPlainRecord(declared) ? declared : {};
    return {
        barrelExports: collectBarrelExports(packageDir),
        description: stringOr(manifest["description"], ""),
        externalDeps: scopedDeps(dependencies, false),
        group: context.group,
        hasReadme: readme !== null,
        name: manifest["name"],
        path: relative(context.repoRoot, packageDir).split(sep).join(POSIX_SEPARATOR),
        purpose: extractPurpose(readme),
        siblingDeps: scopedDeps(dependencies, true),
        slug: context.packageName,
        sourceFiles: stats.fileCount,
        sourceLoc: stats.loc,
        version: stringOr(manifest["version"], DEFAULT_VERSION),
    };
};
