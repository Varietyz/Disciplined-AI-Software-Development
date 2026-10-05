import { DOCS_CACHE_NAME, NO_CACHE_ENV, NO_CACHE_ON } from "#configuration/constants/invocation.constants";
import { MANIFEST_FILE, PACKAGE_FILE, README_FILE } from "#configuration/constants/document.constants";
import { ROOT, absolutePath } from "@ssot/paths";
import {
    cacheFile,
    collectFiles,
    createFingerprintIndex,
    fingerprint,
    fingerprintOf,
} from "@govlab/content-fingerprint";
import type { FingerprintIndex } from "@govlab/content-fingerprint";
import { excludeMatcher } from "@govlab/quality/config";
import { existsSync } from "node:fs";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { join } from "node:path";
import { readJsonSafe } from "#core/loaders/base.loader";

const GENERATED_MARK = ".generated.";
const TEST_MARKERS: readonly string[] = [".test.", ".spec."];
const isExcluded = await excludeMatcher(ROOT);

const isSharedInput = function isSharedInput(name: string): boolean {
    return (
        name !== README_FILE && !name.includes(GENERATED_MARK) && !TEST_MARKERS.some((marker) => name.includes(marker))
    );
};

const inputsUnder = function inputsUnder(dir: string): string[] {
    return collectFiles(dir, { excluded: isExcluded, include: isSharedInput });
};

const SHARED_HASH = fingerprint([
    absolutePath("govlab.quality.generated.concepts"),
    absolutePath("govlab.quality.generated.rules"),
    absolutePath("govlabHost.config"),
    ...[
        absolutePath("govlab.context.principles"),
        absolutePath("govlab.docs"),
        absolutePath("govlab.utils.canonicalWrite"),
    ].flatMap(inputsUnder),
]);

export const cacheForced = function cacheForced(env: Readonly<Record<string, string | undefined>>): boolean {
    return env[NO_CACHE_ENV] === NO_CACHE_ON;
};

const packageAt = function packageAt(rel: string): Record<string, unknown> {
    const parsed = readJsonSafe(join(ROOT, rel, PACKAGE_FILE));
    return isPlainRecord(parsed) ? parsed : {};
};

const dependencyNamesOf = function dependencyNamesOf(rel: string): string[] {
    const { dependencies } = packageAt(rel);
    return isPlainRecord(dependencies) ? Object.keys(dependencies) : [];
};

const membersByName = function membersByName(modules: readonly string[]): ReadonlyMap<string, string> {
    return new Map(
        modules.flatMap((rel) => {
            const { name } = packageAt(rel);
            return typeof name === "string" ? [[name, rel] as const] : [];
        }),
    );
};

const dependencyClosure = function dependencyClosure(rel: string, byName: ReadonlyMap<string, string>): string[] {
    const reached = new Set([rel]);
    const pending = [rel];
    for (let next = pending.pop(); next !== undefined; next = pending.pop()) {
        for (const member of dependencyNamesOf(next).flatMap((name) => byName.get(name) ?? [])) {
            if (!reached.has(member)) {
                reached.add(member);
                pending.push(member);
            }
        }
    }
    return [...reached].toSorted((left, right) => left.localeCompare(right));
};

export const moduleKey = function moduleKey(rel: string, modules: readonly string[]): string {
    const inputs = dependencyClosure(rel, membersByName(modules)).flatMap((member) => inputsUnder(join(ROOT, member)));
    return fingerprintOf([fingerprint(inputs), SHARED_HASH]);
};

export const workspaceMapKey = function workspaceMapKey(modules: readonly string[]): string {
    const inputs = modules.flatMap((rel) => [join(ROOT, rel, MANIFEST_FILE), join(ROOT, rel, PACKAGE_FILE)]);
    return fingerprintOf([fingerprint(inputs), SHARED_HASH]);
};

export const createDocIndex = function createDocIndex(force: boolean): FingerprintIndex {
    return createFingerprintIndex({ file: cacheFile(DOCS_CACHE_NAME), force });
};

const hasDocsBlock = function hasDocsBlock(rel: string): boolean {
    const parsed = readJsonSafe(join(ROOT, rel, MANIFEST_FILE));
    return isPlainRecord(parsed) && isPlainRecord(parsed.docs);
};

export const selectStaleModules = function selectStaleModules(
    index: FingerprintIndex,
    modules: readonly string[],
    keyByModule: ReadonlyMap<string, string>,
): string[] {
    return modules.filter(
        (rel) =>
            !index.unchanged(rel, keyByModule.get(rel) ?? "") ||
            (hasDocsBlock(rel) && !existsSync(join(ROOT, rel, README_FILE))),
    );
};
