import type { CatalogEntry, ManifestModule, ManifestPlugin, PluginContext, QueryCriteria } from "#types/manifest.types";
import { arrayField, recordField, stringField } from "#core/selectors/record.selector";
import { loadPlugins, loadUserManifestPlugins } from "#core/loaders/section.loader";
import type { Manifest } from "#types/readme.types";
import { PACKAGE_SCOPE } from "#configuration/constants/manifest.constants";
import { ROOT } from "@ssot/paths";
import { discoverModules } from "#core/loaders/manifest.loader";
import { isPlainRecord } from "#core/predicates/record.predicate";
import { moduleError } from "#configuration/strings/manifest.strings";
import { validateManifest } from "#core/validators/manifest.validator";

type CriterionCheck = (manifest: Manifest, module: ManifestModule, criteria: QueryCriteria) => boolean;

const VISIBILITY_KEY = "visibility";
const PRIVATE_FLAG = "private";
const HIDDEN_FLAG = "hidden";
const PUBLIC_SCOPE = "public";

const shortName = function shortName(scoped: string): string {
    return scoped.startsWith(PACKAGE_SCOPE) ? scoped.slice(PACKAGE_SCOPE.length) : scoped;
};

const directDeps = function directDeps(pkg: ManifestModule["pkg"]): string[] {
    const deps = pkg["dependencies"];
    return Object.keys(isPlainRecord(deps) ? deps : {})
        .filter((dep) => dep.startsWith(PACKAGE_SCOPE))
        .map(shortName);
};

const visibilityFlag = function visibilityFlag(manifest: Manifest, flag: string): boolean {
    return recordField(manifest, VISIBILITY_KEY)?.[flag] === true;
};

const hasDomain = function hasDomain(manifest: Manifest, domain: string): boolean {
    return arrayField(manifest, "domains").some((entry) => isPlainRecord(entry) && entry["meta"] === domain);
};

const CRITERIA_CHECKS: readonly CriterionCheck[] = [
    (_manifest, module, criteria) => criteria.group === undefined || module.group === criteria.group,
    (manifest, _module, criteria) => criteria.maturity === undefined || manifest["maturity"] === criteria.maturity,
    (manifest, module, criteria) =>
        criteria.ecosystem === undefined ||
        (stringField(manifest, "ecosystem") ?? module.ecosystemHint) === criteria.ecosystem,
    (manifest, _module, criteria) =>
        criteria.capability === undefined || arrayField(manifest, "capabilities").includes(criteria.capability),
    (manifest, _module, criteria) => criteria.domain === undefined || hasDomain(manifest, criteria.domain),
    (manifest, _module, criteria) => criteria.visibility !== PRIVATE_FLAG || visibilityFlag(manifest, PRIVATE_FLAG),
    (manifest, _module, criteria) =>
        criteria.visibility !== PUBLIC_SCOPE ||
        (!visibilityFlag(manifest, PRIVATE_FLAG) && !visibilityFlag(manifest, HIDDEN_FLAG)),
];

const matchesQuery = function matchesQuery(module: ManifestModule, criteria: QueryCriteria): boolean {
    return CRITERIA_CHECKS.every((check) => check(module.manifest, module, criteria));
};

const transitiveRequires = function transitiveRequires(
    slug: string,
    directMap: ReadonlyMap<string, string[]>,
): string[] {
    const found = new Set<string>();
    const stack = [...(directMap.get(slug) ?? [])];
    for (let dep = stack.pop(); dep !== undefined; dep = stack.pop()) {
        if (!found.has(dep) && dep !== slug) {
            found.add(dep);
            stack.push(...(directMap.get(dep) ?? []));
        }
    }
    return [...found].toSorted((left, right) => left.localeCompare(right));
};

export class ManifestRegistry {
    public readonly directMap: ReadonlyMap<string, string[]>;
    public readonly modules: readonly ManifestModule[];
    public readonly plugins: readonly ManifestPlugin[];

    public constructor(modules: readonly ManifestModule[], plugins: readonly ManifestPlugin[]) {
        this.modules = modules;
        this.plugins = plugins;
        this.directMap = new Map(modules.map((module) => [module.slug, directDeps(module.pkg)]));
    }

    public static async create(): Promise<ManifestRegistry> {
        const [corePlugins, userPlugins] = await Promise.all([loadPlugins(), loadUserManifestPlugins(ROOT)]);
        return new ManifestRegistry(discoverModules(), [...corePlugins, ...userPlugins]);
    }

    public validateAll(): string[] {
        return this.modules.flatMap((module) =>
            validateManifest(module.manifest, this.plugins).map((error) => moduleError(module.label, error)),
        );
    }

    public requires(slug: string): string[] {
        return transitiveRequires(slug, this.directMap);
    }

    public query(criteria: QueryCriteria = {}): ManifestModule[] {
        return this.modules.filter((module) => matchesQuery(module, criteria));
    }

    public catalog(): CatalogEntry[] {
        return this.modules
            .filter((module) => !this.plugins.some((plugin) => plugin.filter?.(module.manifest, module) === true))
            .map((module) => this.entryFor(module))
            .toSorted((left, right) => left.value.localeCompare(right.value));
    }

    private entryFor(module: ManifestModule): CatalogEntry {
        const entry: CatalogEntry = { category: module.group, value: module.slug };
        const context: PluginContext = { module, requires: (slug: string) => this.requires(slug) };
        for (const plugin of this.plugins) {
            plugin.contribute?.(module.manifest, entry, context);
        }
        return entry;
    }
}
