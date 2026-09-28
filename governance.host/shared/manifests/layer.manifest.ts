import { GOVERNED_ROOT, collapsePath } from "../resolvers/anchor.resolver.ts";
import { folderFor, isDeclaredContainer } from "./taxonomy.manifest.ts";
import { undeclaredConcernTag, undeclaredTierContainer } from "../strings/taxonomy.strings.ts";

const MEMBER_PREFIX = `${GOVERNED_ROOT}/`;

const container = function container(name: string): string {
    if (!isDeclaredContainer(GOVERNED_ROOT, name)) {
        throw new Error(undeclaredTierContainer(name, GOVERNED_ROOT));
    }
    return name;
};

const concern = function concern(tag: string): string {
    const folder = folderFor(tag);
    if (folder === undefined) {
        throw new Error(undeclaredConcernTag(tag));
    }
    return folder;
};

export const PLATFORM_PATH_PREFIXES = [`${container("core")}/`];

export const PRODUCT_PATH_PREFIXES = [
    `${container("domain")}/`,
    `${container("presentation")}/`,
    `${container("runtime")}/`,
];

const TYPES_PREFIX = `${container("types")}/`;

export const DERIVATION_MODULES: ReadonlySet<string> = new Set([
    `${container("core")}/${concern("loader")}/definition.loader.ts`,
    `${container("core")}/${concern("converter")}/definition.converter.ts`,
    `${container("core")}/${concern("matcher")}/vocabulary.matcher.ts`,
    `${container("configuration")}/${concern("constants")}/evidence.source.constants.ts`,
    `${container("domain")}/${concern("converter")}/link.vocabulary.converter.ts`,
    `${container("domain")}/${concern("converter")}/source.link.converter.ts`,
    `${container("domain")}/${concern("converter")}/anatomy.reference.converter.ts`,
]);

const STRINGS_PREFIX = `${container("configuration")}/${concern("strings")}/`;

export const STRING_LAYERS = new Map<string, string>([[`${STRINGS_PREFIX}report.strings.ts`, "platform"]]);

export const TYPE_LAYERS = new Map<string, string>();

export const normalizePath = function normalizePath(path: string): string {
    return path.split("\\").join("/");
};

export const relativeFromMember = function relativeFromMember(filepath: string): string {
    const norm = normalizePath(filepath);
    const idx = norm.indexOf(MEMBER_PREFIX);
    return idx === -1 ? norm : norm.slice(idx + MEMBER_PREFIX.length);
};

const PER_FILE_OVERRIDES: readonly ReadonlyMap<string, string>[] = [TYPE_LAYERS, STRING_LAYERS];

const overrideFor = function overrideFor(rel: string): string | null {
    for (const declared of PER_FILE_OVERRIDES) {
        const hit = declared.get(rel);
        if (hit !== undefined) {
            return hit;
        }
    }
    return null;
};

const prefixTier = function prefixTier(rel: string): string | null {
    if (PLATFORM_PATH_PREFIXES.some((prefix) => rel.startsWith(prefix))) {
        return "platform";
    }
    return PRODUCT_PATH_PREFIXES.some((prefix) => rel.startsWith(prefix)) ? "product" : null;
};

export const classifyFile = function classifyFile(filepath: string): string | null {
    const rel = relativeFromMember(filepath);
    const declared = overrideFor(rel);
    if (declared !== null) {
        return declared;
    }
    if (rel.startsWith(TYPES_PREFIX)) {
        return null;
    }
    return rel.startsWith(STRINGS_PREFIX) ? "product" : prefixTier(rel);
};

export const resolveImportPath = function resolveImportPath(importerFile: string, importStr: string): string | null {
    if (!importStr.startsWith(".")) {
        return null;
    }
    const rel = relativeFromMember(importerFile);
    const importerDir = rel.slice(0, rel.lastIndexOf("/"));
    return collapsePath(`${importerDir}/${importStr}`);
};
