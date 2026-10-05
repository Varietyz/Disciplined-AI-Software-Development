import { ACTIVITY_VERBS, DOC_CONCERNS } from "#configuration/constants/concern.constants";
import { DEFAULT_ROOT_PREFIX, REFERENCE_EXTENSIONS } from "#configuration/constants/document.constants";
import type { DocsHost, ValidateCtx } from "#types/environment.types";
import {
    type PathExclusion,
    docsConfig,
    loadGovlabConfig,
    masterExcludeMarkers,
    pathExclusion,
} from "@govlab/quality/config";
import { join, relative, resolve, sep } from "node:path";
import { DOC_FORMS } from "#configuration/constants/form.constants";
import { DOC_VERBS } from "#configuration/constants/verb.constants";
import { SELF_GOVERNED_KEY } from "#configuration/constants/manifest.constants";
import { discoverManifests } from "#core/loaders/manifest.loader";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { loadUserRegistries } from "#core/loaders/registry.loader";
import { readDirSafe } from "#core/loaders/base.loader";

const DOCS_TOOL = "docs";
const POSIX_SEPARATOR = "/";

const posixRelative = function posixRelative(root: string, path: string): string {
    return relative(root, path).split(sep).join(POSIX_SEPARATOR);
};

const indexPaths = function indexPaths(
    dir: string,
    rel: string,
    index: Map<string, string[]>,
    excluded: PathExclusion,
): void {
    for (const entry of readDirSafe(dir)) {
        const relPath = rel === "" ? entry.name : [rel, entry.name].join(POSIX_SEPARATOR);
        const folder = entry.isDirectory();
        if (!folder || !excluded(relPath)) {
            index.set(entry.name, [...(index.get(entry.name) ?? []), relPath]);
        }
        if (folder && !excluded(relPath)) {
            indexPaths(join(dir, entry.name), relPath, index, excluded);
        }
    }
};

const fileIndexOf = function fileIndexOf(root: string, excluded: PathExclusion): Map<string, string[]> {
    const index = new Map<string, string[]>();
    indexPaths(root, "", index, excluded);
    return index;
};

export const delegatedRoots = function delegatedRoots(root: string): string[] {
    return discoverManifests(root)
        .filter((module) => isPlainRecord(module.manifest[SELF_GOVERNED_KEY]))
        .map((module) => `${module.relPath}${POSIX_SEPARATOR}`);
};

const walker = function walker(excluded: PathExclusion): DocsHost["walk"] {
    const walk = function walk(dir: string, suffix: string): string[] {
        return readDirSafe(dir).flatMap((entry) => {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) {
                return excluded(full) ? [] : walk(full, suffix);
            }
            return entry.name.endsWith(suffix) ? [full] : [];
        });
    };
    return walk;
};

const underHarness = function underHarness(harnessRoot: string | null, tail: unknown): string | null {
    return harnessRoot !== null && typeof tail === "string" ? harnessRoot + tail : null;
};

export const docsHostFor = async function docsHostFor(rootDir: string): Promise<DocsHost> {
    const root = resolve(rootDir);
    const config = await loadGovlabConfig(root);
    const docs = docsConfig(config);
    const { harness } = docs;
    const harnessRoot = harness?.root ?? null;
    const userReg = await loadUserRegistries(
        root,
        { activityVerbs: ACTIVITY_VERBS, concerns: DOC_CONCERNS, forms: DOC_FORMS, refVerbs: DOC_VERBS },
        { allowGlobal: config.extensions?.global ?? false },
    );
    const excluded = pathExclusion(root, [...masterExcludeMarkers(config, DOCS_TOOL), ...docs.ignore]);
    const topLevel = new Set(
        readDirSafe(root)
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name),
    );
    const toRelative = (path: string): string => posixRelative(root, path);
    const registries = { concerns: userReg.concerns, forms: userReg.forms, owners: docs.members };
    const locationOptions = { rootPrefix: DEFAULT_ROOT_PREFIX };
    const ctx: ValidateCtx = {
        boundaryDocs: new Set(docs.boundaryDocs),
        delegatedRoots: delegatedRoots(root),
        harnessAdapter: underHarness(harnessRoot, harness?.adapter),
        harnessAgentDir: underHarness(harnessRoot, harness?.agentDir),
        harnessProfiles: harness?.profiles ?? [],
        harnessRoot,
        locationOptions,
        paths: {
            codeExtensions: REFERENCE_EXTENSIONS,
            fileIndex: fileIndexOf(root, excluded),
            root,
            runtimeRoots: [...(harness?.runtimeRoots ?? [])],
            topLevel,
        },
        registries,
        relative: toRelative,
        root,
        rootPrefix: DEFAULT_ROOT_PREFIX,
        userReg,
    };
    return {
        ctx,
        locationOptions,
        registries,
        relative: toRelative,
        root,
        rootPrefix: DEFAULT_ROOT_PREFIX,
        userReg,
        walk: walker(excluded),
    };
};
